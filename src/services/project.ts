import { join } from "node:path";
import { fileExists, readJsonFile } from "../utils/system.js";
import { getProjectStatistics } from "./statistics.js";
import { 
    getProjectTree, 
    detectEntryPoint, 
    detectConfigFiles, 
    detectTechnologyStack, 
    analyzePackageHealth,
    calculateProjectScore,
    detectGitBranch,
    detectProjectType
} from "./architecture.js";
import { analyzeCode } from "./code.js";
import { analyzeDependencies } from "./dependencies.js";
import { analyzeDocumentation } from "./documentation.js";
import { analyzeGit, GitAnalysis } from "./git.js";
import { analyzeSecurity } from "./security.js";
import { analyzeArchitecture } from "./architecture-intelligence.js";
import { analyzePerformance } from "./performance.js";
import { analyzeTesting } from "./testing.js";
import { analyzeApi } from "./api.js";
import { analyzeBuild } from  "./build.js";
import { analyzeIntelligence } from "./intelligence.js";


export interface ProjectInfo {
  name: string;
  version: string;
  packageManager: string;
  language: string;
  framework: string;
  frameworkVersion: string;
  buildTool: string;
  buildToolVersion: string;
  dependencyCount: number;
  devDependencyCount: number;
  totalDependencyCount: number;
  totalFiles: number;
  sourceFiles: number;
  directories: number;
  largestDirectories: {
    path: string;
    fileCount: number;
  }[];
  linesOfCode: number;
  largestFile: {
    path: string;
    lines: number;
  };
  emptyDirectories: number;
  hiddenFiles: number;
  projectSize: number;
  projectTree: {
    directories: string[];
    files: string[];
  };
  entryPoint: string;
  configFiles: string[];
  technologyStack: string[];
  packageHealth: {
    score: number;
    passed: string[];
    missing: string[];
  };
  projectScore: {
    score: number;
    rating: string;
  };
  code: {
    extensions: Record<string, number>;
    largestFiles: {
        path: string;
        lines: number;
    }[];
    emptyFiles: number;
    todos: {
    todo:number;
    fixme:number;
    hack:number;
    note:number;
    };
   duplicateFiles: Record<string,string[]>;

    recentFiles:{
    path:string;
    modified:number;
    }[];
  };
  gitBranch: string;
  projectType: string;
dependencyAnalysis: {
    production: number;
    development: number;
    total: number;

    installed: number;
    installedSize: string;

    riskScore: {
        score: number;
        rating: string;
    };

    largestPackages: {
        name: string;
        size: number;
    }[];

    unused: string[];
    missing: string[];

    duplicateVersions: string[];

    packageInsights: {
        private: boolean;
        workspaces: boolean;
        packageManager: string;
    };
};
  documentation:{
    readme:boolean;

    changelog:boolean;

    contributing:boolean;

    codeOfConduct:boolean;

    security:boolean;

    license:boolean;

    readmeSections:string[];

    score:{
      score:number;
      rating:string;
    };

    recommendations:string[];

    readmeStats: {
        words: number;
        headings: number;
        codeBlocks: number;
        links: number;
        badges: number;
    };

    licenseType: string;
  };
  gitAnalysis:GitAnalysis;
  security: {
    envFiles: string[];
    dangerousFiles: string[];
    secrets: string[];
    sensitiveFiles: string[];
    score: {
      score: number;
      rating: string;
    };
    recommendations: string[];
  };
  architecture:{
    modules:{
      file: string;
      imports: string[];
    }[];
    totalModules: number;
    totalImports: number;
    circularDependencies: number;
    dependencyDepth: number;
    publicModules: number;
    deadModules: number;
    layers: string[];
    score:{
      score: number;
      rating: string;
    };
    layerSummary: {
      name: string;
      modules: number;
    }[];
    importHotspots: {
      file: string;
      imports: number;
    }[];
    recommendations: string[];
  };
  performance: {
    heavyFiles: {
      file: string;
      size: number;
    }[];
    largestModules:{
      file: string;
      imports: number;
    }[];
    totalHeavyFiles: number;
    startupCost: number;
    heavyDependencies: number;
    score:{
      score: number;
      rating: string;
    };
    recommendations: string[];
    importDensity:number;
    moduleComplexity:{
      file: string;
      score: number;
    }[];
    optimizationSummary:{
      optimized: number;
      needsAttention: number;
    };
  };
  testing:{
    framework: string;
    testFiles: string[];
    unitTests: number;
    integrationTests: number;
    e2eTests: number;
    snapshots: number;
    mocks: number;
    coverage: boolean;
    untestedFiles: number;
    testRatio: number;
    largestSuites:{
        file: string;
        size: number;
    }[];
    score: {
        score: number;
        rating: string;
    };
    recommendations: string[];
    distribution: {
        unit: number;
        integration: number;
        e2e: number;
    };
    coverageReadiness: {
        ready: boolean;
        reason: string;
    };
    maturity: {
        level: string;
    };
    organization: string;
  };
  api:{
    endpoints:{
      method: string;
      path: string;
      file: string;
    }[];
    totalEndpoints: number;
    graphql: boolean;
    websocket: boolean;
    swagger: boolean;
    methods:{
        GET: number;
        POST: number;
        PUT: number;
        PATCH: number;
        DELETE: number;
    };
    routeGroups: {
        group: string;
        count: number;
    }[];
    middleware: number;
    version: string;
    score:{
        score: number;
        rating: string;
    };
    recommendations: string[];
    complexity: string;
    maturity: string;
  };
  build:{
    system: string;
    outputFolders: string[];
    assets: number;
    sourceMaps: number;
    minifiedFiles: number;
    treeShaking: boolean;
    codeSplitting: boolean;
    bundles: number;
    score:{
      score: number;
      rating: string;
    };
    recommendations: string[];
    assetDistribution: {
        images: number;
        fonts: number;
        styles: number;
        scripts: number;
    };
    productionReady: boolean;
    maturity: string;
  };
  intelligence: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    maintainability : {
        score: number;
        rating: string;
    };
    scalability : {
        score: number;
        rating: string;
    };
    technicalDebt : string;
    risk: string;
    confidence: number;
    recommendations: string[];
    grade: string;
    maturity: string;
    verdict: string;
    roadmap: string[];
  };
  scripts: string[];
  nodeVersion: string;
  docker: boolean;
  ci: string;
  eslint: boolean;
  prettier: boolean;
  monorepo: boolean;
  git: boolean;
  readme: boolean;
  license: boolean;
}

