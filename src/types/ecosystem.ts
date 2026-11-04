export type MonorepoTool = 'Lerna' | 'Nx' | 'Turborepo' | 'Yarn Workspaces' | 'npm Workspaces' | 'pnpm Workspaces' | 'None';

export interface WorkspacePackage {
  name: string;
  relativePath: string;
}

export interface EcosystemIntelligence {
  isMonorepo: boolean;
  tool: MonorepoTool[];
  packages: WorkspacePackage[];
  packageCount: number;
  ecosystemHealth: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'None';
}
