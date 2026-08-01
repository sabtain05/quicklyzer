export interface IntelligenceAnalysis {
    summary: string;
    
    strengths: string[];

    weaknesses: string[];
}



export function analyzeIntelligence(project: any): IntelligenceAnalysis {
    const strengths: string[] = [];

    const weaknesses: string[] = [];

    if(project.gitHealth.score.score>=90){
        strengths.push("Repository is well maintained");
    }else{
        weaknesses.push("Repository health needs improvement");
    }

    if(project.security.score.score>=90){
        strengths.push("Security configuration is excellent.");
    }else{
        weaknesses.push("Security improvments are recommended.");
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

    const summary = `Project contains ${project.statistics.totalFiles} files and demonstrates a ${project.projectScore.rating.toLowerCase()} overall quality level.`;

    return {
        summary,
    }
}