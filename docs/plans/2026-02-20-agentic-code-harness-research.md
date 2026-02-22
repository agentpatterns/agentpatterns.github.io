# Agentic Code Harness for TypeScript Static Site - Research

**Date:** 2026-02-20
**Status:** Research Complete

## Summary

Research for a new TypeScript static website repo: a catalog of agentic coding patterns with links to repos and sample prompts/skills/tools. Deployable to GitHub Pages with a strict agentic code harness enforcing clean architecture, DDD, BDD (Allium specs), TDD, and architecture fitness testing. Existing research from `thoughts/research/` provides validated patterns from the `swamp` codebase and industry analysis (Stripe, CodeScene, ThoughtWorks, OpenAI).

## Domain Model: Agentic Pattern Catalog

### Entities
- **`Category`** — A first-class grouping of related patterns (e.g., "Context Engineering Patterns", "Testing & Validation Patterns"). Has its own identity, description, display order, and markdown content. Categories are browsable top-level objects, not just labels.
- **`Pattern`** — An agentic coding pattern belonging to one Category. Has identity, description, links to repos, sample prompts, skills, and tools.

### Value Objects
- `Slug` — URL-safe identifier derived from name
- `Tag` — Cross-cutting label for secondary filtering (e.g., "claude-code", "tdd", "hooks")
- `RepoUrl` — Validated repository link
- `PromptSnippet` — Sample prompt text with optional context
- `SkillReference` — Reference to a Claude Code skill (name + install command)
- `ToolReference` — Reference to a tool or library (name + URL + description)
- `DisplayOrder` — Explicit ordering within a category

### Aggregate: Category → Pattern (1:many)
Category is the aggregate root. Patterns belong to exactly one Category. Cross-cutting discovery uses Tags (a pattern can have many tags across category boundaries).

### Domain Services
- `PatternFilterService` — Filter patterns by tag, search text, or category
- `CategoryNavigationService` — Ordered category listing, pattern counts per category

### Bounded Context
Single context — "Pattern Catalog"

### Content Structure
Two Astro Content Collections:
- `src/content/categories/` — One markdown file per category (frontmatter: name, slug, description, displayOrder, icon)
- `src/content/patterns/` — One markdown file per pattern (frontmatter: name, slug, category ref, tags, repoUrl, samplePrompt, skills, tools)

## Key Decisions

### Static Site Tooling: Astro

**Decision:** Astro (built on Vite). Wins decisively for a content catalog:
- Native markdown/MDX with typed Content Collections (Zod schemas on frontmatter)
- Zero JS by default — pattern cards are pure HTML, no JavaScript shipped
- Interactive filtering via a single Preact island (~3 KB) for search/filter UI
- `astro build` produces fully static output for GitHub Pages
- TypeScript built-in with `strict` tsconfig presets
- Vite is the underlying engine — full plugin ecosystem, HMR, fast builds

Clean architecture boundaries remain enforceable: domain and application layers are pure TypeScript modules independent of Astro. Only `src/shell/` and `src/ui/` (Astro pages/components) depend on the framework.

### BDD: Allium (JUXT) — Behavioral Specification Language

**What Allium is:** A formal behavioral specification language from JUXT (github.com/juxt/allium). It is NOT a test runner — it's a notation system for capturing behavioral intent that LLMs consult when generating code. Runtime-free, language-agnostic.

**Installation:**
- Claude Code: `/plugin marketplace add juxt/claude-plugins` then `/plugin install allium`
- Other tools: `npx skills add juxt/allium`

**Key commands:** `/allium` (interactive examination), `/allium:elicit` (build specs from stakeholder conversation), `/allium:distill` (extract specs from existing code)

**Core syntax constructs:**
- **Entities** — define domain objects with properties and derived values
- **Rules** — triggered behaviors with `requires` (preconditions) and `ensures` (outcomes)
- **Configuration** — parametric constraints

