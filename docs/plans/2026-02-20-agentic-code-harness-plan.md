# Agentic Code Harness - Implementation Plan

**Date:** 2026-02-20
**Status:** Plan - Ready for Review
**Research:** `docs/plans/2026-02-20-agentic-code-harness-research.md`

## Goal

Build a new TypeScript repo (`lite-ts`) as a static website catalog of agentic coding patterns, deployable to GitHub Pages. The repo itself serves as a reference implementation of a strict agentic code harness — enforcing clean architecture, DDD, BDD (Allium), TDD, and architecture fitness testing (ArchUnitTS).

## Acceptance Criteria

- [ ] `npm run build` produces a static site with category listing, category detail, and pattern detail pages
- [ ] `npm run test` passes all unit tests (domain + application layers, TDD)
- [ ] `npm run test:arch` passes all ArchUnitTS fitness tests enforcing layer boundaries
- [ ] ESLint `no-restricted-imports` blocks cross-layer violations at lint time
- [ ] Claude Code hooks enforce lint-on-edit, protected paths, and architecture checks
- [ ] Allium plugin installed and initial specs written for core domain
- [ ] CLAUDE.md + `.claude/rules/` provide concise agent constitution
- [ ] Pre-commit hooks (husky) run typecheck + lint + test
- [ ] GitHub Actions workflow deploys to GitHub Pages on push to main
- [ ] At least 2 seed categories and 3 seed patterns render correctly

## Files to Create

### Scaffolding & Config
- `package.json` — dependencies, scripts
- `tsconfig.json` — strict mode, path aliases (`@domain/*`, `@application/*`, `@shell/*`)
- `astro.config.mjs` — Astro + Preact integration, base path
- `vitest.config.ts` — globals, path aliases, test includes
- `.eslintrc.json` — `no-restricted-imports` per-layer overrides
- `.prettierrc` — formatting config
- `.gitignore` — node_modules, dist, .astro

### Agentic Harness
- `CLAUDE.md` — agent constitution (~50 lines)
- `.claude/settings.json` — hook configuration
- `.claude/rules/architecture.md` — layer dependency rules
- `.claude/rules/testing.md` — three-artifact pattern, TDD protocol
- `.claude/rules/security.md` — no secrets, input validation
- `.claude/agents/arch-reviewer.md` — architecture compliance subagent
- `.claude/hooks/lint-changed-file.sh` — PostToolUse auto-lint
- `.claude/hooks/block-protected-paths.sh` — PreToolUse path guard
- `.claude/hooks/check-architecture.sh` — Stop hook arch check
- `.husky/pre-commit` — typecheck + lint + test gate

### Allium Specs
- `specs/pattern-catalog.allium` — Category and Pattern entity specs
- `specs/pattern-filtering.allium` — filter/search behavior specs

### Domain Layer (src/core/domain/)
- `entities/category.entity.ts` — Category entity with Zod companion schema
- `entities/pattern.entity.ts` — Pattern entity with Zod companion schema
- `value-objects/slug.value-object.ts` — URL-safe identifier
- `value-objects/tag.value-object.ts` — cross-cutting label
- `value-objects/repo-url.value-object.ts` — validated repo link
- `value-objects/prompt-snippet.value-object.ts` — sample prompt
- `value-objects/skill-reference.value-object.ts` — skill name + install
- `value-objects/tool-reference.value-object.ts` — tool name + URL
- `value-objects/display-order.value-object.ts` — ordering integer
- `services/pattern-filter.service.ts` — filter by tag/category/text
- `services/category-navigation.service.ts` — ordered listing, counts

### Application Layer (src/core/application/)
- `ports/category-repository.port.ts` — Category repository interface
- `ports/pattern-repository.port.ts` — Pattern repository interface
- `use-cases/list-categories.use-case.ts` — ordered categories with pattern counts
- `use-cases/get-category-with-patterns.use-case.ts` — single category + its patterns
- `use-cases/filter-patterns.use-case.ts` — filter/search across all patterns
- `use-cases/get-pattern-detail.use-case.ts` — single pattern by slug