interface PackageJson {
  name?: string;
  version?: string;

  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;

  scripts?: Record<string, string>;

  engines?: {
    node?: string;
  };

  workspaces?: string[];
}

export interface AnalyzeProjectOptions {
  ignore?: string[];
}

function detectPackageManager(projectPath: string): string {
  if (fileExists(join(projectPath, "package-lock.json"))) {
    return "npm";
  }

  if (fileExists(join(projectPath, "pnpm-lock.yaml"))) {
    return "pnpm";
  }

  if (fileExists(join(projectPath, "yarn.lock"))) {
    return "yarn";
  }

  if (fileExists(join(projectPath, "bun.lockb"))) {
    return "bun";
  }

  return "Unknown";
}

function detectLanguage(projectPath: string): string {
  if (fileExists(join(projectPath, "tsconfig.json"))) {
    return "TypeScript";
  }

  if (fileExists(join(projectPath, "jsconfig.json"))) {
    return "JavaScript";
  }

  return "Unknown";
}

function detectFramework(pkg: PackageJson): string {
  const deps = {
    ...(pkg.dependencies ?? {}),
    ...(pkg.devDependencies ?? {})
  };

  if ("next" in deps) return "Next.js";
  if ("react" in deps) return "React";
  if ("vue" in deps) return "Vue";
  if ("@angular/core" in deps) return "Angular";
  if ("express" in deps) return "Express";
  if ("@nestjs/core" in deps) return "NestJS";
  if ("svelte" in deps) return "Svelte";

  return "Unknown";
}

function detectFrameworkVersion(pkg: PackageJson): string {
    const deps = {
        ...(pkg.dependencies ?? {}),
        ...(pkg.devDependencies ?? {})
  };

  const frameworks = [
    "next",
    "react",
    "vue",
    "@angular/core",
    "express",
    "@nestjs/core",
    "svelte",

  ];

  for (const framework of frameworks) {
    if (framework in deps) {
      return deps[framework];
    }
  }

  return "Unknown";
}

function detectBuildTool(pkg: PackageJson): string {
  const deps = {
    ...(pkg.dependencies ?? {}),
    ...(pkg.devDependencies ?? {})
  };

  if ("vite" in deps) return "Vite";
  if ("webpack" in deps) return "Webpack";
  if ("rollup" in deps) return "Rollup";
  if ("parcel" in deps) return "Parcel";
  if ("@rspack/core" in deps) return "Rspack";
  if ("turbopack" in deps) return "Turbopack";

  return "Unknown";
}

