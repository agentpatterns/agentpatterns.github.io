# Architecture — Layer Dependency Rules

This project uses a Hexagonal/Clean Architecture. Each layer has strict import boundaries enforced by `npm run test:arch`.

---

## Layer Definitions and Import Rules

### Domain Layer — `src/core/domain/**`

**Purpose:** Pure business logic and data models. No framework, no infrastructure.

**Allowed imports:**
- Pure TypeScript stdlib
- `zod` for schema validation

**Prohibited imports:**
- `src/core/application/**`
- `src/shell/**`
- `src/pages/**`, `src/layouts/**`, `src/components/**`
- `astro`, `preact`, or any other framework package
- Any Node.js built-in that couples to infrastructure (e.g. `fs`, `path`, `http`)

**Artifacts:** `*.entity.ts`, `*.value-object.ts`, `*.service.ts`

---

### Application Layer — `src/core/application/**`

**Purpose:** Orchestrates domain objects, defines port contracts (interfaces), and implements use cases.

**Allowed imports:**
- `src/core/domain/**` (via `@domain/*`)
- Pure TypeScript stdlib

**Prohibited imports:**
- `src/shell/**`
- `src/pages/**`, `src/layouts/**`, `src/components/**`
- `astro`, `preact`, or any framework package
- Any concrete adapter or infrastructure implementation

**Artifacts:** `*.use-case.ts`, `*.port.ts`, `*.service.ts`

**Note:** Ports are *interfaces only*. No concrete classes live here.

---

### Shell Layer — `src/shell/**`

**Purpose:** Infrastructure adapters. Implements ports defined in the application layer. Wires the application together.

**Allowed imports:**
- `src/core/domain/**` (via `@domain/*`)
- `src/core/application/**` (via `@application/*`)
- Framework packages: `astro`, Node.js built-ins, third-party SDKs

**Prohibited imports:**
- `src/pages/**`, `src/layouts/**`, `src/components/**`

**Artifacts:** `*.adapter.ts`

---

### UI Layer — `src/pages/**`, `src/layouts/**`, `src/components/**`

**Purpose:** Astro pages and Preact islands. Presentation only.

**Allowed imports:**
- Any layer (`@domain/*`, `@application/*`, `@shell/*`)
- `astro`, `preact`, and any UI library
- `@content/*` for content collections

**Note:** UI components should not contain business logic. Delegate to use cases or services in the application layer.

---

## Path Aliases

Defined in `tsconfig.json` and enforced by the architecture tests:

| Alias | Resolves to |
|---|---|
| `@domain/*` | `src/core/domain/*` |
| `@application/*` | `src/core/application/*` |
| `@shell/*` | `src/shell/*` |
| `@ui/*` | `src/components/*` |
| `@content/*` | `src/content/*` |

Always use path aliases rather than relative `../` imports that cross layer boundaries.

---

## Enforcement

Architecture fitness tests are located in `tests/arch/` and run with:

```sh
npm run test:arch
```

A failing architecture test means a layer boundary has been violated. Fix the import before merging.
