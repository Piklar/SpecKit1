<!-- 
Sync Impact Report: v0.0.0 → v1.0.0
- MAJOR: Initial constitution ratification
- Added 3 core principles: Clean Code, Strict Testing Standards, Responsive UI
- Added Quality Gates section
- Added Development Workflow section
- Ratified: 2026-04-29
-->

# SpecKit Constitution

## Core Principles

### I. Clean Code (NON-NEGOTIABLE)

All code MUST follow readable, maintainable patterns ensuring long-term sustainability and team comprehension. Code reviews MUST verify adherence to project style guides before any merge approval. Complexity indicators (cyclomatic complexity, method length, cognitive load) MUST be monitored; code with elevated complexity markers MUST include clear justification in review comments or be refactored.

**Rationale**: Clean code reduces defects, accelerates onboarding, and enables confident refactoring.

### II. Strict Testing Standards (NON-NEGOTIABLE)

Test-Driven Development (TDD) is mandatory: tests are written and reviewed before implementation begins. Minimum 80% code coverage is required on all new features. Integration tests MUST verify contract behavior across components and critical user workflows. Unit tests focus on isolated logic; integration tests focus on service boundaries and data flow.

**Rationale**: Comprehensive testing catches bugs early, enables safe refactoring, and documents expected behavior.

### III. Responsive UI (NON-NEGOTIABLE)

All user-facing interfaces MUST render correctly and perform responsively across desktop, tablet, and mobile viewports. Accessibility conformance to WCAG 2.1 AA standard MUST be verified before UI features merge. Responsive breakpoints MUST be tested across major browser engines (Chrome, Firefox, Safari, Edge). Performance targets: first contentful paint ≤2.5s, interactive ≤5s on 4G networks.

**Rationale**: Responsive design ensures inclusivity and reaches the widest user base; accessibility compliance is both ethical and legally required.

## Quality Gates

Code quality MUST be verified through automated analysis (linting, type checking) and manual review. Performance budgets MUST be maintained for bundle size, render time, and network requests. Security scanning MUST run on all dependencies before deployment. Any violations of the three core principles above MUST block merge until resolved.

## Development Workflow

**Code Review Process**: Every PR MUST receive at least one approval from another team member before merge. Reviewers MUST verify compliance with all three core principles: code readability, test coverage, and UI responsiveness (where applicable). Feedback MUST be constructive and specific; nitpicks should not block approval.

**Testing Gates**: All new code MUST include tests. Existing tests MUST pass before merge. Coverage reports MUST be visible in PR checks; decreases in coverage require justification.

**Deployment**: Deployments MUST include a pre-release checklist confirming code quality, test passage, and accessibility review. Hotfixes bypass this workflow only when critical production issues demand immediate resolution; hotfixes MUST still meet all three principles within 48 hours.

## Governance

This constitution supersedes all other development practices and guidelines. Amendments to principles require documented rationale, team review, and unanimous consensus. Version bumps follow semantic versioning: MAJOR for principle removals/redefinitions, MINOR for new principles or significant guidance expansions, PATCH for clarifications or wording refinements. All PRs and reviews MUST verify compliance with this constitution; deviations must be explicitly justified and documented.

**Version**: 1.0.0 | **Ratified**: 2026-04-29 | **Last Amended**: 2026-04-29
