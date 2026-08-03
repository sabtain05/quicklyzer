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

    grade: string;

    maturity: string;

    verdict: string;

    roadmap: string[];
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


function calculateGrade(score: number){
    if(score>=98) return "A+";
    if(score>=93) return "A";
    if(score>=88) return "A-";
    if(score>=83) return "B+";
    if(score>=78) return "B";
    if(score>=73) return "B-";
    if(score>=68) return "C+";
    if(score>=60) return "C";

    return "D";
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
        recommendations.push("Improve overall code quality.");
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

    const overallScore=Math.round((project.projectScore.score+maintainability+scalability+project.security.score.score+project.documentation.score.score+project.testing.score.score+project.build.score.score)/7);

    const grade= calculateGrade(overallScore);

    let maturity="Starter";
    if(overallScore>=70)
        maturity="Growing";
    if(overallScore>=85)
        maturity="Production";
    if(overallScore>=95)
        maturity="Enterprise";

    let verdict = "Project is ready for development.";
    if(overallScore>=80)
        verdict = "Project is production ready.";
    if(overallScore>=95)
        verdict = "Project demonstrates enterprise-level engineering quality.";

    const roadmap: string[] = [];
    if(project.documentation.score.score<90){
        roadmap.push("Improve project documentation.");
    }
    if(project.testing.score.score<90){
        roadmap.push("Expand automated testing.");
    }
    if(project.build.score.score<90){
        roadmap.push("Optimize production build.");
    }
    if(project.security.score.score<90){
        roadmap.push("Strengthen security configuration.");
    }
    if(roadmap.length===0){
        roadmap.push("Continue maintaining engineering quality.");
    }

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
        recommendations,
        grade,
        maturity,
        verdict,
        roadmap
    };
}