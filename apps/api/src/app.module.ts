import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { PrismaModule } from './database/prisma.module';
import { StorageModule } from './storage/storage.module';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { SyncModule } from './sync/sync.module';
import { SpeechModule } from './speech/speech.module';
import { AdminModule } from './admin/admin.module';
import { ProgressModule } from './progress/progress.module';
import { StudentsModule } from './students/students.module';
import { ParentsModule } from './parents/parents.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    PrismaModule,
    StorageModule,
    AuthModule,
    ProgressModule,
    StudentsModule,
    ParentsModule,
    ContentModule,
    SyncModule,
    SpeechModule,
    AdminModule,
    SupabaseModule,
    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.cwd(), process.env.UPLOADS_DIR || './uploads'),
      serveRoot: '/uploads',
    }),
  ],
})
export class AppModule {}
