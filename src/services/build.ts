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
    
}