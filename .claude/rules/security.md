# Security Rules

This is a **static-only site**. There is no server-side runtime, no database, and no authenticated user sessions. The attack surface is intentionally minimal. These rules preserve that property.

---

## No Secrets or Credentials in Code

You MUST NOT hardcode secrets, tokens, API keys, or credentials anywhere in the codebase.

- Do not commit `.env` files.
- Do not inline tokens in `astro.config.mjs`, `tsconfig.json`, or any source file.
- If a build step requires an external secret (e.g. a CMS API key), access it via `import.meta.env.MY_KEY` and document the variable name in `.env.example` with a placeholder value only.

```typescript
// WRONG — never do this
const apiKey = "sk-abc123";

// RIGHT — read from environment at build time
const apiKey = import.meta.env.MY_API_KEY;
if (!apiKey) {
  throw new Error("MY_API_KEY is required at build time");
}
```

---

## No User-Generated Content

This is a static site. There are no forms, no user accounts, and no runtime input paths.

- Do not add server endpoints (`src/pages/api/**`) that accept POST, PUT, PATCH, or DELETE requests.
- Do not introduce a CMS or backend that accepts arbitrary user content without explicit approval and a separate security review.

---

## Safe Rendering in Preact Islands

Preact islands MUST render text content using JSX text nodes only.

The Preact prop that injects a raw HTML string directly into the DOM (`dangerouslySetInnerHTML`) is **prohibited** in all components. Using it bypasses React/Preact's XSS protections and is never acceptable in this codebase.

```tsx
// WRONG — injects raw HTML, bypasses XSS protections
<div dangerouslySetInnerHTML={{ __html: pattern.description }} />

// RIGHT — render as a plain text node
<p>{pattern.description}</p>
```

If rich Markdown rendering is required, use a library that produces a sanitised virtual DOM tree (e.g. `remark` + `rehype-sanitize`). Never pipe raw HTML directly into the DOM.

---

## Validate All Content Frontmatter with Zod

All content collections MUST define a Zod schema in `src/content/config.ts` (or equivalent). Astro validates frontmatter at build time against these schemas.

- Every field in a frontmatter schema must have an explicit type.
- Optional fields must be marked `.optional()` — do not use broad `z.any()` or `z.unknown()` types.
- Schemas live in the domain layer (`src/core/domain/`) and are reused in the content config.

```typescript
// src/core/domain/pattern.entity.ts
import { z } from "zod";

export const PatternFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  tags: z.array(z.string()).default([]),
  publishedAt: z.coerce.date(),
});

export type PatternFrontmatter = z.infer<typeof PatternFrontmatterSchema>;
```

---

## No Server-Side Endpoints

This site is built with `output: "static"` in `astro.config.mjs`. You MUST NOT change this to `"server"` or `"hybrid"` without explicit approval and a full security review of any introduced endpoints.

If dynamic behaviour is needed, implement it:
1. At build time via Astro's static generation, or
2. Client-side in a Preact island with no server round-trip.

---

## Dependency Security

- Prefer well-maintained packages with active security support.
- Introduce the minimum number of dependencies necessary.
- Run `npm audit` before committing new dependencies. Address any high or critical findings before merging.
- Do not install packages with broad filesystem, network, or process execution access unless there is a clear, justified need.
