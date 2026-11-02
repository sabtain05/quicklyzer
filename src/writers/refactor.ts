import chalk from 'chalk';
import path from 'node:path';
import { RefactorIntelligence } from '../types/refactor.js';

export function printRefactorDashboard(refactor: RefactorIntelligence) {
  if (!refactor || !refactor.hasSuggestions) return;

  console.log('\n' + chalk.bold.blue('AI-ASSISTED REFACTORING SUGGESTIONS'));
  console.log(chalk.dim('──────────────────────────────────────────────────'));

  console.log(`${chalk.bold('Refactor Urgency Score:')} ${chalk.yellow(refactor.refactorPriorityScore + '/100')}`);
  console.log(`${chalk.bold('Estimated Time Savings:')} ${chalk.green(refactor.estimatedTimeSavings)}\n`);

  console.log(chalk.bold('Top Actionable Opportunities:'));
  refactor.suggestions.forEach(s => {
    const shortFile = path.basename(s.file);
    const lineInfo = s.line ? `:${s.line}` : '';
    
    let impactBadge = chalk.bgBlue.black(' LOW ');
    if (s.impact === 'High') impactBadge = chalk.bgRed.white.bold(' HIGH ');
    else if (s.impact === 'Medium') impactBadge = chalk.bgYellow.black.bold(' MED ');

    console.log(`  ${impactBadge} ${chalk.bold.cyan(s.issue)} ${chalk.dim(`in ${shortFile}${lineInfo}`)}`);
    console.log(`     ${chalk.dim('Category:')} ${s.category}`);
    console.log(`     ${chalk.dim('Fix:')}      ${s.suggestion}`);
    console.log();
  });

  console.log(chalk.dim('──────────────────────────────────────────────────'));
}