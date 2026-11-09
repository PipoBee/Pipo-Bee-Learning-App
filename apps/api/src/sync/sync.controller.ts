import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional } from 'class-validator';
import { SyncService } from './sync.service';

export class SyncPushDto {
  @ApiProperty()
  @IsString()
  studentId: string;

  @ApiProperty({ type: [Object] })
  @IsArray()
  @IsOptional()
  attempts?: any[];

  @ApiProperty({ type: [Object] })
  @IsArray()
  @IsOptional()
  progressUpdates?: any[];
}

@ApiTags('Offline Synchronization')
@Controller('api/v1/sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('push')
  @ApiOperation({ summary: 'Submit pending offline attempts and level progress' })
  @ApiResponse({ status: 200, description: 'Attempts reconciled idempotently' })
  async push(@Body() body: SyncPushDto) {
    return this.syncService.processPush(body.studentId, body.attempts || [], body.progressUpdates || []);
  }

  @Get('pull')
  @ApiOperation({ summary: 'Pull remote updates for student since timestamp' })
  async pull(@Query('studentId') studentId?: string, @Query('since') since?: string) {
    return this.syncService.processPull(studentId, since);
  }
}
