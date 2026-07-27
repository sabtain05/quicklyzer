import { readdirSync, statSync } from "fs";
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
    }
}