import fs from 'node:fs';
import path from 'node:path';
import { CIWorkflow, CICDIntelligence } from '../types/cicd.js';

export function analyzeCICD(projectPath: string): CICDIntelligence {
  const workflows: CIWorkflow[] = [];
  const providers = new Set<string>();

  const readFile = (filePath: string): string => {
    try {
      return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8').toLowerCase() : '';
    } catch {
      return '';
    }
  };

  const analyzeWorkflowContent = (content: string, name: string, file: string, provider: string): CIWorkflow => {
    return {
      name,
      file,
      provider,
      hasCache: /(cache|actions\/cache|setup-node|restore_cache)/.test(content),
      hasTests: /(npm test|npm run test|jest|vitest|mocha|cypress|playwright|run_tests)/.test(content),
      hasLinting: /(eslint|prettier|npm run lint|tsc --noemit)/.test(content),
      hasSecurityScan: /(snyk|codeql|sonar|trivy|npm audit|security)/.test(content),
      hasDeployment: /(deploy|vercel|netlify|aws|docker push|publish|release|serverless)/.test(content),
    };
  };

  const githubWorkflowsPath = path.join(projectPath, '.github', 'workflows');
  if (fs.existsSync(githubWorkflowsPath) && fs.statSync(githubWorkflowsPath).isDirectory()) {
    providers.add('GitHub Actions');
    const files = fs.readdirSync(githubWorkflowsPath).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
    
    for (const file of files) {
      const content = readFile(path.join(githubWorkflowsPath, file));
      workflows.push(analyzeWorkflowContent(content, file.replace(/\.ya?ml$/, ''), file, 'GitHub Actions'));
    }
  }

  const gitlabPath = path.join(projectPath, '.gitlab-ci.yml');
  if (fs.existsSync(gitlabPath)) {
    providers.add('GitLab CI');
    workflows.push(analyzeWorkflowContent(readFile(gitlabPath), 'GitLab Pipeline', '.gitlab-ci.yml', 'GitLab CI'));
  }

  const circlePath = path.join(projectPath, '.circleci', 'config.yml');
  if (fs.existsSync(circlePath)) {
    providers.add('CircleCI');
    workflows.push(analyzeWorkflowContent(readFile(circlePath), 'CircleCI Pipeline', 'config.yml', 'CircleCI'));
  }

  const azurePath = path.join(projectPath, 'azure-pipelines.yml');
  if (fs.existsSync(azurePath)) {
    providers.add('Azure Pipelines');
    workflows.push(analyzeWorkflowContent(readFile(azurePath), 'Azure Pipeline', 'azure-pipelines.yml', 'Azure Pipelines'));
  }

  const jenkinsPath = path.join(projectPath, 'Jenkinsfile');
  if (fs.existsSync(jenkinsPath)) {
    providers.add('Jenkins');
    workflows.push(analyzeWorkflowContent(readFile(jenkinsPath), 'Jenkins Pipeline', 'Jenkinsfile', 'Jenkins'));
  }

  let totalScore = 0;
  let maxPossibleScore = workflows.length * 5; 
  const recommendations: string[] = [];

  if (workflows.length === 0) {
    recommendations.push('Consider adding a CI/CD pipeline (e.g., GitHub Actions) to automate testing and linting.');
  } else {
    let hasAnyCache = false;
    let hasAnyTests = false;
    let hasAnyLinting = false;
    let hasAnySecurity = false;

    workflows.forEach(w => {
      if (w.hasCache) { totalScore++; hasAnyCache = true; }
      if (w.hasTests) { totalScore++; hasAnyTests = true; }
      if (w.hasLinting) { totalScore++; hasAnyLinting = true; }
      if (w.hasSecurityScan) { totalScore++; hasAnySecurity = true; }
      if (w.hasDeployment) { totalScore++; }
    });

    if (!hasAnyCache) recommendations.push('Implement dependency caching in your CI workflows to speed up execution times.');
    if (!hasAnyTests) recommendations.push('Add automated testing to your CI pipelines to catch regressions early.');
    if (!hasAnyLinting) recommendations.push('Integrate code linting (e.g., ESLint) into your CI to enforce code quality.');
    if (!hasAnySecurity) recommendations.push('Consider adding automated security scanning (e.g., Snyk or npm audit) to your CI pipelines.');
  }

  const workflowQualityScore = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
  
  let ciHealth: CICDIntelligence['ciHealth'] = 'None';
  if (workflows.length > 0) {
    if (workflowQualityScore >= 80) ciHealth = 'Excellent';
    else if (workflowQualityScore >= 60) ciHealth = 'Good';
    else if (workflowQualityScore >= 40) ciHealth = 'Fair';
    else ciHealth = 'Poor';
  }

  return {
    hasCI: workflows.length > 0,
    providers: Array.from(providers),
    workflows,
    workflowQualityScore,
    ciHealth,
    recommendations
  };
}