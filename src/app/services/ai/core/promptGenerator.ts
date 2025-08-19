import { Mood } from '../types';
import { 
  BASE_SYSTEM_PROMPT,
  CREATOR_INFO,
  PRIVACY_INFO,
  MOOD_PERSONALITIES,
  MOOD_DETECTION_GUIDELINES
} from '../prompts';

export class PromptGenerator {
  static generateSystemPrompt(currentMood: Mood, upcomingMood?: Mood): string {
    const basePrompt = [
      BASE_SYSTEM_PROMPT,
      '',
      CREATOR_INFO,
      '',
      PRIVACY_INFO,
      '',
      Object.values(MOOD_PERSONALITIES).join('\n'),
      '',
      MOOD_DETECTION_GUIDELINES,
      '',
      `Current AI mood state: ${currentMood} (respond using THIS mood's personality)`
    ].join('\n');

    if (upcomingMood) {
      return `${basePrompt}

CRITICAL: You are about to transition to ${upcomingMood.toUpperCase()} mood. Completely abandon ${currentMood} personality and respond with full ${upcomingMood.toUpperCase()} characteristics as described above.`;
    }

    return `${basePrompt}

CRITICAL: Do NOT change your tone or personality. Maintain your current ${currentMood.toUpperCase()} mood strictly.`;
  }
}