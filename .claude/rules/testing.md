# Testing Rules

---

## Three-Artifact Pattern

Every testable behaviour is captured in three files created in this order:

1. **`.allium` spec** — Plain-language description of the expected behaviour. Written before any code. Acts as the contract between intent and implementation.
2. **`.test.ts` file** — TypeScript test that encodes the spec as executable assertions. Must be written and confirmed **RED** (failing) before implementation begins.
3. **`.ts` implementation** — The production code written to make the test go **GREEN**.

Example for a `PatternSlug` value object:

```
tests/core/domain/pattern-slug.allium       # plain-language spec
tests/core/domain/pattern-slug.test.ts      # failing test
src/core/domain/pattern-slug.value-object.ts  # implementation
```

---

## TDD Protocol — RED → GREEN → REFACTOR

1. **RED:** Write the `.allium` spec. Translate it into a `.test.ts` file. Run the test and confirm it fails with a meaningful error (not a syntax error).
2. **GREEN:** Write the minimum implementation code to make the test pass. Do not add behaviour not covered by a test.
3. **REFACTOR:** Clean up implementation and test code without changing behaviour. Re-run tests to confirm they remain green.

Never skip RED. A test that was never red provides no confidence.

---

## Test Location and Naming

- All tests live under `tests/` mirroring the `src/` directory structure.
- Test files match the pattern `**/*.test.ts`.
- Architecture fitness tests live in `tests/arch/`.

```
tests/
  core/
    domain/
      pattern-slug.test.ts
    application/
      get-pattern.use-case.test.ts
  arch/
    layer-dependencies.test.ts
```

---

## Test Boundaries

Tests in this project operate at two levels:

| Level | Name | What it tests |
|---|---|---|
| L3 | Behavioural | Observable outputs given inputs — no internal state inspection |
| L4 | Contract | Port interfaces — that adapters satisfy their contracts |

**Test WHAT, not HOW.** Do not assert on internal method calls, property access order, or private implementation details. If refactoring the internals breaks a test without changing observable behaviour, the test is testing the wrong thing.

---

## Mocking Policy

- **Repository ports:** Use manual mocks — implement the port interface directly in the test file or a `__mocks__` sibling. Do not use `jest.mock()`, `sinon`, `vitest.mock()`, or any mocking framework.
- **Domain objects and value objects:** Use real instances. Never mock them.
- **Application services in UI tests:** Inject a manual stub that implements the port contract.

Manual mock example:

```typescript
// Implements the PatternRepository port directly — no framework
const inMemoryPatternRepository: PatternRepository = {
  findBySlug: async (slug: PatternSlug) => patterns.get(slug.value) ?? null,
  findAll: async () => Array.from(patterns.values()),
};
```

---

## Architecture Fitness Tests

Architecture tests verify that layer import rules (defined in `.claude/rules/architecture.md`) are not violated. They run with:

```sh
npm run test:arch
```

These tests are not optional. A failing architecture test is treated as a test failure and blocks completion.

---

## Running Tests

```sh
# Unit and integration tests
npm run test

# Architecture fitness tests
npm run test:arch

# Type checking (treated as a test gate)
npm run typecheck
```

All commands must exit `0` before work is considered complete.
