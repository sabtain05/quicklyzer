export type RefactorCategory = 'Security' | 'Performance' | 'Best Practice' | 'Design Pattern' | 'Technical Debt';
export type RefactorImpact = 'High' | 'Medium' | 'Low';

export interface RefactorSuggestion {
  file: string;
  line?: number;
  category: RefactorCategory;
  impact: RefactorImpact;
  issue: string;
  suggestion: string;
  codeSnippet?: string;
}

export interface RefactorIntelligence {
  hasSuggestions: boolean;
  suggestions: RefactorSuggestion[];
  estimatedTimeSavings: string; 
  refactorPriorityScore: number; 
}