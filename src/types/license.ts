export interface DependencyLicense {
  packageName: string;
  version: string;
  license: string;
  isSpdxStandard: boolean;
  isGPL: boolean;
  isHighRisk: boolean;
}

export interface LicenseIntelligence {
  totalScanned: number;
  missingLicenses: number;
  gplDependencies: number;
  highRiskDependencies: number;
  dependencies: DependencyLicense[];
  licenseRiskScore: number; 
  complianceSummary: string;
  recommendations: string[];
}