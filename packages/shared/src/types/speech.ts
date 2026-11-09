export interface PhonemeScore {
  phoneme: string;
  accuracyScore: number;
  errorType?: 'None' | 'Omission' | 'Insertion' | 'Mispronunciation';
}

export interface SpeechRecognitionResult {
  provider: 'on-device' | 'azure-cloud';
  expected: string;
  recognized: string;
  confidence: number;
  passed: boolean;
  durationMs: number;
  phonemeScores?: PhonemeScore[];
  fluencyScore?: number;
  pronunciationScore?: number;
  completenessScore?: number;
  rawFeedback?: string;
  error?: string;
}

export interface SpeechAssessmentOptions {
  expectedText: string;
  targetPhoneme?: string;
  audioUri: string;
  isAssessment: boolean;
  confidenceThreshold?: number;
  timeoutMs?: number;
}

export interface ISpeechProvider {
  readonly id: 'on-device' | 'azure-cloud';
  isAvailable(): Promise<boolean>;
  assess(options: SpeechAssessmentOptions): Promise<SpeechRecognitionResult>;
}

export interface ISpeechService {
  setProvider(providerId: 'on-device' | 'azure-cloud' | 'auto'): void;
  assessSpeech(options: SpeechAssessmentOptions): Promise<SpeechRecognitionResult>;
}
