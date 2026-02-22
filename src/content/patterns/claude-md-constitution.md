---
name: CLAUDE.md Constitution
categorySlug: context-engineering
description: A concise project-level instruction file that defines architecture rules, naming conventions, verification protocols, and coding standards for AI agents.
tags:
  - context-engineering
  - claude-code
  - project-setup
samplePrompt: "Create a CLAUDE.md file for this project that defines the architecture layers, naming conventions, and verification protocol."
skills:
  - skillName: craft-research
    installCommand: "claude plugin install craft"
tools:
  - toolName: Claude Code
    toolUrl: https://docs.anthropic.com/en/docs/claude-code
---

The CLAUDE.md Constitution pattern establishes a project-level instruction file that serves as the "constitution" for AI coding agents. It defines:

- **Architecture rules**: Layer boundaries, dependency directions, allowed imports
- **Naming conventions**: File naming suffixes (`.entity.ts`, `.use-case.ts`, etc.)
- **Verification protocol**: Commands to run before claiming work is complete
- **Commit conventions**: Conventional commit prefixes and format

A well-crafted CLAUDE.md keeps the agent aligned with project standards without requiring repeated human correction.
