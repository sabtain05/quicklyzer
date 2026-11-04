import chalk from 'chalk';
import { EcosystemIntelligence } from '../types/ecosystem.js';

export function printEcosystemDashboard(ecosystem: EcosystemIntelligence) {
  if (!ecosystem || !ecosystem.isMonorepo) return;

  console.log('\n' + chalk.bold.blue('ECOSYSTEM & MONOREPO INTELLIGENCE'));
  console.log(chalk.dim('──────────────────────────────────────────────────'));

  console.log(`${chalk.bold('Monorepo Tools:')}  ${chalk.cyan(ecosystem.tool.join(', '))}`);
  
  let healthColor = chalk.green;
  if (ecosystem.ecosystemHealth === 'Poor') healthColor = chalk.red;
  else if (ecosystem.ecosystemHealth === 'Fair') healthColor = chalk.yellow;
  
  console.log(`${chalk.bold('Workspace Health:')} ${healthColor(ecosystem.ecosystemHealth)}`);
  console.log(`${chalk.bold('Total Packages:')}   ${ecosystem.packageCount}\n`);

  if (ecosystem.packages.length > 0) {
    console.log(chalk.bold('Discovered Packages:'));
    ecosystem.packages.slice(0, 10).forEach(pkg => {
      console.log(`  ${chalk.green('•')} ${chalk.bold(pkg.name)} ${chalk.dim(`(${pkg.relativePath})`)}`);
    });

    if (ecosystem.packages.length > 10) {
      console.log(chalk.dim(`  ... and ${ecosystem.packages.length - 10} more packages.`));
    }
  }

  console.log(chalk.dim('──────────────────────────────────────────────────'));
}
