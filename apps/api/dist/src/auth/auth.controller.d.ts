import { AuthService } from './auth.service';
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RegisterDto {
    fullName: string;
    email: string;
    password: string;
    role: 'STUDENT' | 'PARENT';
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: RegisterDto): Promise<{
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
    login(body: LoginDto): Promise<{
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
    getMe(req: {
        user: {
            id: string;
        };
    }): Promise<{
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
}
