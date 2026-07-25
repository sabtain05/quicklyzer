import { statSync } from "fs";
import { basename } from "path";
import { ModuleInfo } from "./architecture-intelligence.js"



export interface PerformanceAnalysis{
    heavyFiles: {
        file: string;
        size: number;
    }[];

    largestModules: {
        file: string;
        imports: number;
    }[];
    totalHeavyFiles: number;

    startupCost: number;

    heavyDependencies: number;

    score: {
        score: number;
        rating: string;
    };

    recommendations: string[];

    importDensity: number;

    moduleComplexity:{
        file: string;
        score: number;
    }[];

    optimizationSummary: {
        optimized: number;
        needsAttention: number;
    };
}


function detectHeavyFiles(modules: ModuleInfo[]){
    return modules.map(module=>({file: module.file, size: statSync(module.file).size})).sort((a,b)=>b.size-a.size).slice(0,5);
}


function detectLargestModules(modules: ModuleInfo[]){
    return [...modules].sort((a,b)=>b.imports.length-a.imports.length).slice(0,5).map(module=>({file: module.file, imports: module.imports.length}));
}


function estimateStartupCost(modules: ModuleInfo[]){
    let cost = 0;
    for(const module of modules){
        cost+=module.imports.length;
    }

    return cost;
}


function detectHeavyDependencies(modules: ModuleInfo[]){
    let total = 0;
    for(const module of modules){
        total+=module.imports.filter(imported=>!imported.startsWith(".") && !imported.startsWith("/")).length;
    }

    return total;
}


function buildRecommendations(heavyFiles: number, startup: number, dependencies: number){
    const recommendations: string[] = [];
    if(heavyFiles>5){
        recommendations.push("Reduce large source files.");
    }

    if(startup>150){
        recommendations.push("Reduce startup imports.");
    }

    if(dependencies>50){
        recommendations.push("Review external dependencies.");
    }

    if(recommendations.length===0){
        recommendations.push("Performance looks healthy.");
    }

    return recommendations;
}


function calculateImportDensity(modules: ModuleInfo[]){
    if(modules.length===0)
        return 0;

    const imports = modules.reduce((sum,module)=>sum+module.imports.length,0);

    return Number((imports/modules.length).toFixed(2));
}


function buildModuleComplexity(modules: ModuleInfo[]){
    return modules.map(module=>({file:module.file, score:module.imports.length})).sort((a,b)=>b.score-a.score).slice(0,5);
}



export function analyzePerformance(modules: ModuleInfo[]):PerformanceAnalysis{
    const heavyFiles = detectHeavyFiles(modules);

    const largestModules = detectLargestModules(modules);

    const startupCost = estimateStartupCost(modules);

    const heavyDependencies = detectHeavyDependencies(modules);

    const importDensity = calculateImportDensity(modules);

    const moduleComplexity = buildModuleComplexity(modules);

    const optimizationSummary = {
        optimized:modules.length-heavyFiles.length,
        needsAttention: heavyFiles.length
    };


    let performanceScore = 100;
    performanceScore-=heavyFiles.length*2;
    performanceScore-=Math.floor(startupCost/20);
    performanceScore-=Math.floor(heavyDependencies/10);
    if(performanceScore<0){
        performanceScore = 0;
    }

    let rating = "Excellent";

    if(performanceScore<90)
        rating = "Good";

    if(performanceScore<75)
        rating = "Fair";

    if(performanceScore<60)
        rating = "Poor";

    
    
    
    
    return{
        heavyFiles,
        largestModules,
        totalHeavyFiles: heavyFiles.length,
        startupCost,
        heavyDependencies,
        score:{
            score: performanceScore,
            rating
        },
        recommendations: buildRecommendations(
            heavyFiles.length,
            startupCost,
            heavyDependencies
        ),
        importDensity,
        moduleComplexity,
    };
}