**How Allium fits the harness:** Allium specs serve as the behavioral contract that constrains AI agents. They are NOT executable tests — they are specifications that:
1. Guide code generation (LLMs read specs to understand intent)
2. Drive TDD test creation (specs translate to Vitest test cases)
3. Serve as living documentation alongside the code

**Allium + TDD workflow:**
1. Write Allium spec (behavioral intent)
2. Translate spec rules into executable Vitest tests (TDD red phase)
3. Implement to pass tests (TDD green phase)
4. Refactor (TDD refactor phase)
5. Use `/allium:distill` to verify implementation matches spec

**BDD test execution still needs a test runner.** Vitest executes the tests derived from Allium specs. Allium provides the "what should happen" notation; Vitest provides the "does it actually happen" verification.

### Architecture Fitness Testing: ArchUnitTS (`archunit` on npm)

**Package:** `npm install archunit --save-dev` (v2.1.63, 328 GitHub stars, active)

Key capabilities for the harness:
- **Layer dependency rules:** `projectFiles().inFolder('src/core/domain/**').shouldNot().dependOnFiles().inFolder('src/shell/**')`
- **Circular dependency detection:** `.should().haveNoCycles()`
- **Naming convention enforcement:** `.should().haveName('*.service.ts')`
- **Code metrics:** LCOM cohesion, lines of code limits, method count limits
- **PlantUML diagram validation:** `.should().adhereToDiagram(uml)`
- **Custom rules:** `adhereTo(predicate, description)`
- Integrates with Vitest via `globals: true` config
- Fails on zero-match patterns by default (prevents false positives from typos)

**Complement with:** `dependency-cruiser` for CI linting and SVG dependency graph generation.

### TDD Runner: Vitest

Vitest is the natural pairing with Astro/Vite. Co-located test files (`*.test.ts`). ArchUnitTS integrates directly.

### UI Framework: Preact (for interactive islands)

Astro handles static rendering. For the search/filter island: Preact (~3 KB) via `@astrojs/preact`. React ecosystem compatible. TypeScript-native with full type definitions.

## Architecture: Three-Layer Clean Architecture

```
src/core/domain/      Layer 1: Pure business logic, zero external imports
src/core/application/  Layer 2: Use cases + port interfaces
src/shell/             Layer 3: Adapters (content loading, localStorage, URL)
src/ui/                Astro pages + Preact islands (driving adapters)
```

### Dependency Rule (enforced by ArchUnitTS)
- `domain/` imports NOTHING from `application/`, `shell/`, or `ui/`
- `application/` imports only from `domain/`
- `shell/` imports from `domain/` and `application/`
- `ui/` imports from `application/` (via composition root)

### Ports and Adapters in the Browser

| External System | Port Interface (in application/) | Adapter (in shell/) |
|-----------------|----------------------------------|---------------------|
| Content Collections | `PatternRepositoryPort` | `AstroContentAdapter` |
| localStorage | `StoragePort` | `LocalStorageAdapter` |
| URL/query params | `FilterStatePort` | `UrlSearchParamsAdapter` |
| matchMedia | `ThemePort` | `MediaQueryAdapter` |

### DDD Tactical Patterns (from swamp codebase)

- **Entities:** Private constructor, `static create(props)`, `static fromData(data)`, `toData()`, companion Zod schema
- **Branded ID types:** `string & { readonly _brand: unique symbol }`
- **Value Objects:** Immutable, equality by value, factory `create()` with validation
- **Domain Services:** Pure functions, no side effects, no external imports
- **Repository interfaces in domain, implementations in shell**
- **Manual Factory Wiring:** Single `compositionRoot.ts` — no DI container

## Agentic Harness Patterns

### Three Pillars (industry consensus)

1. **Context Engineering:** CLAUDE.md + `.claude/rules/` + Allium specs
2. **Architectural Constraints:** ArchUnitTS + dependency-cruiser + ESLint `no-restricted-imports`
3. **Entropy Management:** Claude Code hooks for deterministic enforcement

