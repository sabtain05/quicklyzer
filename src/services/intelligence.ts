export interface IntelligenceAnalysis {
    summary: string;
    
    strengths: string[];

    weaknesses: string[];
}



export function analyzeIntelligence(project: any): IntelligenceAnalysis {
    const strengths: string[] = [];

    const weaknesses: string[] = [];

    if(project.gitHealth.score.score>=90){}
}