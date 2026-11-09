import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../database/prisma.service';
import { ProgressService } from '../progress/progress.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly progressService: ProgressService,
  ) {}

  async register(input: {
    fullName: string;
    email: string;
    password: string;
    role: 'STUDENT' | 'PARENT';
  }) {
    const email = input.email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const role = input.role === 'PARENT' ? Role.PARENT : Role.STUDENT;

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName: input.fullName.trim(),
        role,
      },
    });

    if (role === Role.STUDENT) {
      const displayName = input.fullName.trim().split(/\s+/)[0] || 'Learner';
      const profile = await this.prisma.studentProfile.create({
        data: {
          userId: user.id,
          displayName,
          avatarId: 'parrot_01',
          age: 6,
        },
      });
      await this.progressService.initializeProgress(profile.id);
    }

    return this.login(email, input.password);
  }

  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      include: { students: { orderBy: { createdAt: 'asc' } } },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  async login(email: string, pass: string) {
    const user = await this.validateUser(email, pass);
    return this.toAuthResponse(user);
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { students: { orderBy: { createdAt: 'asc' } } },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      children: user.students.map((learner) => this.toChildDto(learner)),
    };
  }

  private toAuthResponse(user: {
    id: string;
    email: string;
    fullName: string;
    role: Role;
    createdAt: Date;
    students: {
      id: string;
      displayName: string;
      avatarId: string;
      age: number;
      totalStars: number;
      totalCoins: number;
      streakDays: number;
    }[];
  }) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const learner = user.students[0] ?? null;

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
      },
      accessToken: this.jwtService.sign(payload),
      studentProfile: learner ? this.toChildDto(learner) : undefined,
      children: user.students.map((child) => this.toChildDto(child)),
    };
  }

  private toChildDto(learner: {
    id: string;
    displayName: string;
    avatarId: string;
    age: number;
    totalStars: number;
    totalCoins: number;
    streakDays: number;
  }) {
    return {
      id: learner.id,
      displayName: learner.displayName,
      avatarId: learner.avatarId,
      age: learner.age,
      totalStars: learner.totalStars,
      totalCoins: learner.totalCoins,
      streakDays: learner.streakDays,
    };
  }
}
