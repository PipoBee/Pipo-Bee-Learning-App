import { SpeechRecognitionResult } from '@phonicsquest/shared';
export declare class SpeechService {
    private readonly logger;
    private readonly isAzureEnabled;
    private readonly azureKey;
    private readonly azureRegion;
    constructor();
    assessSpeech(expectedText: string, targetPhoneme?: string, fileBuffer?: Buffer): Promise<SpeechRecognitionResult>;
    getHealth(): {
        status: string;
        azureEnabled: boolean;
        azureConfigured: boolean;
        mode: string;
        timestamp: string;
    };
}
