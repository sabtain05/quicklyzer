import { readdirSync, statSync } from "fs";
import { join, basename } from "path";


export interface TestingAnalysis{
    framework: string;

    testFiles: string[];

    unitTests: number;

    integrationTests: number;
}