import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

interface AttemptDto {
  clientId: string;
  taskId: string;
  taskItemId?: string;
  isCorrect: boolean;
  score: number;
  speechConfidence?: number;
  durationMs: number;
  attemptNumber: number;
  createdAt: string;
}

interface ProgressDto {
  levelId: string;
  isCompleted: boolean;
  starsEarned: number;
  highScore: number;
}

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(private readonly prisma: PrismaService) {}

  async processPush(studentId: string, attempts: AttemptDto[], progressUpdates: ProgressDto[]) {
    const syncedAttempts: string[] = [];
    const syncedLevels: string[] = [];

    // Verify student exists by studentProfile ID or User ID, fallback to first learner
    let student = await this.prisma.studentProfile.findFirst({
      where: {
        OR: [
          { id: studentId },
          { userId: studentId },
        ],
      },
    });

    if (!student) {
      student = await this.prisma.studentProfile.findFirst();
      if (!student) {
        throw new Error('No learner profile available to sync');
      }
    }

    const defaultTask = await this.prisma.task.findFirst();
    const defaultLevel = await this.prisma.level.findFirst();

    // 1. Ingest Attempts (Idempotent by clientId)
    for (const att of attempts || []) {
      const existing = await this.prisma.attempt.findUnique({
        where: { clientId: att.clientId },
      });

      if (!existing) {
        // Resolve valid taskId
        let targetTaskId = att.taskId;
        const taskExists = await this.prisma.task.findUnique({
          where: { id: targetTaskId },
        });

        if (!taskExists) {
          const fallbackTask = await this.prisma.task.findFirst({
            where: {
              OR: [
                { levelId: att.taskId.replace('task_', '') },
                { level: { soundLabel: att.taskId } },
              ],
            },
          });
          targetTaskId = fallbackTask ? fallbackTask.id : (defaultTask ? defaultTask.id : att.taskId);
        }

        await this.prisma.attempt.create({
          data: {
            clientId: att.clientId,
            studentId: student.id,
            taskId: targetTaskId,
            taskItemId: att.taskItemId || null,
            isCorrect: att.isCorrect,
            score: att.score,
            speechConfidence: att.speechConfidence || null,
            durationMs: att.durationMs || 0,
            attemptNumber: att.attemptNumber || 1,
            createdAt: att.createdAt ? new Date(att.createdAt) : new Date(),
            syncedAt: new Date(),
          },
        });
      }
      syncedAttempts.push(att.clientId);
    }

    // 2. Reconcile Progress (Highest Stars & High Score Wins)
    for (const prog of progressUpdates || []) {
      let targetLevelId = prog.levelId;
      const levelExists = await this.prisma.level.findUnique({
        where: { id: targetLevelId },
      });

      if (!levelExists) {
        const fallbackLevel = await this.prisma.level.findFirst({
          where: {
            OR: [
              { soundLabel: prog.levelId },
              { id: { contains: prog.levelId } },
            ],
          },
        });
        targetLevelId = fallbackLevel ? fallbackLevel.id : (defaultLevel ? defaultLevel.id : prog.levelId);
      }

      const existing = await this.prisma.studentProgress.findUnique({
        where: {
          studentId_levelId: {
            studentId: student.id,
            levelId: targetLevelId,
          },
        },
      });

      if (existing) {
        await this.prisma.studentProgress.update({
          where: { id: existing.id },
          data: {
            isCompleted: existing.isCompleted || prog.isCompleted,
            starsEarned: Math.max(existing.starsEarned, prog.starsEarned),
            highScore: Math.max(existing.highScore, prog.highScore),
            totalAttempts: existing.totalAttempts + 1,
            lastAttemptAt: new Date(),
            syncedAt: new Date(),
          },
        });
      } else {
        await this.prisma.studentProgress.create({
          data: {
            studentId: student.id,
            levelId: targetLevelId,
            isUnlocked: true,
            isCompleted: prog.isCompleted,
            starsEarned: prog.starsEarned,
            highScore: prog.highScore,
            totalAttempts: 1,
            lastAttemptAt: new Date(),
            syncedAt: new Date(),
          },
        });
      }
      syncedLevels.push(prog.levelId);
    }

    // 3. Recalculate learner total stars & coins
    const allProgress = await this.prisma.studentProgress.findMany({
      where: { studentId: student.id },
    });

    const progressStars = allProgress.reduce((sum, p) => sum + p.starsEarned, 0);
    const totalStars = Math.max(student.totalStars, progressStars);
    const totalCoins = student.totalCoins;

    await this.prisma.studentProfile.update({
      where: { id: student.id },
      data: {
        totalStars,
        totalCoins,
        lastActiveDate: new Date(),
      },
    });

    this.logger.log(`Synced ${syncedAttempts.length} attempts and ${syncedLevels.length} levels for student ${student.displayName}`);

    return {
      success: true,
      syncedAttempts: syncedAttempts.length,
      syncedLevels: syncedLevels.length,
      totalStars,
      totalCoins,
      syncedAt: new Date().toISOString(),
    };
  }

  async processPull(studentId?: string, since?: string) {
    let student = studentId
      ? await this.prisma.studentProfile.findUnique({ where: { id: studentId } })
      : await this.prisma.studentProfile.findFirst();

    if (!student) {
      student = await this.prisma.studentProfile.findFirst();
    }

    if (!student) {
      return { progress: [], soundMastery: [] };
    }

    const sinceDate = since ? new Date(since) : new Date(0);

    const progress = await this.prisma.studentProgress.findMany({
      where: {
        studentId: student.id,
        updatedAt: { gte: sinceDate },
      },
    });

    const soundMastery = await this.prisma.studentSoundMastery.findMany({
      where: { studentId: student.id },
    });

    return {
      studentId: student.id,
      displayName: student.displayName,
      totalStars: student.totalStars,
      totalCoins: student.totalCoins,
      streakDays: student.streakDays,
      progress,
      soundMastery,
      pulledAt: new Date().toISOString(),
    };
  }
}
