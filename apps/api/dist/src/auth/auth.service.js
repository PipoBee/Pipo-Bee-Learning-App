"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma_service_1 = require("../database/prisma.service");
const progress_service_1 = require("../progress/progress.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService, progressService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.progressService = progressService;
    }
    async register(input) {
        const email = input.email.trim().toLowerCase();
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new common_1.ConflictException('An account with this email already exists');
        }
        const passwordHash = await bcrypt.hash(input.password, 10);
        const role = input.role === 'PARENT' ? client_1.Role.PARENT : client_1.Role.STUDENT;
        const user = await this.prisma.user.create({
            data: {
                email,
                passwordHash,
                fullName: input.fullName.trim(),
                role,
            },
        });
        if (role === client_1.Role.STUDENT) {
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
    async validateUser(email, pass) {
        const user = await this.prisma.user.findUnique({
            where: { email: email.trim().toLowerCase() },
            include: { students: { orderBy: { createdAt: 'asc' } } },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const isMatch = await bcrypt.compare(pass, user.passwordHash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        return user;
    }
    async login(email, pass) {
        const user = await this.validateUser(email, pass);
        return this.toAuthResponse(user);
    }
    async getMe(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { students: { orderBy: { createdAt: 'asc' } } },
        });
        if (!user) {
            throw new common_1.UnauthorizedException();
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
    toAuthResponse(user) {
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
    toChildDto(learner) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        progress_service_1.ProgressService])
], AuthService);
//# sourceMappingURL=auth.service.js.map