### Shell Layer (src/shell/)
- `adapters/astro-content.adapter.ts` — implements both repository ports from Astro Content Collections
- `composition-root.ts` — manual factory wiring

### Content Collections (src/content/)
- `config.ts` — Zod schemas for categories and patterns collections
- `categories/context-engineering.md` — seed category
- `categories/testing-and-validation.md` — seed category
- `patterns/claude-md-constitution.md` — seed pattern
- `patterns/architecture-fitness-testing.md` — seed pattern
- `patterns/tdd-guardrails.md` — seed pattern

### UI Layer (src/ui/)
- `layouts/BaseLayout.astro` — site shell, nav, footer
- `pages/index.astro` — home: category grid
- `pages/categories/[slug].astro` — category detail with pattern list
- `pages/patterns/[slug].astro` — pattern detail page
- `components/CategoryCard.astro` — static category card
- `components/PatternCard.astro` — static pattern card
- `components/PatternFilter.tsx` — Preact island: tag/search filtering
- `components/SearchBar.tsx` — Preact island: search input

### Tests
- `tests/architecture/architecture.test.ts` — ArchUnitTS fitness tests
- `tests/unit/domain/category.entity.test.ts` — Category entity tests
- `tests/unit/domain/pattern.entity.test.ts` — Pattern entity tests
- `tests/unit/domain/value-objects.test.ts` — Value object tests
- `tests/unit/domain/pattern-filter.service.test.ts` — filter service tests
- `tests/unit/domain/category-navigation.service.test.ts` — navigation service tests
- `tests/unit/application/list-categories.test.ts` — use case tests
- `tests/unit/application/filter-patterns.test.ts` — use case tests
- `tests/unit/application/get-pattern-detail.test.ts` — use case tests

### CI/CD
- `.github/workflows/deploy.yml` — build + test + deploy to GitHub Pages
- `.github/workflows/ci.yml` — PR checks: typecheck, lint, test, arch

## Implementation Phases

### Phase 1: Project Scaffolding
**Goal:** Working Astro project with TypeScript strict mode, Vitest, ESLint, Preact, and path aliases

**Tasks:**
1. `npm create astro@latest` with strict TypeScript
2. Install deps: `preact`, `@astrojs/preact`, `vitest`, `archunit`, `zod`, `eslint`, `husky`, `lint-staged`, `dependency-cruiser`
3. Configure `tsconfig.json` path aliases
4. Configure `vitest.config.ts` with `globals: true` and path aliases
5. Configure `.eslintrc.json` with `no-restricted-imports` per layer
6. Create npm scripts: `test`, `test:arch`, `lint`, `typecheck`, `build`
7. Verify: `npm run build` produces empty static site, `npm run test` exits clean

**Verification:**
- [ ] `npm run build` succeeds
- [ ] `npm run test` exits with 0 (no tests yet, passWithNoTests)
- [ ] `npm run lint` exits clean
- [ ] `npm run typecheck` exits clean
- [ ] Path aliases resolve in imports

---

### Phase 2: Agentic Harness Infrastructure
**Goal:** CLAUDE.md, rules, hooks, and pre-commit hooks enforcing the harness

**Tasks:**
1. Write `CLAUDE.md` — verification protocol, layer rules, naming conventions, commit conventions (~50 lines)
2. Write `.claude/rules/architecture.md` — dependency rule details, path-scoped
3. Write `.claude/rules/testing.md` — three-artifact pattern, TDD protocol
4. Write `.claude/rules/security.md` — no secrets, input validation
5. Write `.claude/settings.json` — hook wiring for all hooks
6. Write `.claude/hooks/lint-changed-file.sh` — PostToolUse lint enforcement
7. Write `.claude/hooks/block-protected-paths.sh` — PreToolUse path guard (blocks edits to `dist/`, `.github/`, `.claude/hooks/`)
8. Write `.claude/hooks/check-architecture.sh` — Stop hook runs `npm run test:arch`
9. Write `.claude/agents/arch-reviewer.md` — architecture compliance subagent
10. Install Allium Claude plugin: `/plugin marketplace add juxt/claude-plugins` then `/plugin install allium`
11. Configure husky + lint-staged pre-commit: typecheck, lint, test

