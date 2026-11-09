import { SpeechService } from './speech.service';
export declare class SpeechController {
    private readonly speechService;
    constructor(speechService: SpeechService);
    assess(file: Express.Multer.File, referenceText: string, targetPhoneme?: string): Promise<import("@phonicsquest/shared").SpeechRecognitionResult>;
    getHealth(): Promise<{
        status: string;
        azureEnabled: boolean;
        azureConfigured: boolean;
        mode: string;
        timestamp: string;
    }>;
}
