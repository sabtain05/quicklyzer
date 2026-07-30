import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";



export interface BuildAnalysis{
    system: string;

    outputFolders: string[];

    assets: number;

    sourceMaps: number;
}