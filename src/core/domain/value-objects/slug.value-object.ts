import { z } from 'zod';

// Validates that a slug contains only lowercase letters, digits, and hyphens,
// and does not start or end with a hyphen.
const SlugSchema = z
  .string()
  .min(1, 'Slug must not be empty')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens');

export class Slug {
  private constructor(private readonly _value: string) {}

  /**
   * Creates a Slug from an already-slugified string.
   * Throws if the input is not a valid slug format.
   */
  static create(slug: string): Slug {
    const result = SlugSchema.safeParse(slug);
    if (!result.success) {
      throw new Error(`Invalid slug: "${slug}". ${result.error.issues[0]?.message}`);
    }
    return new Slug(result.data);
  }

  /**
   * Derives a slug from a human-readable name by lowercasing, replacing
   * non-alphanumeric sequences with hyphens, and stripping leading/trailing hyphens.
   */
  static fromName(name: string): Slug {
    const slugified = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return Slug.create(slugified);
  }

  toString(): string {
    return this._value;
  }

  equals(other: Slug): boolean {
    return this._value === other._value;
  }
}
