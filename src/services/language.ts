import path from 'node:path';
import { LanguageIntelligence, LanguageStat } from '../types/language.js';

export function analyzeLanguages(files: string[]): LanguageIntelligence {
  const languageCounts: Record<string, number> = {};
  const frameworks = new Set<string>();
  let totalTrackedFiles = 0;

  const extMap: Record<string, string> = {
    '.js': 'JavaScript', '.jsx': 'JavaScript',
    '.ts': 'TypeScript', '.tsx': 'TypeScript',
    '.py': 'Python',
    '.go': 'Go',
    '.rs': 'Rust',
    '.java': 'Java',
    '.cs': 'C# / .NET',
    '.php': 'PHP',
    '.rb': 'Ruby',
    '.cpp': 'C++', '.hpp': 'C++', '.cc': 'C++',
    '.c': 'C', '.h': 'C',
    '.swift': 'Swift',
    '.kt': 'Kotlin',
    '.dart': 'Dart',
    '.html': 'HTML',
    '.css': 'CSS', '.scss': 'SCSS', '.sass': 'SASS', '.less': 'LESS'
  };

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const fileName = path.basename(file).toLowerCase();
    const filePath = file.replace(/\\/g, '/');

    if (extMap[ext]) {
      const lang = extMap[ext];
      languageCounts[lang] = (languageCounts[lang] || 0) + 1;
      totalTrackedFiles++;
    }

    if (fileName === 'pubspec.yaml') frameworks.add('Flutter');
    if (fileName === 'manage.py') frameworks.add('Django');
    if (fileName === 'pom.xml' || fileName === 'build.gradle') frameworks.add('Java/Spring Boot ecosystem');
    if (fileName === 'gemfile') frameworks.add('Ruby on Rails');
    if (fileName.includes('.csproj')) frameworks.add('.NET Core');
    if (fileName === 'artisan') frameworks.add('Laravel (PHP)');
    if (fileName === 'composer.json') frameworks.add('PHP Composer');
    if (fileName === 'main.go' || fileName === 'go.mod') frameworks.add('Go Modules');
    if (fileName === 'cargo.toml') frameworks.add('Rust / Cargo');
    
    if (filePath.includes('android/app/build.gradle') || filePath.includes('ios/podfile')) {
      if (frameworks.has('Flutter')) {
      } else if (languageCounts['JavaScript'] > 0 || languageCounts['TypeScript'] > 0) {
        frameworks.add('React Native');
      } else {
        frameworks.add('Native Mobile (iOS/Android)');
      }
    }
  }

  const languages: LanguageStat[] = Object.entries(languageCounts)
    .map(([name, count]) => ({
      name,
      fileCount: count,
      percentage: totalTrackedFiles > 0 ? Math.round((count / totalTrackedFiles) * 100) : 0
    }))
    .sort((a, b) => b.fileCount - a.fileCount);

  return {
    isMultiLanguage: languages.length > 1,
    primaryLanguage: languages.length > 0 ? languages[0].name : 'Unknown',
    languages,
    detectedFrameworks: Array.from(frameworks)
  };
}
