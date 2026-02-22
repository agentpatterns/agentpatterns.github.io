import { z } from 'zod';

// Prompt snippets are free-form text intended for use in AI prompt construction.
// The only structural requirement is that they are non-empty.
const PromptSnippetSchema = z.string().min(1, 'PromptSnippet must not be empty');

export class PromptSnippet {
  private constructor(private readonly _value: string) {}

  /**
   * Creates a PromptSnippet from a non-empty string.
   * Throws if the input is empty.
   */
  static create(snippet: string): PromptSnippet {
    const result = PromptSnippetSchema.safeParse(snippet);
    if (!result.success) {
      throw new Error(
        `Invalid prompt snippet: "${snippet}". ${result.error.issues[0]?.message}`,
      );
    }
    return new PromptSnippet(result.data);
  }

  toString(): string {
    return this._value;
  }
}
