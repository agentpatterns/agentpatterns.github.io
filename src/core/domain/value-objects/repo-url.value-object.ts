import { z } from 'zod';

// Validates that the value is a well-formed URL string. Zod's url() validator
// uses the WHATWG URL standard, which covers http and https schemes used by repos.
const RepoUrlSchema = z.string().url('RepoUrl must be a valid URL');

export class RepoUrl {
  private constructor(private readonly _value: string) {}

  /**
   * Creates a RepoUrl from a URL string.
   * Throws if the input is not a valid URL.
   */
  static create(url: string): RepoUrl {
    const result = RepoUrlSchema.safeParse(url);
    if (!result.success) {
      throw new Error(`Invalid repo URL: "${url}". ${result.error.issues[0]?.message}`);
    }
    return new RepoUrl(result.data);
  }

  toString(): string {
    return this._value;
  }
}
