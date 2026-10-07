export interface PluginContext {
    cwd: string;
    files: string[];
    reportError: (message: string) => void;
    reportWarning: (message: string) => void;
    reportMetric: (name: string, value: number) => void;
}

export interface QuicklyzerPlugin {
    name: string;
    version: string;
    description: string;

    onStart?: (context: PluginContext) => void | Promise<void>;
    onFile?: (filePath: string, content: string, context: PluginContext) => void | Promise<void>;
    onFinish?: (context: PluginContext) => void | Promise<void>;
}

export interface PluginExecutionResult {
    name: string;
    version: string;
    executionTimeMs: number;
    errors: string[];
    warnings: string[];
    metrics: Record<string, string | number>;
}

export interface PluginIntelligence {
    hasPlugins: boolean;
    loadedCount: number;
    results: PluginExecutionResult[];
}