function detectBuildToolVersion(pkg: PackageJson): string {
  const deps = {
    ...(pkg.dependencies ?? {}),
    ...(pkg.devDependencies ?? {})
  };

  const buildTools = [
    "vite",
    "webpack",
    "rollup",
    "parcel",
    "@rspack/core",
    "turbopack",
    "esbuild",
    "swc",
    "snowpack",
    "brunch",
    "gulp",
    "grunt",
    "broccoli",
    "fuse-box"
  ];

  for (const tool of buildTools) {
    if (tool in deps) {
      return deps[tool];
    }
  }

  return "Unknown";
}

function getDependencyStatistics(pkg: PackageJson) {
  const dependencies = pkg.dependencies ?? {};
  const devDependencies = pkg.devDependencies ?? {};

  const dependencyCount = Object.keys(dependencies).length;
  const devDependencyCount = Object.keys(devDependencies).length;

  return {
    dependencyCount,
    devDependencyCount,
    totalDependencyCount:
      dependencyCount + devDependencyCount
  };
}

function getScripts(pkg: PackageJson): string[] {
  return Object.keys(pkg.scripts ?? {});
}

function detectNodeVersion(pkg: PackageJson): string {
  return pkg.engines?.node ?? "Not specified";
}

function detectDocker(projectPath: string): boolean {
  const dockerFiles = [
    "Dockerfile",
    "docker-compose.yml",
    "docker-compose.yaml",
    "compose.yml",
    "compose.yaml",
    ".dockerignore"
  ];

  return dockerFiles.some(file =>
    fileExists(join(projectPath, file))
  );
}

function detectCI(projectPath: string): string {
  if (fileExists(join(projectPath, ".github", "workflows"))) {
    return "GitHub Actions";
  }

  if (fileExists(join(projectPath, ".gitlab-ci.yml"))) {
    return "GitLab CI";
  }

  if (fileExists(join(projectPath, "azure-pipelines.yml"))) {
    return "Azure Pipelines";
  }

  if (fileExists(join(projectPath, "circle.yml"))) {
    return "CircleCI";
  }

  return "None";
}

function detectESLint(projectPath: string, pkg: PackageJson): boolean {
  const eslintFiles = [
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.cjs",
    ".eslintrc",
    ".eslintrc.js",
    ".eslintrc.cjs",
    ".eslintrc.json",
    ".eslintrc.yml",
    ".eslintrc.yaml"
  ];

  const hasConfig = eslintFiles.some(file =>
    fileExists(join(projectPath, file))
  );

  const deps = {
    ...(pkg.dependencies ?? {}),
    ...(pkg.devDependencies ?? {})
  };

  return hasConfig || "eslint" in deps;
}

function detectPrettier(projectPath: string, pkg: PackageJson): boolean {
  const prettierFiles = [
    ".prettierrc",
    ".prettierrc.json",
    ".prettierrc.js",
    ".prettierrc.cjs",
    ".prettierrc.yml",
    ".prettierrc.yaml",
    "prettier.config.js",
    "prettier.config.cjs"
  ];

  const hasConfig = prettierFiles.some(file =>
    fileExists(join(projectPath, file))
  );

  const deps = {
    ...(pkg.dependencies ?? {}),
    ...(pkg.devDependencies ?? {})
  };

  return hasConfig || "prettier" in deps;
}

function detectMonorepo(projectPath: string, pkg: PackageJson): boolean {
  const workspaceFiles = [
    "pnpm-workspace.yaml",
    "pnpm-workspace.yml",
    "turbo.json",
    "nx.json"
  ];

  const hasWorkspaceFile = workspaceFiles.some(file =>
    fileExists(join(projectPath, file))
  );

  const hasWorkspaces =
    Array.isArray(pkg.workspaces) &&
    pkg.workspaces.length > 0;

  return hasWorkspaceFile || hasWorkspaces;
}

function detectGit(projectPath: string): boolean {
  return fileExists(join(projectPath, ".git"));
}

function detectReadme(projectPath: string): boolean {
  return (
    fileExists(join(projectPath, "README.md")) ||
    fileExists(join(projectPath, "README.MD")) ||
    fileExists(join(projectPath, "readme.md")) ||
    fileExists(join(projectPath, "readme.MD")) ||
    fileExists(join(projectPath, "Readme.md")) ||
    fileExists(join(projectPath, "Readme.MD"))
  );
}

function detectLicense(projectPath: string): boolean {
  return (
    fileExists(join(projectPath, "LICENSE")) ||
    fileExists(join(projectPath, "LICENSE.md")) ||
    fileExists(join(projectPath, "LICENSE.txt")) ||
    fileExists(join(projectPath, "license")) ||
    fileExists(join(projectPath, "license.md")) ||
    fileExists(join(projectPath, "license.txt")) ||
    fileExists(join(projectPath, "License")) ||
    fileExists(join(projectPath, "License.md")) ||
    fileExists(join(projectPath, "License.txt"))
  );
}

