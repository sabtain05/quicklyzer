import { existsSync, readdirSync, statSync, readFileSync } from "fs";
import { SourceMap } from "module";
import { join } from "path";



export interface BuildAnalysis{
    system: string;

    outputFolders: string[];

    assets: number;

    sourceMaps: number;

    minifiedFiles: number;

    treeShaking: boolean;

    codeSplitting: boolean;

    bundles: number;

    score:{
        score: number;
        rating: string;
    };

    recommendations: string[];

    assetDistribution: {
        iamges: number;
        fonts: number;
        styles: number;
        scripts: number;
    };

    productionReady: boolean;

    maturity: string;
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

    let treeShaking = false;

    let codeSplitting = false;

    let bundles = 0;

    walk(projectPath, files);

    const outputFolders: string[] = [];

    for(const folder of ["dist", "build", "out", ".next"]){
        if(existsSync(join(projectPath,folder))){
            outputFolders.push(folder);
        }
    }
    
    for(const file of files){
    const content = readFileSync(file, "utf8");
        if(content.includes("treeshake") || content.includes("treeShaking")){
            treeShaking = true;
        }

        if(content.includes("import(") || content.includes("dynamic import")){
            codeSplitting=true;
        }
    }


    bundles= files.filter(file=>file.endsWith(".js") || file.endsWith(".css")).length;

    const sourceMaps= files.filter(file=>file.endsWith(".map")).length;

    const assetDistribution={
        images:files.filter(file=>/\.(png|jpg|jpeg|gif|svg|webp|ico)$/i.test(file)).length,
        fonts:files.filter(file=>/\.(woff|woff2|ttf|otf)$/i.test(file)).length,
        styles:files.filter(file=>file.endsWith(".css")).length,
        scripts:files.filter(file=>file.endsWith(".js")).length
    };

    const productionReady = outputFolders.length>0 && minifiedFiles>0 && treeShaking;

    let maturity = "Development";
    if(score>=70)
        maturity="Production"

    if(score>=90)
        maturity="Optimized";

    let score = 100;

    if(outputFolders.length===0)
        score-=20;

    if(!treeShaking)
        score-=10;

    if(!codeSplitting)
        score-=10;

    if(sourceMaps===0)
        score-=5;

    if(score<0)
        score=0;

    let rating = "Excellent";
    
    if(score<90)
        rating="Good";

    if(score<75)
        rating="Fair";

    if(score<60)
        rating="Poor";


    const recommendations: string[]=[];
    if(!treeShaking){recommendations.push("Enable tree Shaking.");        
    }

    if(!codeSplitting){
        recommendations.push("Use dynamic imports of code splitting.");
    }

    if(outputFolders.length===0){
        recommendations.push("Generate a production build.");
    }

    if(recommendations.length===0){
        recommendations.push("Build configuration looks healthy.");
    }


    return{
        system: detectBuildSystem(packageJson),
        outputFolders,
        assets: files.filter(file=>/\.(png|jpg|svg|gif|webp|ico|woff2?|ttf)$/i.test(file)).length,
        sourceMaps: files.filter(file=>file.endsWith(".map")).length,
        minifiedFiles: files.filter(file=>file.endsWith(".min.js") || file.endsWith(".min.css")).length,
        treeShaking,
        codeSplitting,
        bundles,
        score:{score, rating},
        recommendations
    };
}