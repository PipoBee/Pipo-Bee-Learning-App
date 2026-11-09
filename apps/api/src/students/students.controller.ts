import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ProgressService } from '../progress/progress.service';
import { StudentsService } from './students.service';

class CompleteLevelDto {
  @ApiProperty({ example: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  score: number;

  @ApiProperty({ example: 4 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  correctCount: number;

  @ApiProperty({ example: 4 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  totalCount: number;
}

@ApiTags('Student Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.STUDENT)
@Controller('api/v1/students')
export class StudentsController {
  constructor(
    private readonly progressService: ProgressService,
    private readonly studentsService: StudentsService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Student progress, completion, and pending work' })
  async getDashboard(@Request() req: { user: { students?: { id: string }[] } }) {
    return this.progressService.buildDashboard(this.requireProfile(req).id);
  }

  @Get('levels/first')
  @ApiOperation({ summary: 'Load Level 1 phonics sound lesson with tasks' })
  getFirstLevel(@Request() req: { user: { students?: { id: string }[] } }) {
    return this.studentsService.getFirstLevel(this.requireProfile(req).id);
  }

  @Post('levels/:id/complete')
  @ApiOperation({ summary: 'Save Level 1 results and unlock the next sound' })
  completeLevel(
    @Request() req: { user: { students?: { id: string }[] } },
    @Param('id') id: string,
    @Body() body: CompleteLevelDto,
  ) {
    return this.studentsService.completeLevel(this.requireProfile(req).id, id, body);
  }

  private requireProfile(req: { user: { students?: { id: string }[] } }) {
    const profile = req.user.students?.[0];
    if (!profile) {
      throw new NotFoundException('No student profile is linked to this account');
    }
    return profile;
  }
}
