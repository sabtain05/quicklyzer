import fs from 'node:fs';
import path from 'node:path';
import { DockerfileData, DockerComposeData, DockerIntelligence } from '../types/docker.js';

export function analyzeDocker(files: string[]): DockerIntelligence {
  const dockerfiles: DockerfileData[] = [];
  const composeFiles: DockerComposeData[] = [];
  let hasKubernetes = false;

  const readFile = (filePath: string): string => {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch {
      return '';
    }
  };

  for (const file of files) {
    const fileName = path.basename(file).toLowerCase();

    if (fileName === 'dockerfile' || fileName.endsWith('.dockerfile') || fileName.startsWith('dockerfile.')) {
      const content = readFile(file);
      const lines = content.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));

      const baseImages: string[] = [];
      const exposedPorts: number[] = [];
      let hasHealthCheck = false;
      let hasNonRootUser = false;
      let hasVolume = false;
      let stageCount = 0;

      for (const line of lines) {
        if (line.startsWith('FROM ')) {
          stageCount++;
          const parts = line.split(/\s+/);
          if (parts[1]) baseImages.push(parts[1]);
        } else if (line.startsWith('EXPOSE ')) {
          const portMatch = line.match(/EXPOSE\s+(\d+)/);
          if (portMatch) exposedPorts.push(parseInt(portMatch[1], 10));
        } else if (line.startsWith('HEALTHCHECK')) {
          hasHealthCheck = true;
        } else if (line.startsWith('USER ')) {
          const userMatch = line.match(/USER\s+([^\s]+)/);
          if (userMatch && userMatch[1] !== 'root' && userMatch[1] !== '0') {
            hasNonRootUser = true;
          }
        } else if (line.startsWith('VOLUME')) {
          hasVolume = true;
        }
      }

      dockerfiles.push({
        file,
        baseImages,
        exposedPorts,
        hasMultiStage: stageCount > 1,
        hasHealthCheck,
        hasNonRootUser,
        hasVolume,
        stageCount
      });
    }
    else if (fileName === 'docker-compose.yml' || fileName === 'docker-compose.yaml' || fileName === 'compose.yml' || fileName === 'compose.yaml') {
      const content = readFile(file);
      const servicesMatch = content.match(/services:/);
      const volumesMatch = content.match(/volumes:/);
      const networksMatch = content.match(/networks:/);
      const services: string[] = [];
      if (servicesMatch) {
        const lines = content.split('\n');
        let inServices = false;
        for (const line of lines) {
          if (line.trim() === 'services:') {
            inServices = true;
            continue;
          }
          if (inServices) {
            if (line.length > 0 && !line.startsWith(' ') && !line.startsWith('\t') && !line.startsWith('#')) {
              inServices = false;
            } else {
              const serviceMatch = line.match(/^ {2}([a-zA-Z0-9_-]+):/);
              if (serviceMatch) {
                services.push(serviceMatch[1]);
              }
            }
          }
        }
      }

      composeFiles.push({
        file,
        services,
        hasVolumes: !!volumesMatch,
        hasNetworks: !!networksMatch
      });
    }

    else if (fileName.endsWith('.yaml') || fileName.endsWith('.yml')) {
      const content = readFile(file);
      if (content.includes('apiVersion:') && /(kind:\s*(Deployment|Pod|Service|StatefulSet|DaemonSet|ConfigMap|Secret|Ingress))/.test(content)) {
        hasKubernetes = true;
      }
    }
  }

  const hasDocker = dockerfiles.length > 0;
  const hasDockerCompose = composeFiles.length > 0;
  let totalScore = 0;
  let maxScore = 0;
  const recommendations: string[] = [];

  if (hasDocker) {
    maxScore += dockerfiles.length * 4;
    
    dockerfiles.forEach(df => {
      const shortName = path.basename(df.file);
      
      if (df.hasMultiStage) totalScore++;
      else recommendations.push(`Use multi-stage builds in ${shortName} to reduce final image size.`);

      if (df.hasHealthCheck) totalScore++;
      else recommendations.push(`Add a HEALTHCHECK instruction to ${shortName} for container orchestration stability.`);

      if (df.hasNonRootUser) totalScore++;
      else recommendations.push(`Define a non-root USER in ${shortName} to improve container security.`);

      if (df.baseImages.length > 0) totalScore++;
    });
  }

  const dockerScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  
  let containerHealth: DockerIntelligence['containerHealth'] = 'None';
  if (hasDocker || hasDockerCompose || hasKubernetes) {
    if (dockerScore >= 80) containerHealth = 'Excellent';
    else if (dockerScore >= 60) containerHealth = 'Good';
    else if (dockerScore >= 40) containerHealth = 'Fair';
    else containerHealth = 'Poor';
  }

  return {
    hasDocker,
    hasDockerCompose,
    hasKubernetes,
    dockerfiles,
    composeFiles,
    dockerScore,
    containerHealth,
    recommendations
  };
}