import chalk from 'chalk';
import { CICDIntelligence } from '../types/cicd.js';

export function printCICDDashboard(cicd: CICDIntelligence) {
  if (!cicd) return;

  console.log('\n' + chalk.bold.blue('CI/CD INTELLIGENCE'));
  console.log(chalk.dim('──────────────────────────────────────────────────'));

  if (!cicd.hasCI) {
    console.log(chalk.yellow('No Continuous Integration / Continuous Deployment pipelines detected.'));
  } else {
    console.log(`${chalk.bold('Providers detected:')} ${chalk.cyan(cicd.providers.join(', '))}`);
    
    let healthColor = chalk.green;
    if (cicd.ciHealth === 'Poor') healthColor = chalk.red;
    else if (cicd.ciHealth === 'Fair') healthColor = chalk.yellow;
    
    console.log(`${chalk.bold('Workflow Quality:')}   ${healthColor(cicd.workflowQualityScore + '/100')} ${chalk.dim(`(${cicd.ciHealth})`)}\n`);
    
    console.log(chalk.bold('Workflows:'));
    cicd.workflows.forEach(w => {
      console.log(`${chalk.cyan(w.name)} ${chalk.dim(`(${w.provider})`)}`);
      
      const features = [
        w.hasTests ? chalk.green('✓ Tests') : chalk.dim('✗ Tests'),
        w.hasLinting ? chalk.green('✓ Lint') : chalk.dim('✗ Lint'),
        w.hasCache ? chalk.green('✓ Cache') : chalk.dim('✗ Cache'),
        w.hasSecurityScan ? chalk.green('✓ Security') : chalk.dim('✗ Security'),
        w.hasDeployment ? chalk.green('✓ Deploy') : chalk.dim('✗ Deploy')
      ].join(' | ');
      
      console.log(`     ${features}`);
    });
  }

  if (cicd.recommendations.length > 0) {
    console.log('\n' + chalk.bold('Recommendations:'));
    cicd.recommendations.forEach(rec => {
      console.log(`  ${chalk.yellow('•')} ${rec}`);
    });
  }

  console.log(chalk.dim('──────────────────────────────────────────────────'));
}