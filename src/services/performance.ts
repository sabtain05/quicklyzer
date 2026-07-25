import { statSync } from "fs";
import { basename } from "path";
import { ModuleInfo } from "./architecture-intelligence.js"



export interface PerformanceAnalysis{
    heavyFiles: {
        file: string;
        size: number;
    }[];
}