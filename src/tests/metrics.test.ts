import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { analyzeFile } from '../services/metrics.js';

const tempFilePath = path.join(process.cwd(), 'temp-metrics-test.ts');

describe('Code Metrics Analyzer', () => {
  beforeAll(() => {
    const testCode = `
      class TestClass {
        constructor() {}
        methodOne() {
          if (true) {
            console.log("nested");
          }
        }
      }
      
      function complexFunction(a, b, c, d, e) {
        for(let i=0; i<10; i++) {
          if (i % 2 === 0) {
            console.log("even");
          } else {
            console.log("odd");
          }
        }
      }
    `;
    fs.writeFileSync(tempFilePath, testCode);
  });

  afterAll(() => {
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  });

  it('should correctly detect classes and functions', () => {
    const result = analyzeFile(tempFilePath);
    expect(result).not.toBeNull();
    expect(result?.classes).toBe(1);
    expect(result?.functions).toBe(1);
  });

  it('should identify long parameter lists', () => {
    const result = analyzeFile(tempFilePath);
    const complexFunc = result?.functionDetails.find(f => f.name === 'complexFunction');
    expect(complexFunc?.parameters).toBe(5);
  });

  it('should calculate cyclomatic complexity greater than baseline', () => {
    const result = analyzeFile(tempFilePath);

    expect(result?.cyclomaticComplexity).toBeGreaterThan(2); 
  });
});