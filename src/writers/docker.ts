// src/writers/docker.ts
import chalk from 'chalk';
import { DockerIntelligence } from '../types/docker.js';

export function printDockerDashboard(docker: DockerIntelligence) {
  if (!docker || (!docker.hasDocker && !docker.hasDockerCompose && !docker.hasKubernetes)) return;

  console.log('\n' + chalk.bold.blue('DOCKER & CONTAINER INTELLIGENCE'));
  console.log(chalk.dim('──────────────────────────────────────────────────'));

  let healthColor = chalk.green;
  if (docker.containerHealth === 'Poor') healthColor = chalk.red;
  else if (docker.containerHealth === 'Fair') healthColor = chalk.yellow;

  console.log(`${chalk.bold('Container Health:')} ${healthColor(docker.dockerScore + '/100')} ${chalk.dim(`(${docker.containerHealth})`)}`);
  
  const ecosystem: string[] = [];
  if (docker.hasDocker) ecosystem.push('Docker');
  if (docker.hasDockerCompose) ecosystem.push('Docker Compose');
  if (docker.hasKubernetes) ecosystem.push('Kubernetes');
  console.log(`${chalk.bold('Ecosystem:')}        ${chalk.cyan(ecosystem.join(', '))}\n`);

  if (docker.dockerfiles.length > 0) {
    console.log(chalk.bold('Dockerfiles:'));
    docker.dockerfiles.forEach(df => {
      const shortName = df.file.split(/[/\\]/).pop();
      console.log(`${chalk.cyan(shortName)}`);
      console.log(`Base Images:  ${df.baseImages.join(', ') || 'None'}`);
      
      const features = [
        df.hasMultiStage ? chalk.green('✓ Multi-stage') : chalk.dim('✗ Multi-stage'),
        df.hasNonRootUser ? chalk.green('✓ Non-root') : chalk.dim('✗ Non-root'),
        df.hasHealthCheck ? chalk.green('✓ Healthcheck') : chalk.dim('✗ Healthcheck'),
        df.exposedPorts.length > 0 ? chalk.green(`✓ Ports (${df.exposedPorts.join(', ')})`) : chalk.dim('✗ Ports')
      ].join(' | ');
      
      console.log(`     ${features}`);
    });
    console.log();
  }

  if (docker.composeFiles.length > 0) {
    console.log(chalk.bold('Docker Compose Services:'));
    docker.composeFiles.forEach(cf => {
      const shortName = cf.file.split(/[/\\]/).pop();
      console.log(`${chalk.cyan(shortName)}`);
      if (cf.services.length > 0) {
        console.log(`     Services: ${cf.services.join(', ')}`);
      }
      console.log(`     Features: ${cf.hasVolumes ? chalk.green('✓ Volumes') : chalk.dim('✗ Volumes')} | ${cf.hasNetworks ? chalk.green('✓ Networks') : chalk.dim('✗ Networks')}`);
    });
    console.log();
  }

  if (docker.recommendations.length > 0) {
    console.log(chalk.bold('Recommendations:'));
    docker.recommendations.forEach(rec => {
      console.log(`  ${chalk.yellow('•')} ${rec}`);
    });
  }

  console.log(chalk.dim('──────────────────────────────────────────────────'));
}