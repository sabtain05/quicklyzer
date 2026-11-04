import fs from 'node:fs';
import path from 'node:path';
import { EcosystemIntelligence, MonorepoTool, WorkspacePackage } from '../types/ecosystem.js';

export function analyzeEcosystem(files: string[], projectRoot: string): EcosystemIntelligence {
  const tools: Set<MonorepoTool> = new Set();
  const packages: WorkspacePackage[] = [];
  let rootPackageJson: any = null;

  try {
    const rootPkgPath = path.join(projectRoot, 'package.json');
    if (fs.existsSync(rootPkgPath)) {
      rootPackageJson = JSON.parse(fs.readFileSync(rootPkgPath, 'utf-8'));
    }
  } catch (e) {
  }

  for (const file of files) {
    const fileName = path.basename(file).toLowerCase();
    
    if (fileName === 'lerna.json') tools.add('Lerna');
    else if (fileName === 'nx.json') tools.add('Nx');
    else if (fileName === 'turbo.json') tools.add('Turborepo');
    else if (fileName === 'pnpm-workspace.yaml') tools.add('pnpm Workspaces');
  }

  if (rootPackageJson?.workspaces) {
    if (fs.existsSync(path.join(projectRoot, 'yarn.lock'))) {
      tools.add('Yarn Workspaces');
    } else {
      tools.add('npm Workspaces');
    }
  }

  const isMonorepo = tools.size > 0;

  if (isMonorepo) {
    for (const file of files) {
      if (path.basename(file) === 'package.json' && file !== path.join(projectRoot, 'package.json')) {
        if (!file.includes('node_modules')) {
          try {
            const pkgData = JSON.parse(fs.readFileSync(file, 'utf-8'));
            if (pkgData.name) {
              packages.push({
                name: pkgData.name,
                relativePath: path.relative(projectRoot, path.dirname(file))
              });
            }
          } catch {
          }
        }
      }
    }
  }

  let ecosystemHealth: EcosystemIntelligence['ecosystemHealth'] = 'None';
  if (isMonorepo) {
    if (packages.length > 0 && tools.size > 0) ecosystemHealth = 'Excellent';
    else if (tools.size > 0) ecosystemHealth = 'Good';
    else ecosystemHealth = 'Fair';
  }

  return {
    isMonorepo,
    tool: tools.size > 0 ? Array.from(tools) : ['None'],
    packages,
    packageCount: packages.length,
    ecosystemHealth
  };
}
