export type Language = 'en' | 'it';

export interface Translations {
  terminal: {
    initializing: string;
    mood: string;
    processing: string;
    typing: string;
    placeholder: string;
    send: string;
  };
  welcome: {
    initialized: string;
    connection: string;
    help: string;
    privacy: string;
    greeting: string;
  };
  moods: {
    neutral: string;
    angry: string;
    romantic: string;
    excited: string;
    confused: string;
  };
  commands: {
    cleared: string;
    help: string;
    repo: string;
    unknown: string;
  };
  privacy: {
    title: string;
    dataProcessing: string;
    bulletPoints: string[];
    securityTitle: string;
    securityIntro: string;
    securityPoints: string[];
    thirdPartyTitle: string;
    thirdPartyPoints: string[];
    retention: string;
    questions: string;
    links: string[];
    lastUpdated: string;
  };
}