export function analyzeProject(
  projectPath = process.cwd(),
  options: AnalyzeProjectOptions = {}
): ProjectInfo {
  const packageJsonPath = join(projectPath, "package.json");

  if (!fileExists(packageJsonPath)) {
    throw new Error("No package.json found in the current directory.");
  }

  const pkg = readJsonFile<PackageJson>(packageJsonPath);
  const dependencyStats = getDependencyStatistics(pkg);
  const ignored = options.ignore ?? [];
  const scripts = getScripts(pkg);
  const nodeVersion = detectNodeVersion(pkg);
  const docker = detectDocker(projectPath);
  const ci = detectCI(projectPath);
  const eslint = detectESLint(projectPath, pkg);
  const prettier = detectPrettier(projectPath, pkg);
  const monorepo = detectMonorepo(projectPath, pkg);
  const statistics = getProjectStatistics(projectPath, { ignore: ignored });
  const tree = getProjectTree(projectPath, { ignore: ignored });
  const entryPoint = detectEntryPoint(projectPath);
  const configFiles = detectConfigFiles(projectPath);
  const technologyStack = detectTechnologyStack(pkg);
  const packageHealth = analyzePackageHealth(pkg);
  const projectScore = calculateProjectScore({
    packageHealth,
    git: detectGit(projectPath),
    readme: detectReadme(projectPath),
    license: detectLicense(projectPath),
    totalFiles: statistics.totalFiles,
    linesOfCode: statistics.linesOfCode
  });
  const code = analyzeCode(projectPath, { ignore: ignored });
  const gitBranch = detectGitBranch(projectPath);
  const projectType = detectProjectType(pkg);
  const dependencyAnalysis = analyzeDependencies(projectPath, pkg, { ignore: ignored });
  const documentation = analyzeDocumentation(projectPath);
  const gitAnalysis= analyzeGit(projectPath);
  const security = analyzeSecurity(projectPath);
  const architecture= analyzeArchitecture(projectPath);
  const performance = analyzePerformance(architecture.modules);
  const testing = analyzeTesting(projectPath, pkg);
  const api = analyzeApi(projectPath, pkg);
  const build = analyzeBuild(projectPath, pkg);
  



  const project: ProjectInfo = {
    name: pkg.name ?? "Unknown",
    version: pkg.version ?? "Unknown",
    packageManager: detectPackageManager(projectPath),
    language: detectLanguage(projectPath),
    framework: detectFramework(pkg),
    frameworkVersion: detectFrameworkVersion(pkg),
    buildTool: detectBuildTool(pkg),
    buildToolVersion: detectBuildToolVersion(pkg),
    dependencyCount: dependencyStats.dependencyCount,
    devDependencyCount: dependencyStats.devDependencyCount,
    totalDependencyCount: dependencyStats.totalDependencyCount,
    totalFiles: statistics.totalFiles,
    sourceFiles: statistics.sourceFiles,
    directories: statistics.directories,
    largestDirectories: statistics.largestDirectories,
    linesOfCode: statistics.linesOfCode,
    largestFile: statistics.largestFile,
    emptyDirectories: statistics.emptyDirectories,
    hiddenFiles: statistics.hiddenFiles,
    projectSize: statistics.projectSize,
    projectTree: tree,
    entryPoint: entryPoint,
    configFiles: configFiles,
    technologyStack: technologyStack,
    packageHealth: packageHealth,
    projectScore: projectScore,
    code: code,
    gitBranch: gitBranch,
    projectType: projectType,
    dependencyAnalysis: dependencyAnalysis,
    documentation: documentation,
    gitAnalysis,
    security: {
      ...security,
      recommendations: security.recommendations ?? []
    },
    architecture,
    performance,
    testing,
    api,
    build,
    intelligence: {
      summary: "",
      strengths: [],
      weaknesses: [],
      maintainability: {
        score: 0,
        rating: "",
      },
      scalability: {
        score: 0,
        rating: "",
      },
      technicalDebt: "",
      risk: "",
      confidence: 0,
      recommendations: [],
    },
    scripts: scripts,
    nodeVersion: nodeVersion,
    docker: docker,
    ci: ci,
    eslint: eslint,
    prettier: prettier,
    monorepo: monorepo,
    git: detectGit(projectPath),
    readme: detectReadme(projectPath),
    license: detectLicense(projectPath)
  };

  project.intelligence = analyzeIntelligence(project);
  return project;
}
