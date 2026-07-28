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

    methods:{
        GET: number;
        POST: number;
        PUT: number;
        PATCH: number;
        DELETE: number;
    };

    routeGroups: {
        group: string;
        count: number;
    }[];

    middleware: number;

    version: string;

    score:{
        score: number;
        rating: string;
    };

    recommendations: string[];
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


function buildMethodStatistics(endpoints: Endpoint[]){
    return{
        GET: endpoints.filter(e=>e.method==="GET").length,

        POST: endpoints.filter(e=>e.method==="POST").length,

        PUT: endpoints.filter(e=>e.method==="PUT").length,

        PATCH: endpoints.filter(e=>e.method==="PATCH").length,

        DELETE: endpoints.filter(e=>e.method==="DELETE").length
    };
}


function buildRouteGroups(endpoints: Endpoint[]){
    const map=new Map<string, number>();
    
    for(const endpoint of endpoints){
        const parts = endpoint.path.split("/");
        const group=parts[1] || "root";

        map.set(
            group,
            (map.get(group) ?? 0)+1
        );
    }

    return [...map.entries()]
    .map(([group,count])=>({
        group,
        count
    }))
    .sort((a,b)=>b.count-a.count);
}



export function analyzeApi(projectPath: string, packageJson: any): ApiAnalysis{
    const files: string[] = [];
    walk(projectPath, files);
    const endpoints: Endpoint[] = [];

    const dependencies = {
        ...(packageJson.dependencies ?? {}),
        ...(packageJson.devDependencies ?? {})
    };

    for(const file of files){
        const content = readFileSync(file, "utf8");
        endpoints.push(...discoverEndpoints(content, file));
    }

    const graphql = "graphql" in dependencies || "@apollo/server" in dependencies || "apollo-server" in dependencies;

    const websocket = "ws" in dependencies || "socket.io" in dependencies;

    const swagger = "swagger-ui-express" in dependencies || "swagger-jsdoc" in dependencies || "@nestjs/swagger" in dependencies;

    return{
        endpoints,
        totalEndpoints: endpoints.length,
        graphql,
        websocket,
        swagger
    };
}