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

    if(project.security.score.score>=90){}
}