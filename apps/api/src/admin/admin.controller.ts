import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AdminService } from './admin.service';

@ApiTags('Admin Dashboard & Curriculum')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('api/v1/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'List every user account and linked children' })
  listUsers() {
    return this.adminService.listUsers();
  }

  @Get('students')
  @ApiOperation({ summary: 'List every learner profile in the system' })
  listStudents() {
    return this.adminService.listStudents();
  }

  @Get('students/:id/dashboard')
  @ApiOperation({ summary: 'Open any learner dashboard' })
  getStudentDashboard(@Param('id') id: string) {
    return this.adminService.getStudentDashboard(id);
  }

  @Get('analytics/learner')
  @ApiOperation({ summary: 'Get learner progress stats, weak sound matrix, and streak' })
  getLearnerAnalytics(@Query('studentId') studentId?: string) {
    return this.adminService.getLearnerAnalytics(studentId);
  }

  @Get('audio')
  @ApiOperation({ summary: 'List all uploaded curriculum audio assets' })
  listAudioAssets() {
    return this.adminService.listAudioAssets();
  }

  @Post('audio/upload')
  @ApiOperation({ summary: 'Upload phoneme sound or word audio file to disk' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadAudio(
    @UploadedFile() file: Express.Multer.File,
    @Body('category') category: 'PHONEME' | 'WORD' | 'INSTRUCTION' | 'SFX',
    @Body('transcript') transcript?: string,
  ) {
    return this.adminService.uploadAudio(file, category, transcript);
  }

  @Delete('audio/:id')
  @ApiOperation({ summary: 'Delete an audio asset from storage' })
  deleteAudio(@Param('id') id: string) {
    return this.adminService.deleteAudio(id);
  }
}
