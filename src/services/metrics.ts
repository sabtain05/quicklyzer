import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { FunctionMetric, ClassMetric, FileMetric, CodeMetrics } from '../types/metrics.js';


const THRESHOLDS = {
  LONG_METHOD_LINES: 30,
  LONG_PARAMETER_LIST: 4,
  GOD_CLASS_LINES: 150,
  GOD_CLASS_METHODS: 15,
  GOD_CLASS_COMPLEXITY: 40
};


function calculateMetricsForNode(rootNode: ts.Node) {
  let cyclomatic = 1;
  let cognitive = 0;
  let nodesCount = 0;

  function walk(node: ts.Node, nestingLevel: number) {
    nodesCount++;
    let nextNesting = nestingLevel;

    switch (node.kind) {
      case ts.SyntaxKind.IfStatement:
      case ts.SyntaxKind.CatchClause:
      case ts.SyntaxKind.ForStatement:
      case ts.SyntaxKind.ForInStatement:
      case ts.SyntaxKind.ForOfStatement:
      case ts.SyntaxKind.WhileStatement:
      case ts.SyntaxKind.DoStatement:
        cyclomatic++; cognitive += 1 + nestingLevel; nextNesting++; break;
      case ts.SyntaxKind.SwitchStatement:
        nextNesting++; break;
      case ts.SyntaxKind.CaseClause:
        cyclomatic++; cognitive += 1; break;
      case ts.SyntaxKind.ConditionalExpression:
        cyclomatic++; cognitive += 1 + nestingLevel; nextNesting++; break;
      case ts.SyntaxKind.BinaryExpression:
        const bin = node as ts.BinaryExpression;
        if (
          bin.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken ||
          bin.operatorToken.kind === ts.SyntaxKind.BarBarToken ||
          bin.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken
        ) {
          cyclomatic++; cognitive += 1;
        }
        break;
    }
    ts.forEachChild(node, (child) => walk(child, nextNesting));
  }
  ts.forEachChild(rootNode, (child) => walk(child, 0));
  return { cyclomatic, cognitive, nodesCount };
}

function calculateMaintainability(cyclomatic: number, loc: number, nodesCount: number): number {
  if (loc === 0) return 100;
  const estimatedVolume = nodesCount === 0 ? 0 : nodesCount * Math.log2(nodesCount);
  const v = Math.max(1, estimatedVolume);
  const locLog = Math.max(1, loc);
  let mi = 171 - 5.2 * Math.log(v) - 0.23 * cyclomatic - 16.2 * Math.log(locLog);
  mi = (mi * 100) / 171;
  return Math.max(0, Math.min(100, Math.round(mi)));
}


interface FileAnalysisResult extends FileMetric {
  functionDetails: FunctionMetric[];
  classDetails: ClassMetric[];
}


export function analyzeFile(filePath: string): FileAnalysisResult | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);

    const functionDetails: FunctionMetric[] = [];
    const classDetails: ClassMetric[] = [];

    let fileCyclomatic = 0; let fileCognitive = 0; let fileMaintainabilitySum = 0;

    const getLines = (node: ts.Node) => {
      const start = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
      const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd());
      return { line: start.line + 1, endLine: end.line + 1, lines: Math.max(1, end.line - start.line + 1) };
    };

    const getFunctionName = (node: ts.Node): string => {
      if (ts.isFunctionDeclaration(node) && node.name) return node.name.text;
      if (ts.isMethodDeclaration(node) && ts.isIdentifier(node.name)) return node.name.text;
      if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) return node.name.text;
      return 'anonymous';
    };

    const visit = (node: ts.Node) => {
      if (ts.isClassDeclaration(node) || ts.isClassExpression(node)) {
        const { line, endLine, lines } = getLines(node);
        const name = node.name ? node.name.text : 'anonymous class';
        let methodCount = 0; let classCyclomatic = 0;

        node.members.forEach(member => {
          if (ts.isMethodDeclaration(member) || ts.isConstructorDeclaration(member)) {
            methodCount++; classCyclomatic += calculateMetricsForNode(member).cyclomatic;
          }
        });

        const { nodesCount } = calculateMetricsForNode(node);
        const mi = calculateMaintainability(classCyclomatic, lines, nodesCount);
        classDetails.push({ name, file: filePath, line, endLine, lines, methods: methodCount, complexity: classCyclomatic, maintainabilityIndex: mi });
      }

      if (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node) || ts.isArrowFunction(node) || ts.isFunctionExpression(node)) {
        const { line, endLine, lines } = getLines(node);
        let name = 'anonymous';
        if ((ts.isArrowFunction(node) || ts.isFunctionExpression(node)) && node.parent && ts.isVariableDeclaration(node.parent)) {
          name = getFunctionName(node.parent);
        } else {
          name = getFunctionName(node);
        }

        const parameters = node.parameters.length;
        const { cyclomatic, cognitive, nodesCount } = calculateMetricsForNode(node);
        const mi = calculateMaintainability(cyclomatic, lines, nodesCount);

        fileCyclomatic += cyclomatic; fileCognitive += cognitive; fileMaintainabilitySum += mi;
        functionDetails.push({ name, file: filePath, line, endLine, lines, parameters, cyclomaticComplexity: cyclomatic, cognitiveComplexity: cognitive, maintainabilityIndex: mi });
      }
      ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    const totalLines = content.split('\n').length;
    const avgMi = functionDetails.length > 0 ? Math.round(fileMaintainabilitySum / functionDetails.length) : 100;
    const complexityScore = (100 - avgMi) + fileCognitive + fileCyclomatic;

    return {
      file: filePath, lines: totalLines, functions: functionDetails.length, classes: classDetails.length,
      cyclomaticComplexity: fileCyclomatic, cognitiveComplexity: fileCognitive, maintainabilityIndex: avgMi, complexityScore,
      functionDetails, classDetails
    };
  } catch (error) {
    return null; 
  }
}


