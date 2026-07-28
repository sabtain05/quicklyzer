import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";



export interface Endpoint {
    method: string;

    path: string;

    file: string;
}


export interface ApiAnalysis{
    endpoints: Endpoint[];

    totalEndpoints: number;

    graphql: boolean;

    websocket: boolean;

    swagger: boolean;
}


function walk(dir:string, files: string[]){
    for(const entry of readdirSync(dir)){
        if(["node_modules", ".git", "dist"].includes(entry))continue;
    }
}