### Enforcement Hierarchy (hard to soft)

| Layer | Mechanism | Bypass Risk |
|-------|-----------|-------------|
| 1 | Claude Code hooks (PreToolUse/PostToolUse) | None — deterministic |
| 2 | Architecture fitness tests in CI | None if CI is required |
| 3 | ESLint `no-restricted-imports` per layer | None if lint is required |
| 4 | Pre-commit hooks (husky) | `--no-verify` |
| 5 | Allium specs + CLAUDE.md instructions | Advisory — guides LLM intent |

### Critical Hooks

- **PostToolUse (Edit/Write):** Auto-lint changed files, block on failure
- **PreToolUse (Write/Edit):** Block writes to protected paths
- **PreToolUse (Bash):** Block destructive commands
- **Stop:** Run architecture fitness tests before task completion
- **TaskCompleted:** Require passing tests

### Allium as the Behavioral Contract Layer

Allium occupies a unique position: it's not executable but it's not merely documentation. It's a formal specification that LLMs are trained to interpret. The harness workflow:

```
Allium Spec (intent) → Vitest Tests (verification) → Implementation (code)
     ↑                                                        |
     └─── /allium:distill (feedback loop) ────────────────────┘
```

This creates a three-artifact pattern per feature: `.allium` spec, `.test.ts` file, `.ts` implementation.

## Proposed Folder Structure

```
lite-ts/
├── CLAUDE.md                         # Agent constitution (~50 lines)
├── .claude/
│   ├── settings.json                 # Hook configuration
│   ├── rules/                        # Path-scoped modular rules
│   │   ├── architecture.md
│   │   ├── testing.md
│   │   └── security.md
│   ├── agents/                       # Specialized subagents
│   │   ├── security-reviewer.md
│   │   └── arch-reviewer.md
│   └── hooks/                        # Deterministic enforcement scripts
│       ├── lint-changed-file.sh
│       ├── block-protected-paths.sh
│       └── check-architecture.sh
├── .github/workflows/deploy.yml      # GitHub Pages deployment
├── .husky/pre-commit                 # Pre-commit safety net
├── specs/                            # Allium behavioral specifications
│   ├── pattern-catalog.allium        # Core domain spec
│   ├── pattern-filtering.allium      # Filter/search behavior spec
│   └── pattern-display.allium        # Rendering behavior spec
├── src/
│   ├── core/
│   │   ├── domain/                   # Layer 1: entities, value-objects, services
│   │   │   ├── entities/
│   │   │   │   ├── category.entity.ts
│   │   │   │   └── pattern.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── slug.value-object.ts
│   │   │   │   ├── tag.value-object.ts
│   │   │   │   ├── repo-url.value-object.ts
│   │   │   │   ├── prompt-snippet.value-object.ts
│   │   │   │   ├── skill-reference.value-object.ts
│   │   │   │   ├── tool-reference.value-object.ts
│   │   │   │   └── display-order.value-object.ts
│   │   │   └── services/
│   │   │       ├── pattern-filter.service.ts
│   │   │       ├── pattern-search.service.ts
│   │   │       └── category-navigation.service.ts
│   │   └── application/              # Layer 2: use-cases, ports
│   │       ├── use-cases/
│   │       │   ├── list-categories.use-case.ts
│   │       │   ├── get-category-with-patterns.use-case.ts
│   │       │   ├── filter-patterns.use-case.ts
│   │       │   └── get-pattern-detail.use-case.ts
│   │       └── ports/
│   │           ├── category-repository.port.ts
│   │           ├── pattern-repository.port.ts
│   │           ├── storage.port.ts
│   │           └── filter-state.port.ts
│   ├── shell/                        # Layer 3: adapters, composition-root
│   │   ├── adapters/
│   │   │   ├── astro-content.adapter.ts
│   │   │   ├── local-storage.adapter.ts
│   │   │   └── url-search-params.adapter.ts
│   │   └── composition-root.ts
│   ├── ui/                           # Astro pages + Preact islands
│   │   ├── pages/
│   │   │   ├── index.astro           # Home: category listing
│   │   │   ├── categories/
│   │   │   │   └── [slug].astro      # Category detail: patterns in category
│   │   │   └── patterns/
│   │   │       └── [slug].astro      # Pattern detail page
│   │   ├── components/
│   │   │   ├── CategoryCard.astro    # Static category card (zero JS)
│   │   │   ├── PatternCard.astro     # Static pattern card (zero JS)
│   │   │   ├── PatternFilter.tsx     # Preact island (interactive)
│   │   │   └── SearchBar.tsx         # Preact island (interactive)
│   │   └── layouts/
│   │       └── BaseLayout.astro
│   ├── content/                      # Markdown content (two collections)
│   │   ├── config.ts                 # Astro Content Collections + Zod schemas
│   │   ├── categories/               # One .md per category
│   │   │   ├── context-engineering.md
│   │   │   ├── testing-and-validation.md
│   │   │   ├── architectural-constraints.md
│   │   │   └── entropy-management.md
│   │   └── patterns/                 # One .md per pattern (refs a category)
│   │       ├── tdd-guardrails.md
│   │       ├── architecture-fitness.md
│   │       └── approval-testing.md
│   └── shared/                       # Cross-cutting utilities
│       └── types/
├── tests/
│   ├── architecture/                 # ArchUnitTS fitness tests
│   │   └── architecture.test.ts
│   ├── unit/                         # Unit tests (TDD, derived from Allium specs)
│   │   ├── domain/
│   │   └── application/
│   └── integration/                  # Integration tests
├── astro.config.mjs
├── vitest.config.ts
├── tsconfig.json
└── package.json
```

