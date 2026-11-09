# PhonicsQuest — REST API Specification

**Base URL:** `https://api.phonicsquest.app/api/v1` (Development: `http://localhost:3000/api/v1`)  
**Specification Standard:** OpenAPI 3.0 / Swagger UI (`/api/docs`)  
**Authentication Scheme:** `Bearer <JWT_ACCESS_TOKEN>`

---

## 1. Authentication & Accounts (`/auth`)

### `POST /auth/register`
Create parent/teacher account.
- **Request Body:**
  ```json
  {
    "email": "teacher@school.edu",
    "password": "StrongPassword123!",
    "fullName": "Jane Doe",
    "role": "TEACHER" // "PARENT" | "TEACHER"
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "user": {
      "id": "c7a8b6f2-1234-4a56-89bc-0123456789ab",
      "email": "teacher@school.edu",
      "fullName": "Jane Doe",
      "role": "TEACHER"
    },
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "d8e9f0..."
  }
  ```

### `POST /auth/login`
- **Request Body:**
  ```json
  {
    "email": "teacher@school.edu",
    "password": "StrongPassword123!"
  }
  ```
- **Response `200 OK`:** Same payload as register.

### `POST /auth/refresh`
- **Request Body:** `{ "refreshToken": "d8e9f0..." }`
- **Response `200 OK`:** `{ "accessToken": "eyJhbGciOi..." }`

---

## 2. Student Profiles (`/students`)

### `GET /students`
Fetch all students managed by authenticated account.
- **Headers:** `Authorization: Bearer <token>`
- **Response `200 OK`:**
  ```json
  [
    {
      "id": "e1f2a3b4-...",
      "displayName": "Alex",
      "avatarId": "mascot_lion_01",
      "age": 6,
      "totalStars": 42,
      "totalCoins": 150,
      "streakDays": 5,
      "currentWorldId": "w1_island_sounds",
      "currentLevelId": "l1_sound_s"
    }
  ]
  ```

### `POST /students`
Create a new student profile.
- **Request Body:**
  ```json
  {
    "displayName": "Leo",
    "avatarId": "mascot_parrot_02",
    "age": 7,
    "clientId": "f9a8b7c6-..."
  }
  ```

### `GET /students/:id/mastery`
Get sound mastery analytics and weak sounds for adaptive practice.
- **Response `200 OK`:**
  ```json
  {
    "studentId": "e1f2a3b4-...",
    "masteryList": [
      {
        "phoneme": "s",
        "masteryScore": 0.95,
        "totalAttempts": 20,
        "correctAttempts": 19,
        "isWeak": false
      },
      {
        "phoneme": "p",
        "masteryScore": 0.55,
        "totalAttempts": 12,
        "correctAttempts": 6,
        "isWeak": true
      }
    ]
  }
  ```

---

## 3. Curriculum & Content Delivery (`/content`)

### `GET /content/manifest`
Check for latest published curriculum version and asset bundles.
- **Response `200 OK`:**
  ```json
  {
    "latestVersion": "1.0.4",
    "publishedAt": "2026-10-01T12:00:00Z",
    "bundleUrl": "https://cdn.phonicsquest.app/bundles/content-v1.0.4.json.gz",
    "bundleChecksum": "sha256:4a8bc9...",
    "worldsCount": 5,
    "levelsCount": 25
  }
  ```

### `GET /content/bundle`
Full JSON export of all published worlds, levels, tasks, and task items for local SQLite hydration.

---

## 4. Offline Synchronization Engine (`/sync`)

### `POST /sync/push`
Push local queue of offline attempts and progress updates.
- **Request Body:**
  ```json
  {
    "studentId": "e1f2a3b4-...",
    "lastSyncTimestamp": "2026-10-03T18:30:00Z",
    "attempts": [
      {
        "clientId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "taskId": "task-uuid-1",
        "taskItemId": "item-uuid-1",
        "isCorrect": true,
        "score": 100,
        "speechConfidence": 0.88,
        "durationMs": 3200,
        "attemptNumber": 1,
        "createdAt": "2026-10-04T08:15:00Z"
      }
    ],
    "progressUpdates": [
      {
        "levelId": "l1_sound_s",
        "isCompleted": true,
        "starsEarned": 3,
        "highScore": 100
      }
    ],
    "testResults": []
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "syncedAttempts": ["a1b2c3d4-e5f6-7890-abcd-ef1234567890"],
    "syncedLevels": ["l1_sound_s"],
    "syncedAt": "2026-10-04T08:20:00Z"
  }
  ```

### `GET /sync/pull?since={ISO_TIMESTAMP}&studentId={UUID}`
Download remote updates (e.g. assignments or progress made on another device).

---

## 5. Speech Assessment Proxy (`/speech`)

### `POST /speech/assess`
Secure cloud pronunciation evaluation (keeps Azure API keys protected server-side).
- **Headers:**
  - `Content-Type: multipart/form-data`
  - `Authorization: Bearer <token>`
- **Form Data:**
  - `audio`: Audio file binary (WAV, PCM 16kHz 16-bit mono)
  - `referenceText`: Target word or phoneme, e.g. `"sat"` or `"s"`
  - `targetPhoneme`: Optional target phoneme (IPA or Arpabet), e.g. `"s"`
  - `taskType`: `"SAY_SOUND" | "BLEND_READ" | "LEVEL_TEST"`
- **Response `200 OK`:**
  ```json
  {
    "provider": "azure-cloud",
    "expected": "sat",
    "recognized": "sat",
    "confidence": 92.4,
    "passed": true,
    "durationMs": 1420,
    "pronunciationScore": 91.0,
    "fluencyScore": 88.5,
    "completenessScore": 100.0,
    "phonemeScores": [
      { "phoneme": "s", "accuracyScore": 94.0, "errorType": "None" },
      { "phoneme": "æ", "accuracyScore": 89.0, "errorType": "None" },
      { "phoneme": "t", "accuracyScore": 92.0, "errorType": "None" }
    ],
    "rawFeedback": "Clear articulation with good initial consonant plosion."
  }
  ```

---

## 6. Admin & Curriculum Management (`/admin`)

- `POST /admin/worlds`: Create world
- `PATCH /admin/worlds/:id`: Update world metadata
- `POST /admin/levels`: Add level to world
- `POST /admin/tasks`: Add task and items
- `POST /admin/assets/upload`: S3/R2 direct upload (audio/image)
- `GET /admin/reports/analytics?worldId={UUID}`: Class aggregated accuracy, common phoneme errors, and completion rates.
