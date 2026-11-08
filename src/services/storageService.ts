import { OverallEvaluation, UserSettings } from '../types';

const SETTINGS_KEY = 'interviewiq_settings_v1';
const HISTORY_KEY = 'interviewiq_history_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  userName: 'Candidate',
  aiProvider: 'local',
  apiKey: '',
  modelName: 'gemini-1.5-flash',
  speechVoiceURI: '',
  speechRate: 1.0,
  speechPitch: 1.0,
  autoSpeakQuestions: true,
  soundEffects: true,
  theme: 'dark'
};

export class StorageService {
  public static getSettings(): UserSettings {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to parse settings:', e);
    }
    return DEFAULT_SETTINGS;
  }

  public static saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  }

  public static getHistory(): OverallEvaluation[] {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse history:', e);
    }
    return [];
  }

  public static saveEvaluation(evaluation: OverallEvaluation): void {
    try {
      const history = this.getHistory();
      // Prepend newest
      history.unshift(evaluation);
      // Keep up to 20 past sessions
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
    } catch (e) {
      console.warn('Failed to save evaluation to history:', e);
    }
  }

  public static clearHistory(): void {
    localStorage.removeItem(HISTORY_KEY);
  }
}
