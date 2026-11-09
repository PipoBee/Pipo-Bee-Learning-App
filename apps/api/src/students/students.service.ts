import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../database/prisma.service';
import { ProgressService } from '../progress/progress.service';

@Injectable()
export class StudentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly progressService: ProgressService,
  ) {}

  async getFirstLevel(studentId: string) {
    const level = await this.prisma.level.findFirst({
      include: {
        world: true,
        tasks: {
          orderBy: { orderIndex: 'asc' },
          include: {
            items: { orderBy: { orderIndex: 'asc' } },
          },
        },
      },
      orderBy: [{ world: { orderIndex: 'asc' } }, { orderIndex: 'asc' }],
    });

    if (!level) {
      throw new NotFoundException('Level 1 has not been seeded yet');
    }

    const progress = await this.prisma.studentProgress.findUnique({
      where: { studentId_levelId: { studentId, levelId: level.id } },
    });

    return {
      level: {
        id: level.id,
        title: level.title,
        subtitle: level.subtitle,
        soundLabel: level.soundLabel,
        worldTitle: level.world.title,
        passThresholdScore: level.passThresholdScore,
        isUnlocked: progress?.isUnlocked ?? true,
        isCompleted: progress?.isCompleted ?? false,
        starsEarned: progress?.starsEarned ?? 0,
        highScore: progress?.highScore ?? 0,
      },
      tasks: level.tasks.map((task) => ({
        id: task.id,
        taskType: task.taskType,
        title: task.title,
        instructionText: task.instructionText,
        items: task.items.map((item) => ({
          id: item.id,
          orderIndex: item.orderIndex,
          targetGrapheme: item.targetGrapheme,
          targetPhoneme: item.targetPhoneme,
          targetWord: item.targetWord,
          promptText: item.promptText,
          options: Array.isArray(item.optionsJson) ? item.optionsJson : [],
        })),
      })),
    };
  }

  async completeLevel(
    studentId: string,
    levelId: string,
    body: { score: number; correctCount: number; totalCount: number },
  ) {
    const level = await this.prisma.level.findUnique({
      where: { id: levelId },
      include: {
        world: true,
        tasks: { orderBy: { orderIndex: 'asc' }, take: 1 },
      },
    });

    if (!level) {
      throw new NotFoundException('Level not found');
    }

    const existing = await this.prisma.studentProgress.findUnique({
      where: { studentId_levelId: { studentId, levelId } },
    });

    const passed = body.score >= (level.passThresholdScore || 70);
    const stars = passed ? (body.score >= 90 ? 3 : body.score >= 80 ? 2 : 1) : 0;
    const firstClear = passed && !existing?.isCompleted;

    await this.prisma.studentProgress.upsert({
      where: { studentId_levelId: { studentId, levelId } },
      create: {
        studentId,
        levelId,
        isUnlocked: true,
        isCompleted: passed,
        starsEarned: stars,
        highScore: body.score,
        totalAttempts: 1,
        lastAttemptAt: new Date(),
      },
      update: {
        isUnlocked: true,
        isCompleted: existing?.isCompleted || passed,
        starsEarned: Math.max(existing?.starsEarned ?? 0, stars),
        highScore: Math.max(existing?.highScore ?? 0, body.score),
        totalAttempts: { increment: 1 },
        lastAttemptAt: new Date(),
      },
    });

    if (passed) {
      const levels = await this.prisma.level.findMany({
        include: { world: true },
        orderBy: [{ world: { orderIndex: 'asc' } }, { orderIndex: 'asc' }],
      });
      const index = levels.findIndex((item) => item.id === levelId);
      const next = levels[index + 1];
      if (next) {
        await this.prisma.studentProgress.upsert({
          where: { studentId_levelId: { studentId, levelId: next.id } },
          create: {
            studentId,
            levelId: next.id,
            isUnlocked: true,
            isCompleted: false,
          },
          update: { isUnlocked: true },
        });
      }
    }

    if (firstClear && stars > 0) {
      await this.prisma.studentProfile.update({
        where: { id: studentId },
        data: {
          totalStars: { increment: stars },
          totalCoins: { increment: stars * 10 },
        },
      });
    }

    const phoneme = (level.soundLabel || 's').toLowerCase();
    const masteryScore = body.score / 100;
    const previous = await this.prisma.studentSoundMastery.findUnique({
      where: { studentId_phoneme: { studentId, phoneme } },
    });

    await this.prisma.studentSoundMastery.upsert({
      where: { studentId_phoneme: { studentId, phoneme } },
      create: {
        studentId,
        phoneme,
        masteryScore,
        totalAttempts: body.totalCount,
        correctAttempts: body.correctCount,
        isWeakFlag: body.score < 65,
      },
      update: {
        masteryScore: Math.max(previous?.masteryScore ?? 0, masteryScore),
        totalAttempts: { increment: body.totalCount },
        correctAttempts: { increment: body.correctCount },
        isWeakFlag: Math.max(previous?.masteryScore ?? 0, masteryScore) < 0.65,
        lastPracticedAt: new Date(),
      },
    });

    const firstTaskId = level.tasks[0]?.id;
    if (firstTaskId) {
      await this.prisma.attempt.create({
        data: {
          clientId: randomUUID(),
          studentId,
          taskId: firstTaskId,
          isCorrect: passed,
          score: body.score,
          attemptNumber: (existing?.totalAttempts ?? 0) + 1,
        },
      });
    }

    return this.progressService.buildDashboard(studentId);
  }
}
