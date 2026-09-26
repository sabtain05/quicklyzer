export interface CIWorkflow {
  name: string;
  file: string;
  provider: string;
  hasCache: boolean;
  hasDeployment: boolean;
  hasTests: boolean;
  hasLinting: boolean;
  hasSecurityScan: boolean;
}

export interface CICDIntelligence {
  hasCI: boolean;
  providers: string[];
  workflows: CIWorkflow[];
  workflowQualityScore: number;
  ciHealth: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'None';
  recommendations: string[];
}