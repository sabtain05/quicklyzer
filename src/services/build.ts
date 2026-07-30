import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";



export interface BuildAnalysis{
    system: string;

    outputFolders: string[];

    assets: number;

    sourceMaps: number;

    minifiedFiles: number;
}


function walk(dir:string, files: string[]){
    for(const entry of readdirSync(dir)){
        if(["node_modules", ".git"].includes(entry))continue;

        const full = join(dir, entry);

        const stats = statSync(full);

        if(stats.isDirectory()){
            walk(full, files);
            continue;
        }

        files.push(full);
    }
}


function detectBuildSystem(packageJson: any){
    const deps={
        ...packageJson.dependencies,
        ...packageJson.devDependecies
    };

    if(deps.vite)
        return "Vite";

    if(deps.webpack)
        return "Webpack";

    if(deps.rollup)
        return "Rollup";

    if(deps.parcel)
        return "Parcel";

    if(deps.turbo)
        return "Turborepo";

    return "Unknown";
}



export function analyzeBuild(projectPath: string, packageJson: any): BuildAnalysis{
    const files: string[] = [];

    walk(projectPath, files);
}