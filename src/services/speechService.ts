// Web Speech API wrapper for Speech Recognition & Synthesis

export interface SpeechRecognitionResultPayload {
  transcript: string;
  isFinal: boolean;
}

export type OnTranscriptCallback = (payload: SpeechRecognitionResultPayload) => void;

class SpeechService {
  private recognition: any = null;
  private isListening = false;
  private synthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private preferredVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.initRecognition();
    if (typeof window !== 'undefined') {
      window.speechSynthesis?.addEventListener('voiceschanged', () => {
        this.selectDefaultVoice();
      });
    }
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      } catch (err) {
        console.warn('SpeechRecognition initialization error:', err);
      }
    }
  }

  public isSpeechRecognitionSupported(): boolean {
    return !!(
      typeof window !== 'undefined' && 
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
    );
  }

  public startListening(onTranscript: OnTranscriptCallback, onError?: (err: any) => void): boolean {
    if (!this.recognition) {
      this.initRecognition();
    }
    if (!this.recognition) {
      if (onError) onError(new Error('Speech recognition not supported in this browser. Please type your response.'));
      return false;
    }

    try {
      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const fullText = finalTranscript || interimTranscript;
        if (fullText) {
          onTranscript({
            transcript: fullText,
            isFinal: !!finalTranscript
          });
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        if (onError && event.error !== 'no-speech') {
          onError(event);
        }
      };

      this.recognition.onend = () => {
        // Auto-restart if still flagged as listening
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch (e) {
            // ignore
          }
        }
      };

      this.isListening = true;
      this.recognition.start();
      return true;
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      if (onError) onError(err);
      return false;
    }
  }

  public stopListening(): void {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }

  private selectDefaultVoice() {
    const voices = this.getVoices();
    // Prefer natural sounding English voices
    const naturalVoice = voices.find(v => 
      v.lang.startsWith('en') && 
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Samantha'))
    );
    this.preferredVoice = naturalVoice || voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
  }

  public speak(
    text: string, 
    options?: { rate?: number; pitch?: number; voiceURI?: string; onEnd?: () => void }
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synthesis) {
        resolve();
        return;
      }

      this.synthesis.cancel(); // cancel any active speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options?.rate || 1.0;
      utterance.pitch = options?.pitch || 1.0;

      if (options?.voiceURI) {
        const found = this.getVoices().find(v => v.voiceURI === options.voiceURI);
        if (found) utterance.voice = found;
      } else if (this.preferredVoice) {
        utterance.voice = this.preferredVoice;
      }

      utterance.onend = () => {
        if (options?.onEnd) options.onEnd();
        resolve();
      };

      utterance.onerror = (e) => {
        console.warn('TTS utterance error:', e);
        if (options?.onEnd) options.onEnd();
        resolve();
      };

      this.synthesis.speak(utterance);
    });
  }

  public stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }
}

export const speechService = new SpeechService();
