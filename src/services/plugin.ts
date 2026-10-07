import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { QuicklyzerPlugin, PluginExecutionResult, PluginIntelligence, PluginContext } from '../types/plugin.js';

export async function runPlugins(projectPath: string, files: string[]): Promise<PluginIntelligence> {
  let plugins: QuicklyzerPlugin[] = [];
  const configPaths = [
    path.join(projectPath, 'quicklyzer.config.js'),
    path.join(projectPath, 'quicklyzer.config.mjs'),
    path.join(projectPath, 'quicklyzer.config.cjs')
  ];

  for (const configPath of configPaths) {
    if (fs.existsSync(configPath)) {
      try {
        const importPath = process.platform === 'win32' ? `file://${configPath}` : configPath;
        const configModule = await import(importPath);
        
        if (configModule.default && Array.isArray(configModule.default.plugins)) {
          plugins = configModule.default.plugins;
          break;
        } else if (Array.isArray(configModule.plugins)) {
          plugins = configModule.plugins;
          break;
        }
      } catch (error: any) {
      }
    }
  }

  const results: PluginExecutionResult[] = [];

  for (const plugin of plugins) {
    const result: PluginExecutionResult = {
      name: plugin.name || 'Unnamed Plugin',
      version: plugin.version || '0.0.0',
      executionTimeMs: 0,
      errors: [],
      warnings: [],
      metrics: {}
    };

    const context: PluginContext = {
      cwd: projectPath,
      files,
      reportError: (msg: string) => result.errors.push(msg),
      reportWarning: (msg: string) => result.warnings.push(msg),
      reportMetric: (key: string, value: string | number) => { result.metrics[key] = value; }
    };

    const startTime = performance.now();

    try {
      if (plugin.onStart) {
        await plugin.onStart(context);
      }

      if (plugin.onFile) {
        for (const file of files) {
          try {
            const ext = path.extname(file).toLowerCase();
            const textExtensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.yml', '.yaml', '.html', '.css'];
            
            if (textExtensions.includes(ext)) {
              const content = fs.readFileSync(file, 'utf-8');
              await plugin.onFile(file, content, context);
            }
          } catch (fileErr) {
          }
        }
      }

      if (plugin.onFinish) {
        await plugin.onFinish(context);
      }
    } catch (err: any) {
      result.errors.push(`Plugin lifecycle failed: ${err.message}`);
    } finally {
      result.executionTimeMs = Math.round(performance.now() - startTime);
      results.push(result);
    }
  }

  return {
    hasPlugins: plugins.length > 0,
    loadedCount: plugins.length,
    results
  };
}