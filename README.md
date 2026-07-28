# Quicklyzer

Quicklyzer is a fast and intelligent CLI that analyzes software projects in seconds.

It provides deep insights into your project's architecture, dependencies, documentation, Git repository, security, testing, performance, package health, and overall codebase quality.

---

# Installation

Global install

```bash
npm install -g quicklyzer
```

Without installation

```bash
npx quicklyzer scan
```

---

# Commands

## Scan Project

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

Export Everything

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
- Configuration file detection
- Technology stack detection
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
- Largest packages
- Dependency statistics
- Unused dependency detection
- Missing dependency detection
- Duplicate version detection
- Dependency risk score
- Dependency summary

---

## Code Intelligence

- Source file analysis
- Largest files
- Largest directories
- Extension statistics
- Empty source files
- Hidden files
- TODO detection
- FIXME detection
- HACK detection
- NOTE detection
- Duplicate filename detection
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
- Documentation recommendations
- Documentation score
- Documentation health

---

## Git Intelligence

- Repository detection
- Branch detection
- Remote repository
- Tags
- Recent commits
- Contributors
- Working tree status
- Ahead / Behind detection
- Repository health
- Git recommendations

---

## Security Intelligence

- Environment file detection
- Dangerous file detection
- Sensitive file detection
- Secret detection
- Security score
- Security recommendations
- Security health

---

## Architecture Intelligence

- Module discovery
- Import graph analysis
- Circular dependency detection
- Layer detection
- Public module detection
- Dead module detection
- Dependency depth
- Import hotspots
- Layer summary
- Architecture score
- Architecture recommendations
- Architecture health

---

## Performance Intelligence

- Heavy file detection
- Largest module detection
- Startup cost estimation
- External dependency analysis
- Import density
- Module complexity
- Performance hotspots
- Optimization summary
- Performance score
- Performance recommendations
- Performance health

---

## Testing Intelligence

- Test framework detection
- Test discovery
- Unit test detection
- Integration test detection
- End-to-end test detection
- Snapshot detection
- Mock detection
- Coverage detection
- Untested file detection
- Test ratio
- Largest test suites
- Test distribution
- Coverage readiness
- Testing organization
- Testing maturity
- Testing score
- Testing recommendations
- Testing health

---

## Export Engine

- JSON reports
- Markdown reports
- HTML reports
- Export all formats
- Custom filenames
- Custom output folders
- Timestamped reports

---

## Developer Experience

- Colored terminal output
- Professional report layout
- Progress spinner
- Verbose mode
- Quiet mode
- Performance timing
- Scan duration
- Ignore directories
- Friendly error handling

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