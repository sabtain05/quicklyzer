import fs from 'node:fs';
import path from 'node:path';
import { RefactorSuggestion, RefactorIntelligence, RefactorCategory, RefactorImpact } from '../types/refactor.js';

export function analyzeRefactoring(files: string[]): RefactorIntelligence {
  const suggestions: RefactorSuggestion[] = [];

  const addSuggestion = (
    file: string,
    line: number,
    category: RefactorCategory,
    impact: RefactorImpact,
    issue: string,
    suggestion: string
  ) => {
    if (suggestions.filter(s => s.file === file && s.issue === issue).length < 2) {
      suggestions.push({ file, line, category, impact, issue, suggestion });
    }
  };

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!['.js', '.jsx', '.ts', '.tsx'].includes(ext)) continue;

    let content: string;
    try {
      content = fs.readFileSync(file, 'utf-8');
    } catch {
      continue;
    }

    const lines = content.split('\n');
    let insideLoop = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;

      if (line.trim().startsWith('//') || line.trim().startsWith('*')) continue;

      if (/\bvar\s+[a-zA-Z0-9_]+\s*=/.test(line)) {
        addSuggestion(file, lineNumber, 'Best Practice', 'Low', 'Usage of var keyword', 'Replace var with let or const for block-level scoping.');
      }

      if (ext.includes('ts') && /:\s*any\b/.test(line)) {
        addSuggestion(file, lineNumber, 'Technical Debt', 'Medium', 'Usage of any type', 'Replace any with a more specific interface or generic to leverage TypeScript safety.');
      }

      if (/@ts-ignore/.test(line)) {
        addSuggestion(file, lineNumber, 'Technical Debt', 'Medium', 'Suppressed TypeScript errors', 'Address the underlying type issue instead of using @ts-ignore, or use @ts-expect-error if intentional.');
      }

      if (/\b(for|while)\s*\(/.test(line)) {
        insideLoop = true;
      }
      if (line.includes('}') && insideLoop) {
        insideLoop = false;
      }
      if (insideLoop && /\bawait\b/.test(line)) {
        addSuggestion(file, lineNumber, 'Performance', 'High', 'Await inside loop', 'Awaiting inside a loop causes sequential execution. Refactor to use Promise.all() to run promises concurrently.');
      }

      if (/dangerouslySetInnerHTML/.test(line)) {
        addSuggestion(file, lineNumber, 'Security', 'High', 'dangerouslySetInnerHTML used', 'This can expose the application to XSS attacks. Ensure the input is heavily sanitized before rendering.');
      }

      if (/\beval\s*\(/.test(line)) {
        addSuggestion(file, lineNumber, 'Security', 'High', 'eval() used', 'Avoid eval() as it can execute arbitrary malicious code. Use alternative logic parsing if necessary.');
      }

      if (/\bconsole\.log\s*\(/.test(line) && !file.includes('test') && !file.includes('spec') && !file.includes('cli')) {
        addSuggestion(file, lineNumber, 'Best Practice', 'Low', 'console.log left in code', 'Remove development logs or replace them with a proper logging library (e.g., Winston, Pino).');
      }
    }
  }


  let score = 0;
  let highCount = 0;
  let mediumCount = 0;
  
  suggestions.forEach(s => {
    if (s.impact === 'High') { score += 10; highCount++; }
    if (s.impact === 'Medium') { score += 5; mediumCount++; }
    if (s.impact === 'Low') score += 2;
  });


  const refactorPriorityScore = Math.min(score, 100);


  const estimatedHours = (highCount * 1.5) + (mediumCount * 0.5) + (suggestions.length - highCount - mediumCount) * 0.25;
  const estimatedTimeSavings = estimatedHours > 0 ? `~${Math.ceil(estimatedHours)} hours of future debugging/scaling` : 'None required';


  const impactWeight = { High: 3, Medium: 2, Low: 1 };
  suggestions.sort((a, b) => impactWeight[b.impact] - impactWeight[a.impact]);

  return {
    hasSuggestions: suggestions.length > 0,
    suggestions: suggestions.slice(0, 15),
    estimatedTimeSavings,
    refactorPriorityScore
  };
}