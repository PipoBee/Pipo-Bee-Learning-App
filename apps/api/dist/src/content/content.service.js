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
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let ContentService = class ContentService {
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async getLevelById(id) {
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
            throw new common_1.NotFoundException(`Level ${id} not found`);
        }
        return level;
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContentService);
//# sourceMappingURL=content.service.js.map