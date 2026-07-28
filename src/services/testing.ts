import { readdirSync, statSync, readFileSync } from "fs";
import { join, basename } from "path";


export interface TestingAnalysis{
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
}



function walk(dir: string, files: string[]){
    for(const entry of readdirSync(dir)){
        if(["node_modules", ".git", "dist"].includes(entry))continue;

        const full = join (dir, entry);

        const stats = statSync(full);

        if(stats.isDirectory()){
            walk(full, files);
            continue;
        }

        files.push(full);
    }
}


function detectFramework(packageJson:any){
    const deps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
    };

    if(deps.vitest)
        return "Vitest";

    if (deps.jest)
        return "Jest";

    if(deps.mocha)
        return "Mocha";

    if(deps.playwright)
        return "Playwright";

    if(deps.cypress)
        return "Cypress";

    return "Unknown";
}


function buildlargestSuites(testFiles: string[]){
    return testFiles.map(file=>({file,size:readFileSync(file,"utf8").split("\n").length})).sort((a,b)=>b.size-a.size).slice(0,5);
}



export function analyzeTesting(projectPath: string, packageJson: any): TestingAnalysis{
    const files: string[] =[];

    walk(projectPath, files);

    const testFiles=files.filter(file=>{
        const name = basename(file);

        return(name.includes(".test.") || name.includes(".spec.") || file.includes("__tests__"));
    });

    const sourceFiles = files.filter(file=>file.endsWith(".ts") && !testFiles.includes(file));

    const testRatio = sourceFiles.length===0?0:Number((testFiles.length/sourceFiles.length).toFixed(2));

    const untestedFiles = Math.max(0, sourceFiles.length-testFiles.length);

    let score = 100;
    score-=untestedFiles;

    if(!files.some(f=>f.includes("coverage"))){
        score-=15;
    }

    if(score<0) {
        score = 0;
    }

    let rating = "Excellent";

    if(score<90)
        rating = "Good";

    if(score<75)
        rating = "Fair";

    if (score<60)
        rating = "Poor";


    const recommendations: string[] = [];

    if(untestedFiles>0){
        recommendations.push("Increase test coverage.");
    }

    if(!files.some(f=>f.includes("coverage"))){
        recommendations.push("Generate a coverage report.");
    }

    if(recommendations.length===0){
        recommendations.push("Testing setup looks healthy.");
    }

    const distribution={
        unit: unitTests,
        integration: integrationTests,
        e2e: e2eTests
    };

    const coverageReadiness={
        ready: testFiles.length>0,
        reason: testFiles.length>0 ? "Project is ready for coverage reporting." : "No tests available."
    };

    let maturity = "Beginner";
    
    if(testFiles.length>=5)
        maturity = "Intermediate";

    if(testFiles.length>=15)
        maturity = "Advanced";

    if(testFiles.length>=30)
        maturity = "Enterprise";

    let organization = "Well Organized";

    if(unitTests===0)
        organization = "Missing Unit Tests";

    else if(integrationTests===0)
        organization = "Missing Integration Tests";

    else if(e2eTests===0)
        organization = "Missing E2E Tests";

    return{
        framework: detectFramework(packageJson),
        testFiles,
        unitTests: testFiles.filter(f=>f.includes("unit")).length,
        integrationTests: testFiles.filter(f=>f.includes("integration")).length,
        e2eTests: testFiles.filter(f=>f.includes("e2e")).length,
        snapshots: files.filter(f=>f.endsWith(".snap")).length,
        mocks: files.filter(f=>f.includes("__mocks__")).length,
        coverage: files.some(f=>f.includes("coverage")),
        untestedFiles,
        testRatio,
        largestSuites: buildlargestSuites(testFiles),
        score:{score, rating},
        recommendations
    };
}