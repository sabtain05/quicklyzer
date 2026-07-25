import { Command } from "commander";
import { analyzeProject } from "../services/project.js";
import { basename } from "path";
import { formatBytes } from "../services/statistics.js";
import { performance } from "node:perf_hooks";
import ora from "ora";
import {title, error} from "../utils/ui.js";
import { checkForUpdates } from "../services/update.js";
import { getProjectTree } from "../services/architecture.js";

function shouldShow(options: any) {
  return !options.quiet;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString();
}



export function scanCommand() {
  return new Command("scan")
    .description("Analyze the current project")
    .option("-v, --verbose", "Show detailed output")
    .option("-q, --quiet", "Show only summary")
    .option(
      "--ignore <directory>",
      "Ignore a directory",
      (value, previous: string[] = []) => {
        previous.push(value);
        return previous;
      },
      []
    )
    .action((options)=> {
  const startTime = performance.now();
  const spinner = ora("Analyzing project...");
  const started = new Date();

  try {
    spinner.start();

    const project = analyzeProject(process.cwd(), { ignore: options.ignore ?? [] });
    spinner.succeed("Analysis completed");

    const endTime = performance.now();
    const finished = new Date();

    console.log();

    // ============================================================
    // Project
    // ============================================================

    title("Project");
    console.log(`Name             : ${project.name}`);
    console.log(`Version          : ${project.version}`);
    console.log(`Type             : ${project.projectType}`);
    console.log(`Entry Point      : ${project.entryPoint}`);

    if (shouldShow(options)) {
      // ============================================================
      // Project Structure
      // ============================================================

      console.log();
      title("Project Structure");

      console.log("\nFolders:");
      project.projectTree.directories.forEach(dir => console.log(`📁 ${dir}`));

      console.log("\nFiles:");
      project.projectTree.files.forEach(file => console.log(`📄 ${file}`));
    }


    title("Architecture");
    console.log(`Modules                  : ${project.architecture.totalModules}`);
    console.log(`Imports                  : ${project.architecture.totalImports}`);
    console.log(`layers                   : ${project.architecture.layers.length}`);
    console.log(`Dependency Depth         : ${project.architecture.dependencyDepth}`);
    console.log(`Public Modules           : ${project.architecture.publicModules}`);
    console.log(`Dead Modules             : ${project.architecture.deadModules}`);
    console.log(`Circular Dependencies    : ${project.architecture.circularDependencies}`);



    title("Architecture Score");
    console.log(`Score            : ${project.architecture.score.score}/100`);
    console.log(`Rating           : ${project.architecture.score.rating}`);


    title("Architecture Recommendations");
    for(const recommendation of project.architecture.recommendations){
      console.log(`• ${recommendation}`);
    }


    title("Architecture Health");
    console.log(`Health Score     : ${project.architecture.score.score}/100`);


    title("Import Hotspots");
    for(const hotspot of project.architecture.importHotspots){
      console.log(`${basename(hotspot.file)} (${hotspot.imports} imports)`);
    }


    title("Layer Summary");
    for(const layer of project.architecture.layerSummary){
      console.log(`${layer.name} (${layer.modules} modules)`);
    }


    title("Performance");
    console.log(`Heavy Files       : ${project.performance.totalHeavyFiles}`);
    console.log(`Largest Modules   : ${project.performance.largestModules.length}`);
    console.log(`Startup Cost      : ${project.performance.startupCost}`);
    console.log(`Heavy Dependencies: ${project.performance.heavyDependencies}`);


    title("Performance Score");
    console.log(`Score          : ${project.performance.score.score}/100`);
    console.log(`Rating         : ${project.performance.score.rating}`);


    title("Performance Recommendations");
    for(const recommendation of project.performance.recommendations){
      console.log(`• ${recommendation}`);
    }


    title("Import Density");
    console.log(`Average Imports / Module    : ${project.performance.importDensity}`);


    title("Optimization Summary");
    console.log(`Optimized Modules           : ${project.performance.optimizationSummary.optimized}`);
    console.log(`Needs Attention             : ${project.performance.optimizationSummary.needsAttention}`);


    title("Performance Insights");
    if(project.performance.score.score>=90){
      console.log("Project performance is excellent.");
    }else if(project.performance.score.score>=75){
      console.log("Minor optimization opportunities detected.");
    }else{
      console.log("Performance improvements are recommended.");
    }



    // ============================================================
    // Configuration Files
    // ============================================================

    if (shouldShow(options)) {
      console.log();
      title("Configuration Files");

      if (project.configFiles.length === 0) {
        console.log("None");
      } else {
        project.configFiles.forEach(file => console.log(`${file}`));
      }
    }

    // ============================================================
    // Technology Stack
    // ============================================================

    if (shouldShow(options)) {
      console.log();
      title("Technology Stack");

      project.technologyStack.forEach(tech => console.log(`${tech}`));
    }

    // ============================================================
    // Package Health
    // ============================================================

    if (shouldShow(options)) {
      console.log();
      title("Package Health");
      console.log(`Score : ${project.packageHealth.score}/10`);

      console.log("\nPassed:");
      project.packageHealth.passed.forEach(item => console.log(`${item}`));

      console.log("\nMissing:");
      project.packageHealth.missing.forEach(item => console.log(`${item}`));
    }

    // ============================================================
    // Environment
    // ============================================================

    if (shouldShow(options)) {
      console.log();
      title("Environment");
      console.log(`Package Manager  : ${project.packageManager}`);
      console.log(`Language         : ${project.language}`);
      console.log(`Framework        : ${project.framework}`);
      console.log(`Framework Ver.   : ${project.frameworkVersion}`);
      console.log(`Build Tool       : ${project.buildTool}`);
      console.log(`Build Tool Ver.  : ${project.buildToolVersion}`);
      console.log(`Node.js Required : ${project.nodeVersion}`);
      console.log(`Docker           : ${project.docker ? "Yes" : "No"}`);
      console.log(`CI/CD            : ${project.ci}`);
      console.log(`ESLint           : ${project.eslint ? "Yes" : "No"}`);
      console.log(`Prettier         : ${project.prettier ? "Yes" : "No"}`);
      console.log(`Monorepo         : ${project.monorepo ? "Yes" : "No"}`);
    }

    // ============================================================
    // Dependencies
    // ============================================================

    if (shouldShow(options)) {
      console.log();
      title("Dependencies");
    console.log(`Dependencies     : ${project.dependencyCount}`);
    console.log(`Dev Dependencies : ${project.devDependencyCount}`);
    console.log(`Total Packages   : ${project.totalDependencyCount}`);

    console.log();
    console.log("Unused Dependencies:");
      if(project.dependencyAnalysis.unused.length){
        for(const pkg of project.dependencyAnalysis.unused)
          console.log(`• ${pkg}`);
        }else{
          console.log("None");
        }
    console.log();
    console.log("Missing Dependencies:");
      if(project.dependencyAnalysis.missing.length){
        for(const pkg of project.dependencyAnalysis.missing)
          console.log(`• ${pkg}`);
        }else{
          console.log("None");
        }
    
    
    console.log();
    title("Duplicate Versions");
    if(project.dependencyAnalysis.duplicateVersions.length){
      for(const version of project.dependencyAnalysis.duplicateVersions)
        {console.log(`• ${version}`);
        }
      }else{
        console.log("None");
      }    





    console.log();
    title("Dependency Intelligence");
    console.log(`Production Packages : ${project.dependencyAnalysis.production}`);
    console.log(`Development Packages: ${project.dependencyAnalysis.development}`);
    console.log(`Total Packages      : ${project.dependencyAnalysis.total}`);
    console.log(`Private Package     : ${project.dependencyAnalysis.packageInsights.private ? "Yes":"No"}`);
    console.log(`Workspaces          : ${project.dependencyAnalysis.packageInsights.workspaces ? "Yes":"No"}`);
    console.log(`Installed Packages : ${project.dependencyAnalysis.installed}`);
    console.log(`Installed Size     : ${project.dependencyAnalysis.installedSize}`);
    console.log();
    console.log("Largest Packages:");
    for(const pkg of project.dependencyAnalysis.largestPackages){console.log(`${pkg.name} (${(pkg.size/1024/1024).toFixed(1)} MB)`);}


    console.log();
    title("Dependency Risk");
    console.log(`Score  : ${project.dependencyAnalysis.riskScore.score}/100`);
    console.log(`Rating : ${project.dependencyAnalysis.riskScore.rating}`);



    console.log();
    title("Dependency Summary");
    console.log(`Declared Packages : ${project.dependencyAnalysis.total}`);
    console.log(`Installed Packages: ${project.dependencyAnalysis.installed}`);
    console.log(`Unused            : ${project.dependencyAnalysis.unused.length}`);
    console.log(`Missing           : ${project.dependencyAnalysis.missing.length}`);
    console.log(`Duplicate Versions: ${project.dependencyAnalysis.duplicateVersions.length}`);
    }

    // ============================================================
    // Scripts
    // ============================================================

    if (shouldShow(options)) {
      console.log();
      title("Scripts");

      if (project.scripts.length === 0) {
        console.log("No scripts found.");
      } else {
        project.scripts.forEach(script => console.log(`${script}`));
      }
    }

    // ============================================================
    // Statistics
    // ============================================================

    if (shouldShow(options)) {
      console.log();
      title("Project Statistics");

      console.log(`Total Files      : ${project.totalFiles}`);
      console.log(`Source Files     : ${project.sourceFiles}`);
      console.log(`Directories      : ${project.directories}`);
      console.log(`Lines of Code    : ${project.linesOfCode.toLocaleString()}`);
      console.log(`Largest File     : ${basename(project.largestFile.path)} (${project.largestFile.lines.toLocaleString()} lines)`);
      console.log(`Empty Directories: ${project.emptyDirectories}`);
      console.log(`Hidden Files     : ${project.hiddenFiles}`);
      console.log(`Project Size     : ${formatBytes(project.projectSize)}`);

      console.log(`Scan Time        : ${(endTime - startTime).toFixed(2)} ms`);

      if (options.verbose) {
        title("Verbose Information");

        console.log(
          `Current Directory : ${process.cwd()}`
        );

        console.log(
          `Node Version      : ${process.version}`
        );

        console.log(
          `Platform          : ${process.platform}`
        );

        console.log(
          `Architecture      : ${process.arch}`
        );
      }
    }

    // ============================================================
    // Largest Directories
    // ============================================================

    if (shouldShow(options)) {
      console.log();
      title("Largest Directories");

      for (const dir of project.largestDirectories) {
        console.log(`${basename(dir.path)} (${dir.fileCount} files)`);
      }
    }

    // ============================================================
    // Code Analysis
    // ============================================================

    if (shouldShow(options)) {
      console.log();
      title("Code Analysis");

      console.log(`Empty Source Files : ${project.code.emptyFiles}`);

      console.log("\nLargest Files:");

      project.code.largestFiles.forEach(file =>
        console.log(`${file.path} (${file.lines} lines)`)
      );

      console.log("\nExtensions:");

      Object.entries(project.code.extensions)
        .sort()
        .forEach(([ext, count]) =>
          console.log(`${ext.padEnd(8)} ${count}`)
        );
    }

    // ============================================================
    // Code Quality
    // ============================================================

    if (shouldShow(options)) {
      console.log();
      title("Code Quality");

      console.log(`TODO   : ${project.code.todos.todo}`);
      console.log(`FIXME  : ${project.code.todos.fixme}`);
      console.log(`HACK   : ${project.code.todos.hack}`);
      console.log(`NOTE   : ${project.code.todos.note}`);
    }

    // ============================================================
    // Duplicate Files
    // ============================================================

    if (shouldShow(options)) {
      console.log();
      title("Duplicate File Names");

      const duplicates = Object.entries(project.code.duplicateFiles);

      if (duplicates.length === 0) {
        console.log("None");
      } else {
        for (const [name, files] of duplicates) {
          console.log(`\n${name}`);
          files.forEach(file => console.log(`${file}`));
        }
      }
    }

    // ============================================================
    // Recent Activity
    // ============================================================

    if (shouldShow(options)) {
      console.log();
      title("Recent Activity");

      project.code.recentFiles.forEach(file =>
        console.log(file.path)
      );
    }

    // ============================================================
    // Repository
    // ============================================================

    if (shouldShow(options)) {
      console.log();
      title("Repository");

      console.log(`Git              : ${project.git ? "Yes" : "No"}`);
      console.log(`Branch           : ${project.gitBranch}`);
      console.log(`README           : ${project.readme ? "Yes" : "No"}`);
      console.log(`LICENSE          : ${project.license ? "Yes" : "No"}`);
    }


    title("Git Intelligence");
    console.log(`Repository         : ${project.gitAnalysis.available ? "Yes":"No"}`);
    console.log(`Current Branch     : ${project.gitAnalysis.branch || "None"}`);
    console.log(`Local Branches     : ${project.gitAnalysis.localBranches}`);
    console.log(`Tags               : ${project.gitAnalysis.tags}`);
    console.log(`Remote             : ${project.gitAnalysis.remote || "None"}`);
    console.log(`Last Commit        : ${project.gitAnalysis.lastCommit || "None"}`);


    title("Security");
    console.log(`Environment Files  : ${project.security.envFiles.length}`);
    console.log(`Dangerous Files    : ${project.security.dangerousFiles.length}`);
    console.log(`Possible Secrets   : ${project.security.secrets.length}`);


    title("Security Score");
    console.log(`Score              : ${project.security.score.score}/100`);
    console.log(`Rating             : ${project.security.score.rating}`);


    title("Sensitive Files");
    if(project.security.sensitiveFiles.length){
      for(const file of project.security.sensitiveFiles){
        console.log(`• ${file}`);
      }
    }else{
      console.log("None");
    }


    title("Security Recommendations");
    if(project.security.recommendations.length){
      for(const recommendation of project.security.recommendations){
        console.log(`• ${recommendation}`);
      }
    }else{
      console.log("No security recommendations.");
    }


    title("Security Health");
    console.log(`Environment Files  : ${project.security.envFiles.length}`);
    console.log(`Sensitive Files    : ${project.security.sensitiveFiles.length}`);
    console.log(`Secrets Found      : ${project.security.secrets.length}`);
    console.log(`Health Score       : ${project.security.score.score}/100`);
    console.log(`Rating             : ${project.security.score.rating}`);


    title("Working Tree");
    const status = project.gitAnalysis.status === "Clean" ? "Clean" : "Dirty";
    console.log(`Status             : ${status}`);
    console.log(`Modified Files     : ${project.gitAnalysis.modifiedFiles}`);
    console.log(`Staged Files       : ${project.gitAnalysis.stagedFiles}`);
    console.log(`Untracked Files    : ${project.gitAnalysis.untrackedFiles}`);
    console.log(`Ahead              : ${project.gitAnalysis.ahead}`);
    console.log(`Behind             : ${project.gitAnalysis.behind}`);


    title("Repository Health");
    console.log(`Score              : ${project.gitAnalysis.health.score}/100`);
    console.log(`Rating             : ${project.gitAnalysis.health.rating}`);


    title("Recent Commits");
    if(project.gitAnalysis.recentCommits.length){
      for(const commit of project.gitAnalysis.recentCommits){
        console.log(`${commit.hash} ${commit.message}`);
      }
    }else{
      console.log("No commits found.");
    }


    title("Top Contributors");
    if(project.gitAnalysis.contributors.length){
      for(const contributor of project.gitAnalysis.contributors){
        console.log(`${contributor.name} (${contributor.commits})`);
      }
    }else{
      console.log("No contributors.");
    }


    title("Recent Tags");
    if(project.gitAnalysis.recentTags.length){
      for(const tag of project.gitAnalysis.recentTags){
        console.log(tag);
      }
    }else{
      console.log("No tags.");
    }


    title(".gitignore");
    console.log(`Exists             : ${project.gitAnalysis.gitignore.exists ? "Yes" : "No"}`);
    console.log(`Rules              : ${project.gitAnalysis.gitignore.rules}`);


    title("Git Recommendations");
    if(project.gitAnalysis.recommendations.length){
      for(const recommendation of project.gitAnalysis.recommendations){
        console.log(`• ${recommendation}`);
      }
    }else{
      console.log("Repository looks healthy.");
    }



    title("Documentation");
    console.log(`README             : ${project.documentation.readme ? "Yes":"No"}`);
    console.log(`CHANGELOG          : ${project.documentation.changelog ? "Yes":"No"}`);
    console.log(`CONTRIBUTING       : ${project.documentation.contributing ? "Yes":"No"}`);
    console.log(`CODE_OF_CONDUCT    : ${project.documentation.codeOfConduct ? "Yes":"No"}`);
    console.log(`SECURITY           : ${project.documentation.security ? "Yes":"No"}`);
    console.log(`LICENSE            : ${project.documentation.license ? "Yes":"No"}`);
    


    title("Documentation Score");
    console.log(`Score  : ${project.documentation.score.score}/100`);
    console.log(`Rating : ${project.documentation.score.rating}`);


    title("README Analysis");
    if(project.documentation.readmeSections.length){
      for(const section of project.documentation.readmeSections){

        console.log(`• ${section}`);

    }
  }else{

    console.log("No sections detected.");
  }

    title("README Statistics");
    console.log(`Words        : ${project.documentation.readmeStats.words}`);
    console.log(`Headings     : ${project.documentation.readmeStats.headings}`);
    console.log(`Code Blocks  : ${project.documentation.readmeStats.codeBlocks}`);
    console.log(`Links        : ${project.documentation.readmeStats.links}`);
    console.log(`Badges       : ${project.documentation.readmeStats.badges}`);

    title("Documentation Recommendations");
    if(project.documentation.recommendations.length){
      for(const recommendation of project.documentation.recommendations){
        console.log(`• ${recommendation}`);
      }
    }else{
      console.log("No recommendations.");
    }


    title("License");
    console.log(`${project.documentation.licenseType}`);



    title("Documentation Health");
    const docs=project.documentation;
    console.log(`Documents Present : ${[docs.readme,docs.changelog,docs.contributing,docs.codeOfConduct,docs.security,docs.license].filter(Boolean).length}/6`);
    console.log(`README Sections   : ${docs.readmeSections.length}`);
    console.log(`Health Score      : ${docs.score.score}/100`);
    console.log(`Rating            : ${docs.score.rating}`);




    // ============================================================
    // Project Score
    // ============================================================

    console.log();
    title("Project Score");

    console.log(`Score            : ${project.projectScore.score}/100`);
    console.log(`Rating           : ${project.projectScore.rating}`);

    if (shouldShow(options)) {
      console.log();
      title("Execution Time");

      console.log(
        `Started     : ${formatTime(started)}`
      );

      console.log(
        `Finished    : ${formatTime(finished)}`
      );

      console.log(
        `Duration    : ${(endTime-startTime).toFixed(2)} ms`
      );
    }

    // ============================================================
    // Summary
    // ============================================================

    console.log();
    title("Summary");

    console.log(`Project Type     : ${project.projectType}`);
    console.log(`Technologies     : ${project.technologyStack.join(", ")}`);
    console.log(`Health           : ${project.projectScore.score}/100 (${project.projectScore.rating})`);

    if (project.projectScore.score >= 90) {
      console.log("Recommendation   : Excellent project structure.");
    } else if (project.projectScore.score >= 75) {
      console.log("Recommendation   : Good project with minor improvements.");
    } else if (project.projectScore.score >= 60) {
      console.log("Recommendation   : Improve documentation and project structure.");
    } else {
      console.log("Recommendation   : Significant improvements recommended.");
    }


    const update = checkForUpdates();
    title("Quicklyzer");
    console.log(`Version : ${update.current}`);
    if (update.updateAvailable) {
       console.log(
        `Update  : ${update.latest} available`
      );
    } else {
      
      console.log(
        "Update  : You're using the latest version."
      );
    }


    console.log();
    console.log("────────────────────────────");
    console.log("Thank you for using Quicklyzer.");
    console.log("A Sabtain Ali production");
    console.log("https://github.com/sabtain05/quicklyzer");
    console.log();





    console.log();

  } catch (err) {

    spinner.fail("Analysis failed");

    if(err instanceof Error){

        error(err.message);

    }else{

        error("Unknown error.");

    }

    process.exit(1);

}
});
}