# Quicklyzer

Quicklyzer is a fast & intelligent CLI that analyzes software projects in seconds.

It provides deep insights into project architecture, dependencies, documentation, Git repositories, security, performance, and overall project health—all from your terminal.

---

## Installation

```bash
npm install -g quicklyzer
```

or

```bash
npx quicklyzer scan
```

---

# Commands

## Analyze Current Project

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
quicklyzer scan --ignore coverage
quicklyzer scan --ignore uploads
```

Multiple directories

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

Export all

```bash
quicklyzer export --all
```

Custom output

```bash
quicklyzer export --all --output reports
```

Custom filename

```bash
quicklyzer export --all --output reports --name project-report
```

---

# Features

## Project Intelligence

- Project information
- Project type detection
- Entry point detection
- Project structure
- Folder analysis
- File analysis
- Configuration file detection
- Technology stack detection
- Package health analysis
- Project score
- Project summary

---

## Environment Intelligence

- Package manager detection
- Language detection
- Framework detection
- Framework version detection
- Build tool detection
- Build tool version detection
- Node.js version detection
- Docker detection
- CI/CD detection
- ESLint detection
- Prettier detection
- Monorepo detection

---

## Dependency Intelligence

- Production dependencies
- Development dependencies
- Installed packages
- Installed package size
- Largest installed packages
- Unused dependencies
- Missing dependencies
- Duplicate package detection
- Dependency risk score
- Dependency summary

---

## Code Intelligence

- Source file statistics
- Largest files
- Largest directories
- Extension statistics
- Duplicate filenames
- Empty source files
- Hidden files
- TODO detection
- FIXME detection
- HACK detection
- NOTE detection
- Recent activity

---

## Documentation Intelligence

- README detection
- CHANGELOG detection
- CONTRIBUTING detection
- CODE_OF_CONDUCT detection
- SECURITY detection
- LICENSE detection
- README analysis
- README statistics
- Documentation score
- Documentation recommendations
- Documentation health

---

## Git Intelligence

- Repository detection
- Branch detection
- Remote repository
- Local branches
- Git tags
- Recent commits
- Contributors
- Working tree analysis
- Ahead/Behind tracking
- Repository health
- Git recommendations

---

## Security Intelligence

- Environment file detection
- Dangerous file detection
- Sensitive file detection
- Secret pattern detection
- Security score
- Security rating
- Security recommendations
- Security health

---

## Architecture Intelligence

- Module discovery
- Import analysis
- Layer detection
- Circular dependency detection
- Dead module detection
- Public module detection
- Dependency depth analysis
- Import hotspots
- Layer summary
- Architecture score
- Architecture recommendations
- Architecture health

---

## Performance Intelligence

- Heavy file detection
- Largest modules
- Startup cost estimation
- External dependency analysis
- Import density
- Module complexity analysis
- Performance hotspots
- Performance score
- Performance recommendations
- Optimization summary
- Performance insights
- Performance health

---

## Export Engine

- JSON reports
- Markdown reports
- HTML reports
- Export all formats
- Timestamped reports
- Custom filenames
- Export manifest

---

## Developer Experience

- Colored output
- Progress spinner
- Verbose mode
- Quiet mode
- Scan timing
- Performance metrics
- Ignore directories
- Professional terminal output
- Friendly error handling

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

GitHub:
https://github.com/sabtain05/quicklyzer

---

**A Sabtain Ali production**