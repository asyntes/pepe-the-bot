import { Mood } from './types';

export class MoodDetector {
  private static readonly VALID_MOODS: Mood[] = [
    'neutral', 'angry', 'trusted', 'excited', 'confused'
  ];

  static extractMoodFromResponse(text: string): Mood {
    const moodMarkers = text.match(/\[MOOD:(\w+)\]/);
    if (moodMarkers && moodMarkers[1]) {
      const detectedMood = moodMarkers[1].toLowerCase() as Mood;
      if (this.VALID_MOODS.includes(detectedMood)) {
        return detectedMood;
      }
    }
    return 'neutral';
  }

  static cleanResponse(text: string): string {
    return text.replace(/\[MOOD:\w+\]/g, '').trim();
  }
}