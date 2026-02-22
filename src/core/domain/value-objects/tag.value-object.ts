import { z } from 'zod';

// Tags are normalized (lowercased and trimmed) before validation to allow
// case-insensitive input from content authors.
const TagSchema = z.string().min(1, 'Tag must not be empty after normalization');

export class Tag {
  private constructor(private readonly _value: string) {}

  /**
   * Creates a Tag from a string, normalizing to lowercase and trimming whitespace.
   * Throws if the normalized result is empty.
   */
  static create(rawTag: string): Tag {
    const normalized = rawTag.trim().toLowerCase();
    const result = TagSchema.safeParse(normalized);
    if (!result.success) {
      throw new Error(`Invalid tag: "${rawTag}". ${result.error.issues[0]?.message}`);
    }
    return new Tag(result.data);
  }

  toString(): string {
    return this._value;
  }

  equals(other: Tag): boolean {
    return this._value === other._value;
  }
}
