# Quicklyzer

<p align="center">
  <strong>A fast & intelligent CLI that understands and analyzes software projects in seconds.</strong>
</p>

<p align="center">
  Analyze any software project and get detailed insights into architecture, dependencies, security, testing, documentation, Git health, build quality, APIs, Code Metrics, CI/CD pipelines, Docker containers, Cloud deployments, Monorepo ecosystems, Cross-Language composition, and AI-powered project intelligence.
</p>

---

## Features

### Cross-Language & Framework Intelligence (v3.0.0)
- Polyglot analysis supporting JavaScript, TypeScript, Python, Go, Rust, Java, .NET, PHP, C++, C, Ruby, Swift, Kotlin, Dart, and more
- File extension mapping and percentage composition
- Mobile framework detection (Flutter, React Native, iOS Native, Android Native)
- Backend ecosystem detection (Django, Spring Boot, Ruby on Rails, Laravel)

### Ecosystem & Monorepo Intelligence (v2.9.0)
- Monorepo tool detection (Lerna, Nx, Turborepo)
- Workspace resolution (Yarn, npm, pnpm Workspaces)
- Cross-package mapping and package discovery
- Ecosystem health evaluation

### AI-Assisted Refactoring Suggestions
- Refactor urgency scoring based on impact
- Dangerous React pattern detection (`dangerouslySetInnerHTML`)
- Potential malicious execution detection (`eval()`)
- Performance bottleneck detection (e.g., `await` inside loops)
- Technical debt detection (`var`, `any`, `@ts-ignore`)
- Estimated debugging/scaling time savings

### Cloud & Deployment Intelligence
- Cloud provider detection (Vercel, Netlify, AWS, Firebase, Google Cloud, Azure, Heroku, Cloudflare)
- Infrastructure as Code (IaC) detection (Terraform, Pulumi)
- Serverless framework detection (Serverless, AWS SAM)
- Deployment readiness score
- Cloud recommendations

### CI/CD Intelligence
- CI/CD provider detection (GitHub Actions, GitLab CI, CircleCI, Azure Pipelines, Jenkins)
- Workflow capability analysis (Caching, Tests, Linting, Security, Deployment)
- Workflow quality score
- CI health evaluation
- CI/CD recommendations

### Docker & Container Intelligence
- Dockerfile analysis (Base images, exposed ports, volumes)
- Multi-stage build detection
- Container security checks (Non-root user detection, HEALTHCHECK)
- Docker Compose analysis (Services, networks, volumes)
- Kubernetes manifest detection
- Container health score
- Container recommendations

### Plugin System
- Dynamic configuration discovery
- Plugin lifecycle hooks (`onStart`, `onFile`, `onFinish`)
- Custom analyzer execution
- Custom metric and warning injection

### Project Analysis & Architecture
- Project structure and technology stack detection
- Configuration file discovery
- Circular dependency & dead module detection
- Project complexity insights

### Code Metrics
- Cyclomatic and Cognitive complexity calculation
- Maintainability index evaluation
- Long method, God class, and Long parameter list detection
- File complexity ranking
- Code health dashboard

### Security Intelligence
- Secret detection and environment file detection
- Dangerous file detection
- Security score and recommendations

### Git Intelligence
- Repository health and working tree status
- Recent commits and repository score

### Testing & API Intelligence
- Test framework detection and coverage readiness
- REST endpoint, GraphQL, WebSocket, and OpenAPI detection
- API routing and middleware analysis

### Build Intelligence
- Build system detection and output analysis
- Tree shaking, code splitting, and bundle analysis
- Production readiness

### AI Project Intelligence
- Executive project summary
- Strength and weakness analysis
- Maintainability and Scalability scores
- Technical debt estimation and risk assessment
- Improvement roadmap and AI grade

---

# Installation

## Global

```bash
npm install quicklyzer

```

## NPX

```bash
npx quicklyzer scan

```

---

# Commands

## Scan Project

```bash
npx quicklyzer scan

```

Analyze the current project and generate a complete engineering report.

---

## Version

```bash
npx quicklyzer version

```

---

## About

```bash
npx quicklyzer about

```

---

# Example

```bash
npx quicklyzer scan

```

Output:

```
Project
Environment
Dependencies
Architecture
Package Health
Testing
API
Build
Security
Git
Documentation
Code Metrics
CI/CD Intelligence
Docker & Container Intelligence
Cloud & Deployment Intelligence
Plugin System
Ecosystem & Monorepo Intelligence
Cross-Language & Framework Intelligence
AI-Assisted Refactoring Suggestions
AI Executive Dashboard

```

---

# Requirements

* Node.js >= 20
* npm

---

# Installation Verification

```bash
npx quicklyzer version

```

---

# Why Quicklyzer?

Quicklyzer helps developers understand a project instantly.

Instead of manually checking dozens of files, Quicklyzer scans your project and provides:

* Engineering insights across multiple languages
* Code structure & complexity metrics
* Security analysis
* CI/CD, Docker, and Cloud deployment readiness
* Monorepo workspace mapping
* AI-driven refactoring suggestions
* Extensible plugin support
* Git health
* AI-powered project assessment

---

# Contributing

Contributions are welcome.

Please read:

* CONTRIBUTING.md
* CODE_OF_CONDUCT.md

---

# Security

Please read SECURITY.md before reporting vulnerabilities.

---

# Changelog

See CHANGELOG.md

---

# License

MIT License

---

## Author

**Sabtain Ali**

GitHub:
https://github.com/sabtain05

---

<p align="center">
<strong>A Sabtain Ali production</strong>
</p>
