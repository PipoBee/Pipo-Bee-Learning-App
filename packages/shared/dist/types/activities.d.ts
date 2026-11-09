export type ActivityType = 'LISTEN_PICK' | 'SOUND_MATCHING' | 'BLEND_READ' | 'SAY_SOUND' | 'TRACE_LETTER' | 'SPELL_WORD' | 'LEVEL_TEST';
export interface StrokePoint {
    x: number;
    y: number;
    order: number;
}
export interface StrokeGuide {
    id: string;
    points: {
        x: number;
        y: number;
    }[];
    instruction: string;
    startPoint: {
        x: number;
        y: number;
    };
    endPoint: {
        x: number;
        y: number;
    };
}
export interface TracingPathData {
    grapheme: string;
    phoneme: string;
    viewBox: {
        width: number;
        height: number;
    };
    svgPath: string;
    guideStrokes: StrokeGuide[];
    sampleWords: string[];
}
export interface ListenPickOption {
    id: string;
    label: string;
    audioText?: string;
    imageUrl?: string;
    isCorrect: boolean;
}
export interface TaskItem {
    id: string;
    orderIndex: number;
    targetGrapheme: string;
    targetPhoneme: string;
    targetWord?: string;
    promptText: string;
    promptAudioUrl?: string;
    promptImageUrl?: string;
    options?: ListenPickOption[];
    tracingData?: TracingPathData;
}
export interface Task {
    id: string;
    levelId: string;
    taskType: ActivityType;
    orderIndex: number;
    title: string;
    instructionText: string;
    instructionAudioUrl?: string;
    items: TaskItem[];
}
//# sourceMappingURL=activities.d.ts.map