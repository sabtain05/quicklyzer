import fs from 'node:fs';
import ts from 'typescript';
import { FunctionMetric, ClassMetric, FileMetric } from '../types/metrics.js';

export function analyzeFile(filePath: string): FileMetric | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    

    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true
    );

    const functions: FunctionMetric[] = [];
    const classes: ClassMetric[] = [];


    const getLines = (node: ts.Node) => {
      const start = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
      const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd());
      return {
        line: start.line + 1,
        endLine: end.line + 1,
        lines: end.line - start.line + 1,
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
        node.members.forEach(member => {
          if (ts.isMethodDeclaration(member) || ts.isConstructorDeclaration(member)) {
            methodCount++;
          }
        });

        classes.push({
          name,
          file: filePath,
          line,
          endLine,
          lines,
          methods: methodCount,
          complexity: 0,
          maintainabilityIndex: 0
        });
      }

      // 2. Detect Functions & Methods
      if (
        ts.isFunctionDeclaration(node) ||
        ts.isMethodDeclaration(node) ||
        ts.isArrowFunction(node) ||
        ts.isFunctionExpression(node)
      ) {
        const { line, endLine, lines } = getLines(node);
        
        
        let name = 'anonymous';
        if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) {
          if (node.parent && ts.isVariableDeclaration(node.parent)) {
            name = getFunctionName(node.parent);
          }
        } else {
          name = getFunctionName(node);
        }

        const parameters = node.parameters.length;

        functions.push({
          name,
          file: filePath,
          line,
          endLine,
          lines,
          parameters,
          cyclomaticComplexity: 0,
          cognitiveComplexity: 0,
          maintainabilityIndex: 0
        });
      }
      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
    return {
      file: filePath,
      lines: content.split('\n').length,
      functions: functions.length,
      classes: classes.length,
      cyclomaticComplexity: 0,
      cognitiveComplexity: 0,
      maintainabilityIndex: 0,
      complexityScore: 0
    };
    
  } catch (error) {
    return null;
  }
}