import path from 'node:path';
import { CloudProviderData, CloudIntelligence } from '../types/cloud.js';

export function analyzeCloud(files: string[]): CloudIntelligence {
  const providers: Map<string, CloudProviderData> = new Map();
  let hasIaC = false;
  let hasServerless = false;

  for (const file of files) {
    const fileName = path.basename(file).toLowerCase();

    if (fileName === 'vercel.json') {
      providers.set('Vercel', { name: 'Vercel', configFile: file });
    } else if (fileName === 'netlify.toml') {
      providers.set('Netlify', { name: 'Netlify', configFile: file });
    } else if (fileName === 'firebase.json' || fileName === '.firebaserc') {
      providers.set('Firebase', { name: 'Firebase', configFile: file });
    } else if (fileName === 'wrangler.toml') {
      providers.set('Cloudflare Workers', { name: 'Cloudflare', configFile: file });
    } else if (fileName === 'procfile' || fileName === 'heroku.yml') {
      providers.set('Heroku', { name: 'Heroku', configFile: file });
    } else if (fileName === 'fly.toml') {
      providers.set('Fly.io', { name: 'Fly.io', configFile: file });
    }

    else if (fileName === 'app.yaml' || fileName === 'cloudbuild.yaml') {
      providers.set('Google Cloud', { name: 'Google Cloud', configFile: file });
    } else if (fileName === 'amplify.yml' || file.includes('.ebextensions')) {
      providers.set('AWS', { name: 'AWS', configFile: file });
    } else if (fileName.includes('azure-pipelines') || fileName === 'host.json' || fileName === 'local.settings.json') {
      providers.set('Azure', { name: 'Azure', configFile: file });
    }

    else if (fileName.endsWith('.tf') || fileName === 'terraform.tfstate') {
      hasIaC = true;
      providers.set('Terraform', { name: 'Terraform', configFile: file });
    } else if (fileName === 'pulumi.yaml' || fileName === 'pulumi.yml') {
      hasIaC = true;
      providers.set('Pulumi', { name: 'Pulumi', configFile: file });
    }


    else if (fileName === 'serverless.yml' || fileName === 'serverless.ts' || fileName === 'serverless.json') {
      hasServerless = true;
      providers.set('Serverless Framework', { name: 'Serverless', configFile: file });
    } else if (fileName === 'template.yaml' && file.includes('aws')) {
      hasServerless = true;
      providers.set('AWS SAM', { name: 'AWS SAM', configFile: file });
    }
  }

  const providerList = Array.from(providers.values());
  const hasCloudDeployment = providerList.length > 0;
  
  let totalScore = 0;
  let maxScore = 0;
  const recommendations: string[] = [];

  if (hasCloudDeployment) {
    maxScore += 10;
    totalScore += 10;


    maxScore += 5;
    if (hasIaC) {
      totalScore += 5;
    } else if (providerList.some(p => p.name === 'AWS' || p.name === 'Google Cloud' || p.name === 'Azure')) {
      recommendations.push('Consider using Infrastructure as Code (e.g., Terraform, Pulumi) to manage your cloud resources declaratively.');
    }

    maxScore += 5;
    if (hasServerless) {
      totalScore += 5;
    }

    if (providerList.length > 2) {
      recommendations.push('Multiple cloud providers detected. Ensure your deployment strategy is intentionally multi-cloud to avoid unnecessary fragmentation and configuration drift.');
    }
  } else {
    recommendations.push('No cloud deployment configuration detected. If you are deploying this project, consider adding configuration files (e.g., vercel.json, netlify.toml, Dockerfile) to version control.');
  }

  const cloudScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  
  let deploymentReadiness: CloudIntelligence['deploymentReadiness'] = 'None';
  if (hasCloudDeployment) {
    if (cloudScore >= 80) deploymentReadiness = 'Excellent';
    else if (cloudScore >= 60) deploymentReadiness = 'Good';
    else if (cloudScore >= 40) deploymentReadiness = 'Fair';
    else deploymentReadiness = 'Poor';
  }

  return {
    hasCloudDeployment,
    providers: providerList,
    hasIaC,
    hasServerless,
    cloudScore,
    deploymentReadiness,
    recommendations
  };
}