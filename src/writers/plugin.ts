import chalk from 'chalk';
import { PluginIntelligence } from '../types/plugin.js';

export function printPluginDashboard(plugins: PluginIntelligence) {
  if (!plugins || !plugins.hasPlugins) return;

  console.log('\n' + chalk.bold.blue('PLUGIN SYSTEM'));
  console.log(chalk.dim('──────────────────────────────────────────────────'));

  console.log(`${chalk.bold('Plugins Loaded:')} ${chalk.cyan(plugins.loadedCount)}\n`);

  plugins.results.forEach(result => {
    console.log(`${chalk.bold.cyan(result.name)} ${chalk.dim(`v${result.version}`)}`);
    console.log(`Execution Time: ${result.executionTimeMs}ms`);

    const metricKeys = Object.keys(result.metrics);
    if (metricKeys.length > 0) {
      console.log(chalk.bold('Metrics:'));
      metricKeys.forEach(key => {
        console.log(`       ${key}: ${chalk.yellow(result.metrics[key])}`);
      });
    }

    if (result.warnings.length > 0) {
      console.log(chalk.bold.yellow('Warnings:'));
      result.warnings.forEach(warn => console.log(`       ${chalk.yellow('•')} ${warn}`));
    }

    if (result.errors.length > 0) {
      console.log(chalk.bold.red('Errors:'));
      result.errors.forEach(err => console.log(`       ${chalk.red('•')} ${err}`));
    }
    
    console.log();
  });

  console.log(chalk.dim('──────────────────────────────────────────────────'));
}