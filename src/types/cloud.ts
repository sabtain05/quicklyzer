export interface CloudProviderData {
  name: string;
  configFile: string;
}

export interface CloudIntelligence {
  hasCloudDeployment: boolean;
  providers: CloudProviderData[];
  hasIaC: boolean; 
  hasServerless: boolean; 
  cloudScore: number; 
  deploymentReadiness: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'None';
  recommendations: string[];
}