## Key Dependencies

| Concern | Package | Purpose |
|---------|---------|---------|
| Framework | `astro` | Static site generator (Vite-based) |
| Islands | `@astrojs/preact` + `preact` | Interactive filter/search components |
| Test runner | `vitest` | Unit/integration/architecture tests |
| Architecture tests | `archunit` | Fitness tests for layer boundaries |
| Architecture lint | `dependency-cruiser` | CI boundary enforcement + visualization |
| BDD specs | `allium` (Claude plugin) | Behavioral specification language |
| Schema validation | `zod` | Domain entity + content collection validation |
| Lint | `eslint` + `no-restricted-imports` | Layer boundary lint rules |
| Pre-commit | `husky` + `lint-staged` | Pre-commit safety net |
| Markdown | Built into Astro | Content Collections with typed frontmatter |

## Constraints & Considerations

- **No backend/database:** Content is markdown in repo, state is localStorage/URL params
- **GitHub Pages:** Static output, `base` path config in Astro for project pages
- **Allium is not executable:** Specs guide LLM intent and drive test creation, but Vitest runs the actual tests
- **Manual DI over containers:** Compile-time safety critical for agent-generated code
- **Speed amplifies bad design:** CodeScene data shows unguarded AI produces 41% more defects
- **Agent failures are infra signals:** When agents struggle, add missing tools/guardrails/docs
- **Three-artifact pattern:** Every feature has `.allium` spec + `.test.ts` + `.ts` implementation

## Open Questions

1. **Allium plugin availability:** Is the JUXT Claude plugin already installed, or does it need to be added during setup?
2. **GitHub Pages base path:** Will this be a project page (`/lite-ts/`) or a user page (`/`)?
3. **Initial categories:** Are these the right starting categories, or do you have a different taxonomy in mind?
   - Context Engineering Patterns
   - Testing & Validation Patterns
   - Architectural Constraints Patterns
   - Entropy Management Patterns
4. **Pattern frontmatter fields:** Proposed schema per pattern — name, slug, category (ref), tags[], repoUrl?, samplePrompt?, skills[], tools[], difficulty? Anything to add/remove?

## Next Steps

Hand off to `/craft-plan` with this research artifact.
