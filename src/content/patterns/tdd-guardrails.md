---
name: TDD Guardrails
categorySlug: testing-and-validation
description: Enforcing test-driven development discipline in agentic coding workflows through rules, hooks, and verification protocols.
tags:
  - tdd
  - testing
  - discipline
samplePrompt: "Implement this feature using strict TDD: write a failing test first, then implement the minimum code to pass."
skills:
  - skillName: tdd
    installCommand: "claude plugin install craft"
---

TDD Guardrails enforce test-driven development discipline when working with AI coding agents. The pattern includes:

- **Rules files** (`.claude/rules/testing.md`): Define the RED-GREEN-REFACTOR protocol
- **Three-artifact pattern**: Allium spec → test file → implementation
- **Verification hooks**: Ensure tests exist before implementation is accepted
- **L3/L4 boundary testing**: Test behavior (what) not implementation (how)

Without explicit guardrails, AI agents tend to write implementation first and tests second — or skip tests entirely.
