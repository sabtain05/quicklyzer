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

    maintainability-=project.codeQuality.todo;

    maintainability-=project.codeQuality.fixme*2;

    const summary = `Project contains ${project.totalFiles} files and demonstrates a ${project.projectScore.rating.toLowerCase()} overall quality level.`;

    return {
        summary,
        strengths,
        weaknesses
    };
}