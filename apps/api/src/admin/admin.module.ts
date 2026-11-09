import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { LocalStorageService } from '../storage/local-storage.service';
import { AuthModule } from '../auth/auth.module';
import { ProgressModule } from '../progress/progress.module';

@Module({
  imports: [AuthModule, ProgressModule],
  providers: [AdminService, LocalStorageService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
