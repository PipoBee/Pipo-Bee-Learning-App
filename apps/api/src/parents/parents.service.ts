import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ProgressService } from '../progress/progress.service';

const MAX_CHILDREN = 3;
const AVATARS = ['parrot_01', 'owl_01', 'fox_01', 'bear_01', 'bunny_01'];

@Injectable()
export class ParentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly progressService: ProgressService,
  ) {}

  async listChildren(parentId: string) {
    const children = await this.prisma.studentProfile.findMany({
      where: { userId: parentId },
      orderBy: { createdAt: 'asc' },
    });

    return {
      maxChildren: MAX_CHILDREN,
      remainingSlots: Math.max(0, MAX_CHILDREN - children.length),
      children: children.map((child) => this.toChildCard(child)),
    };
  }

  async createChild(
    parentId: string,
    input: { displayName: string; age?: number; avatarId?: string },
  ) {
    const existing = await this.prisma.studentProfile.count({
      where: { userId: parentId },
    });

    if (existing >= MAX_CHILDREN) {
      throw new BadRequestException(`A parent can create at most ${MAX_CHILDREN} child dashboards`);
    }

    const displayName = input.displayName.trim();
    if (displayName.length < 2) {
      throw new BadRequestException('Child name must be at least 2 characters');
    }

    const age = input.age ?? 6;
    if (age < 3 || age > 14) {
      throw new BadRequestException('Child age must be between 3 and 14');
    }

    const avatarId = AVATARS.includes(input.avatarId || '')
      ? (input.avatarId as string)
      : AVATARS[existing % AVATARS.length];

    const child = await this.prisma.studentProfile.create({
      data: {
        userId: parentId,
        displayName,
        age,
        avatarId,
      },
    });

    await this.progressService.initializeProgress(child.id);
    return this.toChildCard(child);
  }

  async getChildDashboard(parentId: string, childId: string) {
    await this.assertOwnsChild(parentId, childId);
    return this.progressService.buildDashboard(childId);
  }

  async deleteChild(parentId: string, childId: string) {
    await this.assertOwnsChild(parentId, childId);
    await this.prisma.studentProfile.delete({ where: { id: childId } });
    return { success: true };
  }

  private async assertOwnsChild(parentId: string, childId: string) {
    const child = await this.prisma.studentProfile.findUnique({
      where: { id: childId },
    });

    if (!child) {
      throw new NotFoundException('Child dashboard not found');
    }

    if (child.userId !== parentId) {
      throw new ForbiddenException('You can only open dashboards for your own children');
    }

    return child;
  }

  private toChildCard(child: {
    id: string;
    displayName: string;
    avatarId: string;
    age: number;
    totalStars: number;
    totalCoins: number;
    streakDays: number;
  }) {
    return {
      id: child.id,
      displayName: child.displayName,
      avatarId: child.avatarId,
      age: child.age,
      totalStars: child.totalStars,
      totalCoins: child.totalCoins,
      streakDays: child.streakDays,
    };
  }
}