export function analyzeProjectMetrics(files: string[]): CodeMetrics {
  const supportedExtensions = ['.js', '.jsx', '.ts', '.tsx', '.cjs', '.mjs'];
  const sourceFiles = files.filter(f => supportedExtensions.includes(path.extname(f).toLowerCase()));

  const metrics: CodeMetrics = {
    totalFilesAnalyzed: 0, totalFunctionsAnalyzed: 0, totalClassesAnalyzed: 0,
    totalComplexity: 0, averageComplexity: 0, maximumComplexity: 0,
    averageCognitiveComplexity: 0, averageMaintainabilityIndex: 0,
    longMethods: [], longParameterLists: [], godClasses: [], fileRanking: []
  };

  const fileMetrics: FileMetric[] = [];
  let totalMaintainability = 0;
  let totalCognitive = 0;

  for (const file of sourceFiles) {
    const result = analyzeFile(file);
    if (!result) continue; 

    metrics.totalFilesAnalyzed++;
    metrics.totalFunctionsAnalyzed += result.functions;
    metrics.totalClassesAnalyzed += result.classes;
    metrics.totalComplexity += result.cyclomaticComplexity;

    totalMaintainability += result.maintainabilityIndex;
    totalCognitive += result.cognitiveComplexity;

    if (result.cyclomaticComplexity > metrics.maximumComplexity) {
      metrics.maximumComplexity = result.cyclomaticComplexity;
    }

    
    for (const fn of result.functionDetails) {
      if (fn.lines > THRESHOLDS.LONG_METHOD_LINES) metrics.longMethods.push(fn);
      if (fn.parameters > THRESHOLDS.LONG_PARAMETER_LIST) metrics.longParameterLists.push(fn);
    }

    for (const cls of result.classDetails) {
      if (
        cls.lines > THRESHOLDS.GOD_CLASS_LINES ||
        cls.methods > THRESHOLDS.GOD_CLASS_METHODS ||
        cls.complexity > THRESHOLDS.GOD_CLASS_COMPLEXITY
      ) {
        metrics.godClasses.push(cls);
      }
    }

    
    const { functionDetails, classDetails, ...cleanFileMetric } = result;
    fileMetrics.push(cleanFileMetric);
  }


  if (metrics.totalFilesAnalyzed > 0) {
    metrics.averageMaintainabilityIndex = Math.round(totalMaintainability / metrics.totalFilesAnalyzed);
    metrics.averageCognitiveComplexity = Math.round(totalCognitive / metrics.totalFilesAnalyzed);
  }
  if (metrics.totalFunctionsAnalyzed > 0) {
    metrics.averageComplexity = Math.round(metrics.totalComplexity / metrics.totalFunctionsAnalyzed);
  }

 
  metrics.fileRanking = fileMetrics.sort((a, b) => b.complexityScore - a.complexityScore).slice(0, 10);


  metrics.longMethods.sort((a, b) => b.lines - a.lines);
  metrics.longParameterLists.sort((a, b) => b.parameters - a.parameters);
  metrics.godClasses.sort((a, b) => b.complexity - a.complexity);

  return metrics;
}