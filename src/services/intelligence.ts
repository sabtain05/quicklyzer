export interface IntelligenceAnalysis {
    summary: string;
    
    strengths: string[];

    weaknesses: string[];

    maintainability : {
        score: number;
        rating: string;
    };

    scalability : {
        score: number;
        rating: string;
    };

    technicalDebt : string;

    risk: string;

    confidence: number;

    recommendations: string[];
}


function buildRating(score: number){
    if(score>=90)
        return "Excellent";

    if(score>=75)
        return "Good";

    if(score>=60)
        return "Fair";

    return "Poor";
}



export function analyzeIntelligence(project: any): IntelligenceAnalysis {
    const strengths: string[] = [];

    const weaknesses: string[] = [];

    if(project.gitAnalysis.health.score>=90){
        strengths.push("Repository is well maintained");
    }else{
        weaknesses.push("Repository health needs improvement");
    }

    if(project.security.score.score>=90){
        strengths.push("Security configuration is excellent.");
    }else{
        weaknesses.push("Security improvements are recommended.");
    }

    if(project.documentation.score.score>=80){
        strengths.push("Documentation quality is strong.");
    }else{
        weaknesses.push("Documentation should be expanded.");
    }

    if(project.packageHealth.score>=8){
        strengths.push("Package metadata is complete.");
    }else{
        weaknesses.push("Package metadata can be improved.");
    }


    let maintainability= 100;

    maintainability-=project.code.todos.todo;

    maintainability-=project.code.todos.fixme*2;

    maintainability-=project.code.todos.hack*3;

    if(maintainability<0)
        maintainability=0;


    let scalability= 100;

    scalability-=project.architecture.deadModules*2;

    scalability-=project.architecture.circularDependencies*10;

    if(project.build.productionReady)
        scalability+=5;

    if(scalability>100)
        scalability=100;


    let technicalDebt= "LOw";

    if(maintainability<80)
        technicalDebt= "Medium";

    if(maintainability<60)
        technicalDebt= "High";


    let risk= "Low";

    if(project.security.score.score<80)
        risk= "Medium";

    if(project.security.score.score<60)
        risk= "High";


    const recommendations: string[]=[];

    if(maintainability<90){
        recommendations.push("Improve overaal code quality.");
    }

    if(project.documentation.score.score<80){
        recommendations.push("Expand project documentation.");
    }

    if(project.testing.score.score<90){
        recommendations.push("Increase automated test coverage.");
    }

    if(project.build.score.score<90){
        recommendations.push("Improve production build configuration.");
    }

    if(recommendations.length===0){
        recommendations.push("Project follows modern development practices");
    }



    const summary = `Project contains ${project.totalFiles} files and demonstrates a ${project.projectScore.rating.toLowerCase()} overall quality level.`;

    const confidence=Math.min(100, Math.round((project.projectScore.score+project.security.score.score+project.gitAnalysis.health.score+project.documentation.score.score+project.testing.score.score+project.build.score.score)/6));

    return {
        summary,
        strengths,
        weaknesses,
        maintainability: {
            score: maintainability,
            rating: buildRating(maintainability)
        },
        scalability: {
            score: scalability,
            rating: buildRating(scalability)
        },
        technicalDebt,
        risk,
        confidence,
        recommendations
    };
}