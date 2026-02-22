# CLAUDE.md

This file provides guidance for AI assistants (Claude and others) working in this repository.

## Project Overview

This is a starter project repository (`default`) owned by amf1128-code. It is currently a blank slate with no established framework or language. As the project grows, update this file to reflect actual conventions, tooling, and workflows.

## Repository State

- **Current status**: Empty starter project
- **Branch model**: Feature branches prefixed with `claude/` for AI-assisted work; `master` is the main branch
- **Remote**: `amf1128-code/default`

## Development Workflow

### Branching

```bash
# Create a new feature branch
git checkout -b feature/<description>

# AI-assisted branches follow this pattern:
# claude/<task-description>-<session-id>
```

### Commit Conventions

Write clear, descriptive commit messages in the imperative mood:

```
Add user authentication module
Fix null pointer in payment processing
Update README with setup instructions
```

- Keep the subject line under 72 characters
- Use the body to explain *why*, not *what*, when the change is non-obvious
- Reference issues/tickets when relevant: `Fixes #123`

### Pushing Changes

```bash
git push -u origin <branch-name>
```

## General Coding Conventions

Until a specific language/framework is chosen and configured, follow these general principles:

### Code Style

- Prefer clarity over cleverness
- Keep functions small and focused on a single responsibility
- Use descriptive names for variables, functions, and classes
- Avoid deep nesting; prefer early returns
- Delete dead code rather than commenting it out

### Project Structure (to establish as the project grows)

```
project-root/
├── CLAUDE.md          # This file - AI assistant guidance
├── README.md          # Human-facing project documentation
├── src/               # Source code
├── tests/             # Test files mirroring src/ structure
├── docs/              # Additional documentation
└── scripts/           # Build/utility scripts
```

### Testing

- Write tests before or alongside new functionality
- Test files should mirror the source structure
- Each test should test one behavior
- Tests should be runnable with a single command (document it here once established)

### Documentation

- Keep README.md updated with setup instructions and usage examples
- Document non-obvious decisions in code comments or ADRs (Architecture Decision Records)
- Update CLAUDE.md whenever new tooling, workflows, or conventions are established

## AI Assistant Instructions

### When adding new features

1. Understand the existing code structure before making changes
2. Follow established patterns already present in the codebase
3. Run the full test suite before committing
4. Keep changes focused - avoid unrelated refactoring in the same commit

### When fixing bugs

1. Reproduce the bug first (write a failing test if possible)
2. Make the minimal change needed to fix the issue
3. Do not clean up unrelated code in the same commit

### What to avoid

- Do not add features not explicitly requested
- Do not refactor code outside the scope of the task
- Do not add comments explaining what code does (only why, when non-obvious)
- Do not add unnecessary abstractions or over-engineer solutions

## Setup

> This section should be updated once a specific language/framework is chosen.

Currently there are no dependencies or build steps. Add setup instructions here when the project is initialized with a specific stack.

## TODO for project initialization

When starting development, update this file with:

- [ ] Language and framework chosen
- [ ] Package manager and dependency file (e.g., `package.json`, `requirements.txt`, `go.mod`)
- [ ] How to install dependencies
- [ ] How to run the project locally
- [ ] How to run tests
- [ ] Linting/formatting tools and how to run them
- [ ] CI/CD pipeline details
- [ ] Environment variable requirements
- [ ] Deployment process
