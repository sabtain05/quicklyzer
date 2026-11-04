export interface LanguageStat {
  name: string;
  fileCount: number;
  percentage: number;
}

export interface LanguageIntelligence {
  isMultiLanguage: boolean;
  primaryLanguage: string;
  languages: LanguageStat[];
  detectedFrameWorks: string[];
}