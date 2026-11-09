import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProgressModule } from '../progress/progress.module';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

@Module({
  imports: [AuthModule, ProgressModule],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
