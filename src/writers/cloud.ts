import chalk from 'chalk';
import { CloudIntelligence } from '../types/cloud.js';

export function printCloudDashboard(cloud: CloudIntelligence) {
  if (!cloud || !cloud.hasCloudDeployment) return;

  console.log('\n' + chalk.bold.blue(' CLOUD & DEPLOYMENT INTELLIGENCE'));
  console.log(chalk.dim('──────────────────────────────────────────────────'));

  let healthColor = chalk.green;
  if (cloud.deploymentReadiness === 'Poor') healthColor = chalk.red;
  else if (cloud.deploymentReadiness === 'Fair') healthColor = chalk.yellow;

  console.log(`${chalk.bold('Deployment Readiness:')} ${healthColor(cloud.cloudScore + '/100')} ${chalk.dim(`(${cloud.deploymentReadiness})`)}\n`);

  console.log(chalk.bold('Providers Detected:'));
  cloud.providers.forEach(provider => {
    const shortName = provider.configFile.split(/[/\\]/).pop();
    console.log(`  ${chalk.cyan(provider.name)} ${chalk.dim(`(via ${shortName})`)}`);
  });
  console.log();

  console.log(chalk.bold('Infrastructure Stack:'));
  console.log(`  IaC (Terraform/Pulumi): ${cloud.hasIaC ? chalk.green('✓ Detected') : chalk.dim('✗ Not Detected')}`);
  console.log(`  Serverless Framework:   ${cloud.hasServerless ? chalk.green('✓ Detected') : chalk.dim('✗ Not Detected')}`);
  console.log();

  if (cloud.recommendations.length > 0) {
    console.log(chalk.bold('Recommendations:'));
    cloud.recommendations.forEach(rec => {
      console.log(`  ${chalk.yellow('•')} ${rec}`);
    });
  }

  console.log(chalk.dim('──────────────────────────────────────────────────'));
}