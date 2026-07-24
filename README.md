# Quicklyzer

Quicklyzer is a fast & intelligent CLI that analyzes software projects in seconds.

It scans your project structure, architecture, dependencies, source code, documentation, Git repository, security posture, and overall project health to provide actionable insights for developers.

---

# Installation

```bash
npm install -g quicklyzer
```

or

```bash
npx quicklyzer scan
```

---

# Commands

## Analyze Project

```bash
quicklyzer scan
```

## Verbose Mode

```bash
quicklyzer scan --verbose
```

## Quiet Mode

```bash
quicklyzer scan --quiet
```

## Ignore Directories

```bash
quicklyzer scan --ignore dist
```

```bash
quicklyzer scan --ignore coverage
```

```bash
quicklyzer scan --ignore uploads
```

Multiple directories:

```bash
quicklyzer scan --ignore dist --ignore coverage
```

---

## Export Reports

JSON

```bash
quicklyzer export
```

Markdown

```bash
quicklyzer export --format md
```

HTML

```bash
quicklyzer export --format html
```

All Formats

```bash
quicklyzer export --all
```

Custom Output Folder

```bash
quicklyzer export --all --output reports
```

Custom Filename

```bash
quicklyzer export --all --output reports --name project-report
```

---

# Features

## Project Intelligence

- Project information
- Project type detection
- Entry point detection
- Project structure analysis
- Folder discovery
- File discovery
- Configuration file detection
- Technology stack detection

---

## Architecture Intelligence

- Module discovery
- Import graph analysis
- Total module count
- Total import count
- Circular dependency detection
- Dependency depth analysis
- Layer detection
- Layer summary
- Public API detection
- Dead module detection
- Import hotspots
- Architecture score
- Architecture recommendations
- Architecture health summary

---

## Environment Intelligence

- Package manager detection
- Programming language detection
- Framework detection
- Framework version detection
- Build tool detection
- Build tool version detection
- Required Node.js version
- Docker detection
- CI/CD detection
- ESLint detection
- Prettier detection
- Monorepo detection

---

## Dependency Intelligence

- Production dependencies
- Development dependencies
- Installed package count
- Installed package size
- Largest installed packages
- Unused dependency detection
- Missing dependency detection
- Duplicate version detection
- Dependency risk analysis
- Dependency summary

---

## Package Health

- Package health score
- Package metadata validation
- Repository validation
- Homepage validation
- Author validation
- License validation
- Engines validation
- Keywords validation
- Bugs validation
- Missing package metadata

---

## Code Intelligence

- Source file analysis
- Project statistics
- Largest files
- Largest directories
- Empty source files
- Hidden files
- Extension statistics
- TODO detection
- FIXME detection
- NOTE detection
- HACK detection
- Duplicate filename detection
- Recent file activity

---

## Git Intelligence

- Repository detection
- Current branch
- Local branch count
- Remote repository detection
- Last commit
- Recent commits
- Top contributors
- Recent tags
- Working tree status
- Modified files
- Staged files
- Untracked files
- Ahead/Behind status
- .gitignore analysis
- Repository health score
- Git recommendations

---

## Documentation Intelligence

- README detection
- CHANGELOG detection
- CONTRIBUTING detection
- CODE_OF_CONDUCT detection
- SECURITY detection
- LICENSE detection
- README section analysis
- README statistics
- Badge detection
- Link detection
- License type detection
- Documentation score
- Documentation recommendations
- Documentation health summary

---

## Security Intelligence

- Environment file detection
- Dangerous file detection
- Sensitive file detection
- Secret pattern detection
- Security score
- Security recommendations
- Security health summary

---

## Export Engine

- JSON export
- Markdown export
- HTML export
- Export all formats
- Custom output directory
- Custom report filename

---

## Developer Experience

- Fast project scanning
- Colored terminal output
- Progress spinner
- Verbose mode
- Quiet mode
- Performance timing
- Scan duration
- Ignore directories
- Friendly error handling
- Professional CLI output

---

# Example

```bash
quicklyzer scan
```

---

# Requirements

- Node.js 20+
- npm

---

# License

MIT

---

**A Sabtain Ali production**