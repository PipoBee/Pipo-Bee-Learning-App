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
exports.ParentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const progress_service_1 = require("../progress/progress.service");
const MAX_CHILDREN = 3;
const AVATARS = ['parrot_01', 'owl_01', 'fox_01', 'bear_01', 'bunny_01'];
let ParentsService = class ParentsService {
    constructor(prisma, progressService) {
        this.prisma = prisma;
        this.progressService = progressService;
    }
    async listChildren(parentId) {
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
    async createChild(parentId, input) {
        const existing = await this.prisma.studentProfile.count({
            where: { userId: parentId },
        });
        if (existing >= MAX_CHILDREN) {
            throw new common_1.BadRequestException(`A parent can create at most ${MAX_CHILDREN} child dashboards`);
        }
        const displayName = input.displayName.trim();
        if (displayName.length < 2) {
            throw new common_1.BadRequestException('Child name must be at least 2 characters');
        }
        const age = input.age ?? 6;
        if (age < 3 || age > 14) {
            throw new common_1.BadRequestException('Child age must be between 3 and 14');
        }
        const avatarId = AVATARS.includes(input.avatarId || '')
            ? input.avatarId
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
    async getChildDashboard(parentId, childId) {
        await this.assertOwnsChild(parentId, childId);
        return this.progressService.buildDashboard(childId);
    }
    async deleteChild(parentId, childId) {
        await this.assertOwnsChild(parentId, childId);
        await this.prisma.studentProfile.delete({ where: { id: childId } });
        return { success: true };
    }
    async assertOwnsChild(parentId, childId) {
        const child = await this.prisma.studentProfile.findUnique({
            where: { id: childId },
        });
        if (!child) {
            throw new common_1.NotFoundException('Child dashboard not found');
        }
        if (child.userId !== parentId) {
            throw new common_1.ForbiddenException('You can only open dashboards for your own children');
        }
        return child;
    }
    toChildCard(child) {
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
};
exports.ParentsService = ParentsService;
exports.ParentsService = ParentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        progress_service_1.ProgressService])
], ParentsService);
//# sourceMappingURL=parents.service.js.map