**Verification:**
- [ ] `CLAUDE.md` is under 50 lines
- [ ] Hooks are executable (`chmod +x`)
- [ ] Pre-commit hook blocks on lint failure
- [ ] Allium plugin responds to `/allium` command

---

### Phase 3: Architecture Fitness Tests (L3 Boundary)
**Goal:** ArchUnitTS tests that enforce clean architecture layer boundaries — tests fail if boundaries are violated

**Test Spec:**
```typescript
// tests/architecture/architecture.test.ts
describe('Architecture Fitness', () => {
  it('domain layer has no external dependencies', async () => {
    const rule = projectFiles()
      .inFolder('src/core/domain/**')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/core/application/**');
    await expect(rule).toPassAsync();
  });

  it('domain layer does not depend on shell', async () => {
    const rule = projectFiles()
      .inFolder('src/core/domain/**')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/shell/**');
    await expect(rule).toPassAsync();
  });

  it('domain layer does not depend on ui', async () => {
    const rule = projectFiles()
      .inFolder('src/core/domain/**')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/ui/**');
    await expect(rule).toPassAsync();
  });

  it('application layer does not depend on shell', async () => {
    const rule = projectFiles()
      .inFolder('src/core/application/**')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/shell/**');
    await expect(rule).toPassAsync();
  });

  it('application layer does not depend on ui', async () => {
    const rule = projectFiles()
      .inFolder('src/core/application/**')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/ui/**');
    await expect(rule).toPassAsync();
  });

  it('no circular dependencies in src', async () => {
    const rule = projectFiles()
      .inFolder('src/**')
      .should()
      .haveNoCycles();
    await expect(rule).toPassAsync();
  });

  it('value objects follow naming convention', async () => {
    const rule = projectFiles()
      .inFolder('src/core/domain/value-objects/**')
      .should()
      .haveName('*.value-object.ts');
    await expect(rule).toPassAsync();
  });

  it('entities follow naming convention', async () => {
    const rule = projectFiles()
      .inFolder('src/core/domain/entities/**')
      .should()
      .haveName('*.entity.ts');
    await expect(rule).toPassAsync();
  });

  it('use cases follow naming convention', async () => {
    const rule = projectFiles()
      .inFolder('src/core/application/use-cases/**')
      .should()
      .haveName('*.use-case.ts');
    await expect(rule).toPassAsync();
  });

  it('ports follow naming convention', async () => {
    const rule = projectFiles()
      .inFolder('src/core/application/ports/**')
      .should()
      .haveName('*.port.ts');
    await expect(rule).toPassAsync();
  });
});
```

**Tasks:**
1. Write architecture fitness tests (RED — will pass vacuously on empty folders, but establishes the contract)
2. Create placeholder `index.ts` barrel files in each layer to verify ArchUnitTS scans correctly
3. Run `npm run test:arch` and verify all pass
4. Intentionally add a bad import to verify a test fails, then remove it

**Verification:**
- [ ] `npm run test:arch` passes
- [ ] Bad import triggers test failure (manually verified, then reverted)

---

### Phase 4: Allium Specs + Domain Layer (L3 Boundary)
**Goal:** Write Allium behavioral specs, derive TDD tests, implement domain entities/value objects/services

