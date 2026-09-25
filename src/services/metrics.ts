import fs from 'node:fs';
import ts from 'typescript';
import { FunctionMetric, ClassMetric, FileMetric } from '../types/metrics.js';



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
        cyclomatic++;
        cognitive += 1 + nestingLevel;
        nextNesting++;
        break;
      case ts.SyntaxKind.SwitchStatement:
        nextNesting++;
        break;
      case ts.SyntaxKind.CaseClause:
        cyclomatic++;
        cognitive += 1;
        break;
      case ts.SyntaxKind.ConditionalExpression:
        cyclomatic++;
        cognitive += 1 + nestingLevel;
        nextNesting++;
        break;
      case ts.SyntaxKind.BinaryExpression:
        const bin = node as ts.BinaryExpression;
        if (
          bin.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken ||
          bin.operatorToken.kind === ts.SyntaxKind.BarBarToken ||
          bin.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken
        ) {
          cyclomatic++;
          cognitive += 1;
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



export function analyzeFile(filePath: string): FileMetric | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);

    const functions: FunctionMetric[] = [];
    const classes: ClassMetric[] = [];

    let fileCyclomatic = 0;
    let fileCognitive = 0;
    let fileMaintainabilitySum = 0;

    const getLines = (node: ts.Node) => {
      const start = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
      const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd());
      return {
        line: start.line + 1,
        endLine: end.line + 1,
        lines: Math.max(1, end.line - start.line + 1),
      };
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
        
        let methodCount = 0;
        let classCyclomatic = 0;

        node.members.forEach(member => {
          if (ts.isMethodDeclaration(member) || ts.isConstructorDeclaration(member)) {
            methodCount++;
            const { cyclomatic } = calculateMetricsForNode(member);
            classCyclomatic += cyclomatic;
          }
        });

        const { nodesCount } = calculateMetricsForNode(node);
        const mi = calculateMaintainability(classCyclomatic, lines, nodesCount);

        classes.push({
          name, file: filePath, line, endLine, lines,
          methods: methodCount,
          complexity: classCyclomatic,
          maintainabilityIndex: mi
        });
      }

      if (
        ts.isFunctionDeclaration(node) ||
        ts.isMethodDeclaration(node) ||
        ts.isArrowFunction(node) ||
        ts.isFunctionExpression(node)
      ) {
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

        fileCyclomatic += cyclomatic;
        fileCognitive += cognitive;
        fileMaintainabilitySum += mi;

        functions.push({
          name, file: filePath, line, endLine, lines, parameters,
          cyclomaticComplexity: cyclomatic,
          cognitiveComplexity: cognitive,
          maintainabilityIndex: mi
        });
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    const totalLines = content.split('\n').length;
    const avgMi = functions.length > 0 
      ? Math.round(fileMaintainabilitySum / functions.length) 
      : 100;


    const complexityScore = (100 - avgMi) + fileCognitive + fileCyclomatic;

    return {
      file: filePath,
      lines: totalLines,
      functions: functions.length,
      classes: classes.length,
      cyclomaticComplexity: fileCyclomatic,
      cognitiveComplexity: fileCognitive,
      maintainabilityIndex: avgMi,
      complexityScore
    };
    
  } catch (error) {
    return null;
  }
}