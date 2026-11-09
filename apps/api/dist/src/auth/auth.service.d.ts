import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { ProgressService } from '../progress/progress.service';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly progressService;
    constructor(prisma: PrismaService, jwtService: JwtService, progressService: ProgressService);
    register(input: {
        fullName: string;
        email: string;
        password: string;
        role: 'STUDENT' | 'PARENT';
    }): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: string;
        };
        accessToken: string;
        studentProfile: {
            id: string;
            displayName: string;
            avatarId: string;
            age: number;
            totalStars: number;
            totalCoins: number;
            streakDays: number;
        };
        children: {
            id: string;
            displayName: string;
            avatarId: string;
            age: number;
            totalStars: number;
            totalCoins: number;
            streakDays: number;
        }[];
    }>;
    validateUser(email: string, pass: string): Promise<{
        students: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            displayName: string;
            avatarId: string;
            age: number;
            totalStars: number;
            totalCoins: number;
            streakDays: number;
            lastActiveDate: Date;
            clientId: string | null;
            userId: string;
        }[];
    } & {
        id: string;
        email: string;
        passwordHash: string;
        fullName: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(email: string, pass: string): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: string;
        };
        accessToken: string;
        studentProfile: {
            id: string;
            displayName: string;
            avatarId: string;
            age: number;
            totalStars: number;
            totalCoins: number;
            streakDays: number;
        };
        children: {
            id: string;
            displayName: string;
            avatarId: string;
            age: number;
            totalStars: number;
            totalCoins: number;
            streakDays: number;
        }[];
    }>;
    getMe(userId: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: string;
        children: {
            id: string;
            displayName: string;
            avatarId: string;
            age: number;
            totalStars: number;
            totalCoins: number;
            streakDays: number;
        }[];
    }>;
    private toAuthResponse;
    private toChildDto;
}
