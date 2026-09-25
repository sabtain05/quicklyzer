export interface FunctionMetric {
  name: string;
  file: string;
  line: number;
  endLine: number;
  lines: number;
  parameters: number;
  cyclomaticComplexity: number;
  cognitiveComplexity: number;
  maintainabilityIndex: number;
}

export interface ClassMetric {
  name: string;
  file: string;
  line: number;
  endLine: number;
  lines: number;
  methods: number;
  complexity: number;
  maintainabilityIndex: number;
}

export interface FileMetric {
  file: string;
  lines: number;
  functions: number;
  classes: number;
  cyclomaticComplexity: number;
  cognitiveComplexity: number;
  maintainabilityIndex: number;
  complexityScore: number;
}

export interface CodeMetrics {
  totalFilesAnalyzed: number;
  totalFunctionsAnalyzed: number;
  totalClassesAnalyzed: number;
  totalComplexity: number;
  averageComplexity: number;
  maximumComplexity: number;
  averageCognitiveComplexity: number;
  averageMaintainabilityIndex: number;
  
  longMethods: FunctionMetric[];
  longParameterLists: FunctionMetric[];
  godClasses: ClassMetric[];
  
  fileRanking: FileMetric[];
}