import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { withSupabase, SupabaseCtx } from '@supabase/server/adapters/nestjs';
import type { SupabaseContext } from '@supabase/server';
import { SupabaseService } from './supabase.service';

@ApiTags('Supabase')
@Controller('api/v1/supabase')
export class SupabaseController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get('health')
  @UseGuards(withSupabase({ auth: 'none' }))
  @ApiOperation({ summary: 'Check that the Nest API can talk to Supabase' })
  health(@SupabaseCtx() ctx: SupabaseContext) {
    return {
      ok: true,
      authMode: ctx.authMode,
      url: process.env.SUPABASE_URL,
      adminClient: Boolean(this.supabaseService.getAdmin()),
    };
  }

  @Get('todos')
  @UseGuards(withSupabase({ auth: 'none' }))
  @ApiOperation({ summary: 'Query the todos table through the Supabase server client' })
  async todos(@SupabaseCtx() ctx: SupabaseContext) {
    const { data, error } = await ctx.supabase.from('todos').select();
    if (error) {
      return { data: [], error: error.message };
    }
    return { data };
  }
}
