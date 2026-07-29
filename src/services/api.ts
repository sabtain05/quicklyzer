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

    let middleware = 0;

    let version="Unknown";

    if(content.includes(".use") || content.includes("middleware")){
        middleware++;
    }

    const match = content.match(/\/v(\d+)/);

    if(match){
        version = `v${match[1]}`;
    }

    const methods = buildMethodStatistics(endpoints);

    const routeGroups = buildRouteGroups(endpoints);

    let score = 100;

    if(totalEndpoints===0)
        score-=40;

    if(!swagger)
        score-=10;

    if(middleware===0)
        score-=10;

    if(score<0)
        score=0;

    let rating = "Excellent";

    if(score<90)
        rating = "Good";

    if(score<75)
        rating = "Fair";

    if(score<60)
        rating = "Poor";

    const recommendations: string[]=[];

    if(totalEndpoints===0){
        recommendations.push("No REST endpoints detected.");
    }

    if(!swagger){
        recommendations.push("Add OpenAPI/Swagger documentation.");
    }

    if(middleware===0){
        recommendations.push("Review middleware configuration.");
    }

    if(recommendations.length===0){
        
    }

    return{
        endpoints,
        totalEndpoints: endpoints.length,
        graphql,
        websocket,
        swagger
    };
}