import { existsSync, readFileSync } from "fs";
import { join } from "path";

export interface DocumentationAnalysis {

    readme:boolean;

    changelog:boolean;

    contributing:boolean;

    codeOfConduct:boolean;

    security:boolean;

    license:boolean;

    readmeSections:string[];

        score:{
            score:number;
            rating:string;
        };

    recommendations:string[];


    readmeStats:{
        words:number;
        headings:number;
        codeBlocks:number;
        links:number;
        badges:number;
    };

    licenseType:string;


}


function detectReadmeSections(content:string){

    const sections:string[]=[];

    const checks=[
        "installation",
        "usage",
        "features",
        "license",
        "contributing",
        "api",
        "configuration"
    ];

    const lower=content.toLowerCase();

    for(const section of checks){

        if(lower.includes(section))
            sections.push(section);

    }

    return sections;

}


function calculateDocumentationScore(
    analysis:{
        readme:boolean;
        changelog:boolean;
        contributing:boolean;
        codeOfConduct:boolean;
        security:boolean;
        license:boolean;
        readmeSections:string[];
    }
){

    let score=0;

    if(analysis.readme) score+=30;
    if(analysis.license) score+=20;
    if(analysis.changelog) score+=15;
    if(analysis.contributing) score+=10;
    if(analysis.codeOfConduct) score+=10;
    if(analysis.security) score+=10;

    score+=Math.min(
        analysis.readmeSections.length*2,
        5
    );

    let rating="Poor";

    if(score>=90) rating="Excellent";
    else if(score>=75) rating="Good";
    else if(score>=60) rating="Fair";

    return{
        score,
        rating
    };

}


function buildRecommendations(
    analysis:{
        readme:boolean;
        changelog:boolean;
        contributing:boolean;
        codeOfConduct:boolean;
        security:boolean;
        license:boolean;
    }
){

    const recommendations:string[]=[];

    if(!analysis.readme)
        recommendations.push("Add a README.md");

    if(!analysis.changelog)
        recommendations.push("Create CHANGELOG.md");

    if(!analysis.contributing)
        recommendations.push("Add CONTRIBUTING.md");

    if(!analysis.codeOfConduct)
        recommendations.push("Add CODE_OF_CONDUCT.md");

    if(!analysis.security)
        recommendations.push("Add SECURITY.md");

    if(!analysis.license)
        recommendations.push("Add a LICENSE file");

    return recommendations;

}


function analyzeReadme(content:string){

    return{

        words:content.trim().split(/\s+/).filter(Boolean).length,

        headings:(content.match(/^#+\s/gm)||[]).length,

        codeBlocks:(content.match(/```/g)||[]).length/2,

        links:(content.match(/\[[^\]]+\]\([^)]+\)/g)||[]).length,

        badges:(content.match(/!\[[^\]]*\]\([^)]+\)/g)||[]).length

    };

}



function detectLicenseType(content:string){

    const text=content.toLowerCase();

    if(text.includes("mit license"))
        return "MIT";

    if(text.includes("apache license"))
        return "Apache-2.0";

    if(text.includes("gnu general public license"))
        return "GPL";

    if(text.includes("bsd"))
        return "BSD";

    if(text.includes("mozilla public license"))
        return "MPL";

    return "Unknown";

}


export function analyzeDocumentation(
    projectPath:string
):DocumentationAnalysis{

    const readmePath=join(projectPath,"README.md");

    const changelogPath=join(projectPath,"CHANGELOG.md");

    const contributingPath=join(projectPath,"CONTRIBUTING.md");

    const conductPath=join(projectPath,"CODE_OF_CONDUCT.md");

    const securityPath=join(projectPath,"SECURITY.md");

    const licensePath=join(projectPath,"LICENSE");

    const readme=existsSync(readmePath);

    const readmeSections=readme
        ? detectReadmeSections(
            readFileSync(readmePath,"utf8")
        )
        : [];
     
     const readmeStats=

readme

? analyzeReadme(

    readFileSync(readmePath,"utf8")

)

:{

    words:0,

    headings:0,

    codeBlocks:0,

    links:0,

    badges:0

};

const licenseType=

existsSync(licensePath)

? detectLicenseType(

    readFileSync(licensePath,"utf8")

)

:"None";    

    const analysis={

    readme,

    changelog:existsSync(changelogPath),

    contributing:existsSync(contributingPath),

    codeOfConduct:existsSync(conductPath),

    security:existsSync(securityPath),

    license:existsSync(licensePath),

    readmeSections

};


  return{

    ...analysis,

    score:calculateDocumentationScore(
        analysis
    ),

    recommendations:
        buildRecommendations(
            analysis
        ),

       readmeStats,
       licenseType 
    };

}