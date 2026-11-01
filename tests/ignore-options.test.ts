import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { getProjectStatistics } from "../src/services/statistics.js";
import { analyzeCode } from "../src/services/code.js";

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

describe("ignore options", () => {
  it("skips ignored directories when scanning statistics and code", () => {
    const dir = mkdtempSync(join(tmpdir(), "quicklyzer-ignore-"));
    tempDirs.push(dir);

    mkdirSync(join(dir, "src"), { recursive: true });
    mkdirSync(join(dir, "ignored"), { recursive: true });

    writeFileSync(join(dir, "src", "index.ts"), "export const value = 1;\n", "utf8");
    writeFileSync(join(dir, "ignored", "skip.ts"), "export const hidden = 2;\n", "utf8");

    const stats = getProjectStatistics(dir, { ignore: ["ignored"] });
    const code = analyzeCode(dir, { ignore: ["ignored"] });

    expect(stats.totalFiles).toBe(1);
    expect(stats.sourceFiles).toBe(1);
    expect(code.extensions[".ts"]).toBe(1);
    expect(code.largestFiles.some(file => file.path.includes("skip.ts"))).toBe(false);
  });
});
