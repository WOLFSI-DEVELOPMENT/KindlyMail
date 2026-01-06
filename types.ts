
export interface EmailState {
  recipient: string;
  topic: string;
  tone: ToneOption;
  subject: string;
  body: string;
  isGenerating: boolean;
  generated: boolean;
  messages: Message[];
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export enum ToneOption {
  Friendly = 'Friendly',
  Professional = 'Professional',
  Concise = 'Concise',
  Enthusiastic = 'Enthusiastic',
  Empathetic = 'Empathetic'
}

export interface GeneratedEmail {
  subject: string;
  body: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string; // Base64 for images, text for code/txt
  timestamp: number;
}

export interface ToneSettings {
  warmth: 'Default' | 'More' | 'Less';
  enthusiasm: 'Default' | 'More' | 'Less';
  formatting: 'Default' | 'More' | 'Less';
  emojis: 'Default' | 'More' | 'Less';
}

export interface VoiceFingerprint {
  keywords: string[];
  sentenceLength: string;
  structure: string;
  vocabularyLevel: string;
  signatureStyle: string;
  summary: string;
}

export type OutputFormat = 'html' | 'text';

export interface PersonalContext {
  systemInstructions: string;
  files: UploadedFile[];
  toneSettings: ToneSettings;
  voiceFingerprint?: VoiceFingerprint;
  model?: string;
}

export interface Creation {
  id: string;
  subject: string;
  body: string;
  snippet: string;
  lastEdited: number;
  status: 'Draft' | 'Sent';
  type: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  subject: string;
  body: string;
}