import chalk from "chalk";

export function showBanner(): void {
  console.clear();

  console.log();

  console.log(chalk.cyan.bold("QUICKLYZER"));
  console.log(chalk.gray("===================================="));

  console.log(chalk.green("v0.9.0"));
  console.log(chalk.white("A fast & Intelligent CLI that understands and analyzes software projects in seconds."));

  console.log();
}