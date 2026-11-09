import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  async getBundle() {
    const worlds = await this.prisma.world.findMany({
      where: { isPublished: true },
      orderBy: { orderIndex: 'asc' },
      include: {
        levels: {
          orderBy: { orderIndex: 'asc' },
          include: {
            tasks: {
              orderBy: { orderIndex: 'asc' },
              include: {
                items: {
                  orderBy: { orderIndex: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    const totalLevels = worlds.reduce((acc, w) => acc + w.levels.length, 0);

    return {
      version: '1.0.0',
      publishedAt: new Date().toISOString(),
      worldsCount: worlds.length,
      levelsCount: totalLevels,
      worlds,
    };
  }

  async getWorlds() {
    return this.prisma.world.findMany({
      where: { isPublished: true },
      orderBy: { orderIndex: 'asc' },
      include: {
        levels: {
          orderBy: { orderIndex: 'asc' },
          select: {
            id: true,
            title: true,
            subtitle: true,
            soundLabel: true,
            orderIndex: true,
            requiredStars: true,
            passThresholdScore: true,
            isTestLevel: true,
          },
        },
      },
    });
  }

  async getLevelById(id: string) {
    const level = await this.prisma.level.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: { orderIndex: 'asc' },
          include: {
            items: {
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
      },
    });

    if (!level) {
      throw new NotFoundException(`Level ${id} not found`);
    }

    return level;
  }
}
