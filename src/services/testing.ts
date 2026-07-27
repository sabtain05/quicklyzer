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

    

    return{
        framework: detectFramework(packageJson),
        testFiles,
        unitTests: testFiles.filter(f=>f.includes("unit")).length,
        integrationTests: testFiles.filter(f=>f.includes("integration")).length,
        e2eTests: testFiles.filter(f=>f.includes("e2e")).length,
        snapshots: files.filter(f=>f.endsWith(".snap")).length,
        mocks: files.filter(f=>f.includes("__mocks__")).length,
        coverage: files.some(f=>f.includes("coverage"))
    };
}