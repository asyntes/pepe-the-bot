export const generateId = (): string => Date.now().toString();

export const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);