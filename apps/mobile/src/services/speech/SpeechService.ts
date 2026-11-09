import {
  ISpeechService,
  ISpeechProvider,
  SpeechAssessmentOptions,
  SpeechRecognitionResult,
} from '@phonicsquest/shared';
import { OnDeviceSpeechProvider } from './OnDeviceSpeechProvider';
import { CloudSpeechProvider } from './CloudSpeechProvider';

export class SpeechService implements ISpeechService {
  private readonly onDeviceProvider: OnDeviceSpeechProvider;
  private readonly cloudProvider: CloudSpeechProvider;
  private currentMode: 'auto' | 'on-device' | 'azure-cloud' = 'auto';

  constructor() {
    this.onDeviceProvider = new OnDeviceSpeechProvider();
    this.cloudProvider = new CloudSpeechProvider();
  }

  setProvider(mode: 'auto' | 'on-device' | 'azure-cloud'): void {
    this.currentMode = mode;
  }

  getMode(): 'auto' | 'on-device' | 'azure-cloud' {
    return this.currentMode;
  }

  async assessSpeech(options: SpeechAssessmentOptions): Promise<SpeechRecognitionResult> {
    // 1. Explicit override if set (e.g. from Speech Lab)
    if (this.currentMode === 'azure-cloud') {
      return this.cloudProvider.assess(options);
    }
    if (this.currentMode === 'on-device') {
      return this.onDeviceProvider.assess(options);
    }

    // 2. Routing Rule:
    // Practice tasks use on-device provider (zero latency, offline)
    // Level tests use cloud when available, falling back to on-device
    if (!options.isAssessment) {
      return this.onDeviceProvider.assess(options);
    }

    // Scored milestone / level test:
    const isCloudReady = await this.cloudProvider.isAvailable();
    if (isCloudReady) {
      try {
        return await this.cloudProvider.assess(options);
      } catch {
        // Fallback to on-device on failure
        return this.onDeviceProvider.assess(options);
      }
    }

    // Fallback: on-device
    return this.onDeviceProvider.assess(options);
  }
}

export const Speech = new SpeechService();
