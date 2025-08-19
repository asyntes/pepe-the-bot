export const APP_CONFIG = {
  NAME: 'Tomie',
  VERSION: '1.0.0',
  AUTHOR: 'Asyntes (Antonio Santese)',
} as const;

export const TERMINAL_CONFIG = {
  TYPEWRITER_SPEED: 30,
  PROCESSING_TIMEOUT: 120000,
} as const;

export const API_CONFIG = {
  BASE_URL: 'https://api.x.ai/v1',
  MODEL: 'grok-3-mini',
  TEMPERATURE: 0,
  TOP_P: 0.95,
  MAX_TOKENS: 2048,
} as const;