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

        const full = join(dir, entry);

        const stats = statSync(full);

        if(stats.isDirectory()){
            walk(full, files);
            continue;
        }

        if(full.endsWith(".ts") || full.endsWith(".js")){
            files.push(full);
        }
    }
}


function discoverEndpoints(content: string, file: string){
    const endpoints: Endpoint[] = [];

    const regex = /\.(get|post|put|delete|patch)\(["'`](.*?)["'`]/gi;

    let match;

    while((match = regex.exec(content))){
        endpoints.push({
            method:match[1].toUpperCase(),
            path: match[2],
            file
        });
    }

    return endpoints;
}



export function analyzeApi(projectPath: string, packageJson: any): ApiAnalysis{
    const files: string[] = [];
    walk(projectPath, files);
    const endpoints: Endpoint[] = [];

    for(const file of files){
        const content = readFileSync(file, "utf8");
        endpoints.push(...discoverEndpoints(content, file));

        if(content.includes("graphql"))
            graphql = true;

        if(content.includes("webSocket") || content.includes("socket.io"))
            websocket = true;

        if(content.includes("swagger") || content.includes("openapi"))
            swagger = true;
    }

    return{
        endpoints,
        totalEndpoints: endpoints.length,
        graphql,
        websocket,
        swagger
    };
}