**Allium Spec (specs/pattern-catalog.allium):**
```
entity Category {
  name: String
  slug: Slug
  description: String
  displayOrder: PositiveInteger
  patterns: [Pattern]

  derived patternCount = count(patterns)
}

entity Pattern {
  name: String
  slug: Slug
  category: Category
  description: String
  tags: [Tag]
  repoUrl: Url?
  samplePrompt: String?
  skills: [SkillReference]
  tools: [ToolReference]
}

rule CreateCategory {
  when: NewCategory(name, description, displayOrder)
  requires: name is non-empty
  requires: slug derived from name is unique
  requires: displayOrder > 0
  ensures: Category created with derived slug
}

rule FilterPatternsByTag {
  when: FilterRequest(tag)
  requires: tag is non-empty
  ensures: returned patterns all contain tag
  ensures: patterns without tag are excluded
}

rule SearchPatterns {
  when: SearchRequest(query)
  requires: query is non-empty
  ensures: returned patterns match query in name or description
}
```

**Test Spec (derived from Allium spec):**
```typescript
// tests/unit/domain/category.entity.test.ts
describe('Category', () => {
  it('creates with valid props and derives slug from name', () => {
    const category = Category.create({
      name: 'Context Engineering',
      description: '...',
      displayOrder: 1,
    });
    expect(category.slug.toString()).toBe('context-engineering');
  });
  it('rejects empty name', () => {
    expect(() => Category.create({
      name: '',
      description: '...',
      displayOrder: 1,
    })).toThrow();
  });
  it('rejects non-positive displayOrder', () => {
    expect(() => Category.create({
      name: 'Test',
      description: '...',
      displayOrder: 0,
    })).toThrow();
  });
});

// tests/unit/domain/pattern-filter.service.test.ts
describe('PatternFilterService', () => {
  it('filterByTag returns only patterns containing the tag', () => {
    // all returned patterns have the tag, none without it
  });
  it('search returns patterns matching query in name or description', () => {
    // match in name or description, non-matching excluded
  });
  it('returns empty array when no patterns match', () => {
    // empty result, not error
  });
});
```

**Tasks:**
1. Write Allium spec `specs/pattern-catalog.allium`
2. Write Allium spec `specs/pattern-filtering.allium`
3. Write value object tests (RED): Slug, Tag, RepoUrl, PromptSnippet, SkillReference, ToolReference, DisplayOrder
4. Implement value objects (GREEN)
5. Write entity tests (RED): Category, Pattern
6. Implement entities with Zod companion schemas (GREEN)
7. Write domain service tests (RED): PatternFilterService, CategoryNavigationService
8. Implement domain services (GREEN)
9. Verify architecture fitness tests still pass

**Verification:**
- [ ] All unit tests pass
- [ ] `npm run test:arch` still passes (domain has zero external imports)
- [ ] Allium specs exist and are consultable via `/allium`

---

### Phase 5: Application Layer (L3 Boundary)
**Goal:** Use cases and port interfaces orchestrating domain logic

**Test Spec (Behavioral Assertions):**
```typescript
// tests/unit/application/list-categories.test.ts
describe('ListCategoriesUseCase', () => {
  it('returns categories ordered by displayOrder with pattern counts', async () => {
    // Arrange: manual mock CategoryRepository + PatternRepository
    // Act: execute use case
    // Assert: result ordered, counts correct
  });
});

// tests/unit/application/filter-patterns.test.ts
describe('FilterPatternsUseCase', () => {
  it('delegates to PatternFilterService and returns results', async () => {
    // manual mock repos, real domain service
    // Assert: filtered results returned
  });
  it('returns all patterns when no filters applied', async () => {
    // no tag, no query -> all patterns
  });
});
```

**Tasks:**
1. Write port interfaces: `CategoryRepositoryPort`, `PatternRepositoryPort`
2. Write manual mock implementations of ports (for testing)
3. Write use case tests (RED) using manual mocks
4. Implement use cases (GREEN)
5. Verify architecture fitness tests still pass

**Verification:**
- [ ] All application tests pass with manual mocks
- [ ] `npm run test:arch` still passes (application imports only from domain)

---

### Phase 6: Content Collections + Shell Layer
**Goal:** Astro Content Collections with Zod schemas, adapter implementing ports, seed content

