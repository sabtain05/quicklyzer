export interface IntelligenceAnalysis {
    summary: string;
    
    strengths: string[];

    weaknesses: string[];
}



export function analyzeIntelligence(project: any): IntelligenceAnalysis {
    const strengths: string[] = [];
}