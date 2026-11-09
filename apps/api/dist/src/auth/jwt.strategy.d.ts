import { Strategy } from 'passport-jwt';
import { PrismaService } from '../database/prisma.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    constructor(prisma: PrismaService);
    validate(payload: {
        sub: string;
        email: string;
        role: string;
    }): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: import(".prisma/client").$Enums.Role;
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
    }>;
}
export {};
