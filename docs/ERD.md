# PhonicsQuest — Database Entity-Relationship Diagram & Schema Specification

This document details the PostgreSQL relational data model for PhonicsQuest, designed for high data integrity, offline synchronization, and educational phonics analytics.

---

## 1. Complete ERD Diagram (Mermaid)

```mermaid
erDiagram
    users ||--o{ student_profiles : "manages / owns"
    users {
        uuid id PK
        varchar(255) email UK
        varchar(255) password_hash
        varchar(100) full_name
        enum role "ADMIN, TEACHER, PARENT"
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    student_profiles ||--o{ student_progress : "accumulates"
    student_profiles ||--o{ attempts : "submits"
    student_profiles ||--o{ test_results : "completes"
    student_profiles ||--o{ student_sound_mastery : "records"
    student_profiles ||--o{ student_rewards : "earns"
    student_profiles {
        uuid id PK
        uuid user_id FK
        uuid client_id UK
        varchar(100) display_name
        varchar(50) avatar_id
        integer age
        integer total_stars
        integer total_coins
        integer streak_days
        date last_active_date
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    worlds ||--o{ levels : "groups"
    worlds {
        uuid id PK
        varchar(20) code UK "e.g. W1"
        varchar(100) title
        text description
        integer order_index
        varchar(20) theme_color
        varchar(255) background_asset_url
        boolean is_published
        integer version
        timestamptz created_at
        timestamptz updated_at
    }

    levels ||--o{ tasks : "contains"
    levels ||--o{ student_progress : "tracked_by"
    levels ||--o{ test_results : "evaluated_in"
    levels {
        uuid id PK
        uuid world_id FK
        varchar(100) title
        varchar(255) subtitle
        integer order_index
        integer required_stars
        integer pass_threshold_score
        boolean is_test_level
        timestamptz created_at
        timestamptz updated_at
    }

    tasks ||--o{ task_items : "contains"
    tasks ||--o{ attempts : "recorded_under"
    tasks {
        uuid id PK
        uuid level_id FK
        enum task_type "LISTEN_PICK, SOUND_MATCHING, BLEND_READ, SAY_SOUND, TRACE_LETTER, SPELL_WORD, LEVEL_TEST"
        integer order_index
        varchar(150) title
        text instruction_text
        varchar(255) instruction_audio_url
        jsonb config_json
        timestamptz created_at
        timestamptz updated_at
    }

    task_items {
        uuid id PK
        uuid task_id FK
        integer order_index
        varchar(20) target_grapheme "e.g. s, sh"
        varchar(20) target_phoneme "e.g. /s/, /ʃ/"
        varchar(50) target_word "e.g. sat, ship"
        text prompt_text
        varchar(255) prompt_audio_url
        varchar(255) prompt_image_url
        jsonb options_json "choices for matching / picking"
        jsonb stroke_path_data "points & vectors for tracing"
        timestamptz created_at
        timestamptz updated_at
    }

    attempts {
        uuid id PK
        uuid client_id UK "Unique client attempt ID"
        uuid student_id FK
        uuid task_id FK
        uuid task_item_id FK
        boolean is_correct
        integer score "0-100"
        float speech_confidence
        jsonb speech_phoneme_scores
        jsonb response_payload
        integer duration_ms
        integer attempt_number
        timestamptz created_at
        timestamptz synced_at
    }

    test_results {
        uuid id PK
        uuid client_id UK "Unique client test ID"
        uuid student_id FK
        uuid level_id FK
        integer total_score
        integer max_score
        boolean passed
        integer stars_awarded "1-3"
        integer duration_seconds
        timestamptz created_at
        timestamptz synced_at
    }

    student_progress {
        uuid id PK
        uuid student_id FK
        uuid level_id FK
        boolean is_unlocked
        boolean is_completed
        integer high_score
        integer stars_earned
        integer total_attempts
        timestamptz created_at
        timestamptz updated_at
        timestamptz synced_at
    }

    student_sound_mastery {
        uuid id PK
        uuid student_id FK
        varchar(20) phoneme
        float mastery_score "0.00 to 1.00"
        integer total_attempts
        integer correct_attempts
        boolean is_weak_flag
        timestamptz last_practiced_at
        timestamptz updated_at
    }

    rewards_catalog ||--o{ student_rewards : "awarded_in"
    rewards_catalog {
        uuid id PK
        varchar(50) code UK
        varchar(100) title
        enum reward_type "BADGE, AVATAR_ITEM, STICKER"
        varchar(255) asset_url
        jsonb unlock_criteria
        timestamptz created_at
    }

    student_rewards {
        uuid id PK
        uuid client_id UK
        uuid student_id FK
        uuid reward_id FK
        timestamptz unlocked_at
        timestamptz synced_at
    }

    audio_assets {
        uuid id PK
        varchar(255) file_name
        varchar(255) storage_key
        varchar(500) public_url
        varchar(50) mime_type
        integer size_bytes
        enum category "PHONEME, WORD, INSTRUCTION, SFX"
        text transcript
        uuid created_by FK
        timestamptz created_at
    }

    content_versions {
        uuid id PK
        varchar(50) version_tag UK "e.g. v1.0.4"
        text changelog
        varchar(500) bundle_url
        boolean is_active
        timestamptz created_at
    }
```

---

## 2. Table Schemas and Indices

### `users`
- Primary authentication entity for parents and teachers.
- Indexed on `email` (unique).

### `student_profiles`
- Multiple learner profiles under a single parent/teacher account.
- Foreign key: `user_id -> users(id) ON DELETE CASCADE`.
- Indexed on `(user_id, deleted_at)`.
- Client identification: `client_id` for local offline account linking.

### `worlds` & `levels` & `tasks` & `task_items`
- Hierarchical curriculum structure.
- Versioning support via `version` column on `worlds` to identify delta updates.
- Cascading relationships: `worlds -> levels -> tasks -> task_items`.

### `attempts`
- Append-only telemetry log.
- Indexed on `(student_id, created_at)` and `(task_id, is_correct)`.
- Enforces `client_id` uniqueness to prevent duplicate ingestion upon repeated sync retries.

### `student_progress`
- Current state for game map progression.
- Unique compound key: `(student_id, level_id)`.
- Indexed on `student_id` for rapid map rendering.

### `student_sound_mastery`
- Aggregated diagnostic record for teacher dashboards and adaptive game difficulty.
- Unique compound key: `(student_id, phoneme)`.
- Auto-updated via trigger or sync service when attempts are processed.
- `is_weak_flag = TRUE` when accuracy drops below 65% across 3+ attempts.

---

## 3. Offline Synchronization Strategy & Conflict Rules

1. **Attempts & Test Results:**
   - Always append-only.
   - Idempotency key = `client_id`. If `client_id` already exists in PostgreSQL, the record is skipped without error and reported as acknowledged.
2. **Student Progress:**
   - **Stars:** `MAX(server.stars_earned, client.stars_earned)`.
   - **High Score:** `MAX(server.high_score, client.high_score)`.
   - **Unlocked Status:** Once unlocked (`is_unlocked = true`), it cannot be locked again.
3. **Student Profile:**
   - Last-Write-Wins (LWW) based on `updated_at` timestamp.
