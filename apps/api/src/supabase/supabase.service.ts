import { Injectable, Logger } from '@nestjs/common';
import { createAdminClient, resolveEnv } from '@supabase/server/core';
import type { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private adminClient: SupabaseClient | null = null;

  constructor() {
    const { data: env, error } = resolveEnv();
    if (error) {
      this.logger.warn(`Supabase env not ready: ${error.message}`);
      return;
    }

    if (!process.env.SUPABASE_SECRET_KEY) {
      this.logger.warn('SUPABASE_SECRET_KEY is empty. Paste the full secret key into apps/api/.env to enable the admin client.');
      return;
    }

    this.adminClient = createAdminClient();
    this.logger.log(`Supabase server client ready for ${env.url}`);
  }

  getAdmin(): SupabaseClient | null {
    return this.adminClient;
  }
}
