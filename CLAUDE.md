# lite-ts — Agentic Harness

## Project

Static website catalog of agentic coding patterns built with **Astro + Preact + TypeScript**.

## Architecture — Hexagonal/Clean

| Layer | Path | Rule |
|---|---|---|
| Domain | `src/core/domain/` | Zero external imports — pure TypeScript + Zod only |
| Application | `src/core/application/` | Imports domain only; defines port interfaces |
| Shell | `src/shell/` | Implements ports; may use Astro framework code |
| UI | `src/pages/`, `src/layouts/`, `src/components/` | Astro pages + Preact islands; may import anything |

Path aliases: `@domain/*`, `@application/*`, `@shell/*`, `@ui/*`, `@content/*`

## Naming Conventions

| Artifact | Suffix |
|---|---|
| Entity | `*.entity.ts` |
| Value object | `*.value-object.ts` |
| Domain/application service | `*.service.ts` |
| Use case | `*.use-case.ts` |
| Port (interface) | `*.port.ts` |
| Adapter (implementation) | `*.adapter.ts` |

## Testing — Three-Artifact Pattern

1. Write the `.allium` spec (plain-language behaviour)
2. Write the `.test.ts` file — **RED** (must fail first)
3. Implement the `.ts` file — **GREEN**, then **REFACTOR**

Tests live in `tests/` and match `**/*.test.ts`. Architecture fitness tests run via `npm run test:arch`. Use manual mocks only for repository ports — no mocking frameworks.

## Verification Protocol

Before claiming work is complete, run:

```sh
npm run typecheck && npm run lint && npm run test && npm run test:arch && npm run build
```

All commands must exit `0`.

## Commit Conventions

`feat:`, `fix:`, `test:`, `docs:`, `chore:` — conventional commits only.

## Detailed Rules

- `.claude/rules/architecture.md` — layer dependency rules
- `.claude/rules/testing.md` — TDD and test boundary rules
- `.claude/rules/security.md` — security requirements
