export enum SocialPlatform {
  Instagram = 'Instagram',
  TikTok = 'TikTok',
  Twitter = 'Twitter',
  Facebook = 'Facebook',
  LinkedIn = 'LinkedIn',
  WhatsApp = 'WhatsApp'
}

export interface AnalysisData {
  viralityScore: number; // 0 to 100
  reasoning: string;
  suggestedPlatforms: SocialPlatform[];
  hashtags: string[];
  improvedCaption?: string;
  bestTimeToPost?: string;
}

export interface SavedState {
  caption: string;
  hashtags: string;
  imageData: string | null; // Base64
  lastSaved: number;
}

export type ThemeColor = 'indigo' | 'rose' | 'emerald' | 'violet' | 'amber';
export type PostVibe = 'Authentic' | 'Spicy' | 'Professional' | 'Savage' | 'Inspirational' | 'Funny';

export interface UserProfile {
  username: string;
  displayName: string;
  avatarUrl: string;
  bioVibe: string; // Describes the 'vibe' of the profile for AI analysis
}

export interface AppSettings {
  themeColor: ThemeColor;
  linkedAccounts: {
    [key in SocialPlatform]?: UserProfile | null; // Null means not linked
  };
}

export type AppView = 'home' | 'settings';