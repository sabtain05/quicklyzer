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
}


function detectHeavyFiles(modules: ModuleInfo[]){
    return modules.map(module=>({file: module.file, size: statSync(module.file).size})).sort((a,b)=>b.size-a.size).slice(0,5);
}


function detectLargestModules(modules: ModuleInfo[]){
    return [...modules].sort((a,b)=>b.imports.length-a.imports.length).slice(0,5).map(module=>({file: module.file, imports: module.imports.length}));
}



