import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ProgressService } from '../progress/progress.service';
import { LocalStorageService } from '../storage/local-storage.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: LocalStorageService,
    private readonly progressService: ProgressService,
  ) {}

  async listUsers() {
    const users = await this.prisma.user.findMany({
      include: { students: { orderBy: { createdAt: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      children: user.students.map((child) => ({
        id: child.id,
        displayName: child.displayName,
        avatarId: child.avatarId,
        age: child.age,
        totalStars: child.totalStars,
        totalCoins: child.totalCoins,
        streakDays: child.streakDays,
      })),
    }));
  }

  async listStudents() {
    const students = await this.prisma.studentProfile.findMany({
      include: {
        user: { select: { id: true, fullName: true, email: true, role: true } },
        progress: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return students.map((student) => {
      const completed = student.progress.filter((item) => item.isCompleted).length;
      const pending = student.progress.filter((item) => item.isUnlocked && !item.isCompleted).length;

      return {
        id: student.id,
        displayName: student.displayName,
        avatarId: student.avatarId,
        age: student.age,
        totalStars: student.totalStars,
        totalCoins: student.totalCoins,
        streakDays: student.streakDays,
        owner: student.user,
        completedLevels: completed,
        pendingLevels: pending,
        totalLevels: student.progress.length,
      };
    });
  }

  async getLearnerAnalytics(studentId?: string) {
    if (studentId) {
      return this.progressService.buildDashboard(studentId);
    }

    const first = await this.prisma.studentProfile.findFirst({
      orderBy: { createdAt: 'asc' },
    });

    if (!first) {
      throw new NotFoundException('No learner profile found in system');
    }

    return this.progressService.buildDashboard(first.id);
  }

  async getStudentDashboard(studentId: string) {
    return this.progressService.buildDashboard(studentId);
  }

  async listAudioAssets() {
    return this.prisma.audioAsset.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async uploadAudio(
    file: Express.Multer.File,
    category: 'PHONEME' | 'WORD' | 'INSTRUCTION' | 'SFX',
    transcript?: string,
  ) {
    const stored = await this.storage.uploadFile(file.buffer, file.originalname, file.mimetype, {
      category,
      transcript,
    });

    return this.prisma.audioAsset.create({
      data: {
        fileName: stored.fileName,
        storageKey: stored.storageKey,
        publicUrl: stored.fileUrl,
        mimeType: stored.mimeType,
        sizeBytes: stored.sizeBytes,
        category: stored.category,
        transcript: stored.transcript || null,
      },
    });
  }

  async deleteAudio(id: string) {
    const asset = await this.prisma.audioAsset.findUnique({ where: { id } });
    if (!asset) {
      throw new NotFoundException(`Asset ${id} not found`);
    }

    await this.storage.deleteFile(asset.storageKey);
    await this.prisma.audioAsset.delete({ where: { id } });
    return { success: true, message: `Deleted asset ${asset.fileName}` };
  }
}
