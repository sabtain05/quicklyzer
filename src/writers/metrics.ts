import chalk from 'chalk';
import { CodeMetrics } from '../types/metrics.js';

export function printMetricsDashboard(metrics: CodeMetrics) {
  if (!metrics || metrics.totalFilesAnalyzed === 0) return;

  console.log('\n' + chalk.bold.blue('CODE METRICS'));
  console.log(chalk.dim('──────────────────────────────────────────────────'));

  console.log(`${chalk.bold('Files analyzed:')}      ${chalk.cyan(metrics.totalFilesAnalyzed)}`);
  console.log(`${chalk.bold('Functions analyzed:')}  ${chalk.cyan(metrics.totalFunctionsAnalyzed)}`);
  console.log(`${chalk.bold('Classes analyzed:')}    ${chalk.cyan(metrics.totalClassesAnalyzed)}\n`);

  console.log(chalk.bold('Health Averages:'));
  console.log(`  Cyclomatic Complexity: ${chalk.yellow(metrics.averageComplexity)} ${chalk.dim(`(Peak: ${metrics.maximumComplexity})`)}`);
  console.log(`  Cognitive Complexity:  ${chalk.yellow(metrics.averageCognitiveComplexity)}`);
  
  let miColor = chalk.green;
  if (metrics.averageMaintainabilityIndex < 50) miColor = chalk.red;
  else if (metrics.averageMaintainabilityIndex < 75) miColor = chalk.yellow;
  
  console.log(`  Maintainability Index: ${miColor(metrics.averageMaintainabilityIndex + '/100')}\n`);

  console.log(chalk.bold('Structural Alerts:'));
  console.log(`  Long Methods:          ${metrics.longMethods.length > 0 ? chalk.red(metrics.longMethods.length) : chalk.green('0')}`);
  console.log(`  Long Parameter Lists:  ${metrics.longParameterLists.length > 0 ? chalk.yellow(metrics.longParameterLists.length) : chalk.green('0')}`);
  console.log(`  God Classes:           ${metrics.godClasses.length > 0 ? chalk.red(metrics.godClasses.length) : chalk.green('0')}\n`);

  if (metrics.fileRanking.length > 0) {
    console.log(chalk.bold('Most Complex Files:'));
    metrics.fileRanking.slice(0, 3).forEach((file, index) => {
      const shortName = file.file.split(/[/\\]/).pop();
      console.log(`  ${index + 1}. ${chalk.cyan(shortName)}`);
      console.log(chalk.dim(`     Complexity: ${file.cyclomaticComplexity} | Cognitive: ${file.cognitiveComplexity} | Maintainability: ${file.maintainabilityIndex}`));
    });
  }
  console.log(chalk.dim('──────────────────────────────────────────────────'));
}