**Tasks:**
1. Write `src/content/config.ts` — Zod schemas for categories and patterns collections
2. Write seed category markdown files (2 categories)
3. Write seed pattern markdown files (3 patterns)
4. Implement `AstroContentAdapter` — implements both repository ports using Astro `getCollection()`
5. Write `composition-root.ts` — wires adapter to use cases

**Verification:**
- [ ] `npm run build` compiles content collections without errors
- [ ] Zod schema validates seed content frontmatter
- [ ] `npm run test:arch` still passes

---

### Phase 7: UI Layer — Pages and Components
**Goal:** Astro pages rendering categories and patterns, Preact islands for filtering

**Tasks:**
1. Write `BaseLayout.astro` — site shell with nav and footer
2. Write `CategoryCard.astro` — static card component
3. Write `PatternCard.astro` — static card component
4. Write `index.astro` — home page with category grid
5. Write `categories/[slug].astro` — category detail with pattern list
6. Write `patterns/[slug].astro` — pattern detail with full content rendered safely
7. Write `PatternFilter.tsx` — Preact island for tag filtering
8. Write `SearchBar.tsx` — Preact island for text search
9. Style with minimal CSS (no framework, custom properties)

**Verification:**
- [ ] `npm run build` produces static pages
- [ ] Home page renders 2 category cards
- [ ] Category page renders its patterns
- [ ] Pattern page renders full content with repo links, prompts, skills, tools
- [ ] Filter and search islands work client-side

---

### Phase 8: CI/CD + Final Integration
**Goal:** GitHub Actions deploys to Pages, all checks pass in CI

**Tasks:**
1. Write `.github/workflows/ci.yml` — PR checks: typecheck, lint, test, test:arch
2. Write `.github/workflows/deploy.yml` — push to main: build + deploy to GitHub Pages
3. Initialize git repo, create initial commit
4. Run full verification suite

**Verification:**
- [ ] `npm run typecheck && npm run lint && npm run test && npm run test:arch && npm run build` — all pass
- [ ] All acceptance criteria met
- [ ] Architecture fitness tests catch violations
- [ ] Hooks enforce harness rules
- [ ] Site renders correctly in `npm run dev`

## Constraints & Considerations

### Architectural
- Domain layer must have ZERO imports from application, shell, or ui
- Application layer imports only from domain
- Manual factory wiring in composition root — no DI container
- Entities use private constructor + static `create()` + companion Zod schema

### Testing
- Three-artifact pattern: `.allium` spec -> `.test.ts` -> `.ts` implementation
- Property-based tests for value objects where applicable (Slug derivation, Tag normalization)
- Manual mock repositories implementing port interfaces (compile-time type safety)
- ArchUnitTS tests run as part of test suite, not separate step

### Allium Integration
- Allium is a specification language, NOT an executable test runner
- Allium specs live in `specs/` and are consulted by LLMs during code generation
- Tests derived from specs live in `tests/` and are executed by Vitest
- `/allium:distill` used to verify implementation-spec alignment after each phase

### Security
- No secrets in repo (static site, no API keys needed)
- Content is markdown — no user-generated content, no XSS surface
- Preact islands render text content safely using framework APIs, not raw HTML injection

## Out of Scope

- Full-text search (simple client-side filter is sufficient for MVP)
- Dark mode / theme switching (can add later via ThemePort)
- RSS feed generation
- Analytics integration
- Pagination (not needed with <50 patterns initially)
- Custom domain configuration
- Comments or user contributions

## Approval Checklist

Before implementing, verify:
- [ ] All files to create listed with purpose
- [ ] Implementation phases have clear boundaries
- [ ] Test specs defined at L3 boundaries (domain + application)
- [ ] Architecture fitness tests specified
- [ ] Allium plugin installation included in Phase 2
- [ ] Acceptance criteria are testable
- [ ] Constraints documented
- [ ] Out of scope items noted

## Next Steps

After human review and approval:
1. Run `/craft-implement` to execute this plan phase by phase
2. Each phase: Allium spec (if applicable) -> failing tests -> implement -> verify -> proceed
