import chalk from 'chalk';
import { LanguageIntelligence } from '../types/language.js';

export function printLanguageDashboard(language: LanguageIntelligence) {
  if (!language || language.languages.length === 0) return;

  console.log('\n' + chalk.bold.blue('CROSS-LANGUAGE & FRAMEWORK INTELLIGENCE'));
  console.log(chalk.dim('──────────────────────────────────────────────────'));

  console.log(`${chalk.bold('Primary Language:')} ${chalk.cyan(language.primaryLanguage)}\n`);

  console.log(chalk.bold('Language Composition:'));
  language.languages.forEach(lang => {
    const barLength = Math.max(1, Math.round(lang.percentage / 2)); 
    const bar = '█'.repeat(barLength) + '░'.repeat(50 - barLength);
    
    let percentColor = chalk.green;
    if (lang.percentage < 10) percentColor = chalk.dim;
    else if (lang.percentage < 30) percentColor = chalk.yellow;

    console.log(`  ${lang.name.padEnd(12)} ${chalk.cyan(bar)} ${percentColor(`${lang.percentage}%`)} ${chalk.dim(`(${lang.fileCount} files)`)}`);
  });
  console.log();

  if (language.detectedFrameworks.length > 0) {
    console.log(chalk.bold('Detected Frameworks & Ecosystems:'));
    language.detectedFrameworks.forEach(fw => {
      console.log(`${chalk.cyan(fw)}`);
    });
  }

  console.log(chalk.dim('──────────────────────────────────────────────────'));
}
