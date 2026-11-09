import { ContentService } from './content.service';
export declare class ContentController {
    private readonly contentService;
    constructor(contentService: ContentService);
    getBundle(): Promise<{
        version: string;
        publishedAt: string;
        worldsCount: number;
        levelsCount: number;
        worlds: ({
            levels: ({
                tasks: ({
                    items: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        orderIndex: number;
                        targetGrapheme: string;
                        targetPhoneme: string;
                        targetWord: string | null;
                        promptText: string;
                        promptAudioUrl: string | null;
                        promptImageUrl: string | null;
                        optionsJson: import("@prisma/client/runtime/library").JsonValue | null;
                        strokeDataJson: import("@prisma/client/runtime/library").JsonValue | null;
                        taskId: string;
                    }[];
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                    orderIndex: number;
                    levelId: string;
                    taskType: import(".prisma/client").$Enums.TaskType;
                    instructionText: string;
                    instructionAudioUrl: string | null;
                })[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                orderIndex: number;
                subtitle: string;
                soundLabel: string;
                requiredStars: number;
                passThresholdScore: number;
                isTestLevel: boolean;
                worldId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            title: string;
            description: string;
            orderIndex: number;
            themeColor: string;
            accentColor: string;
            iconName: string;
            isPublished: boolean;
        })[];
    }>;
    getWorlds(): Promise<({
        levels: {
            id: string;
            title: string;
            orderIndex: number;
            subtitle: string;
            soundLabel: string;
            requiredStars: number;
            passThresholdScore: number;
            isTestLevel: boolean;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        title: string;
        description: string;
        orderIndex: number;
        themeColor: string;
        accentColor: string;
        iconName: string;
        isPublished: boolean;
    })[]>;
    getLevelById(id: string): Promise<{
        tasks: ({
            items: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                orderIndex: number;
                targetGrapheme: string;
                targetPhoneme: string;
                targetWord: string | null;
                promptText: string;
                promptAudioUrl: string | null;
                promptImageUrl: string | null;
                optionsJson: import("@prisma/client/runtime/library").JsonValue | null;
                strokeDataJson: import("@prisma/client/runtime/library").JsonValue | null;
                taskId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            orderIndex: number;
            levelId: string;
            taskType: import(".prisma/client").$Enums.TaskType;
            instructionText: string;
            instructionAudioUrl: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        orderIndex: number;
        subtitle: string;
        soundLabel: string;
        requiredStars: number;
        passThresholdScore: number;
        isTestLevel: boolean;
        worldId: string;
    }>;
}
