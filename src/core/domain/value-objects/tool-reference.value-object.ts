import { z } from 'zod';

const ToolReferenceSchema = z.object({
  toolName: z.string().min(1, 'toolName must not be empty'),
  toolUrl: z.string().url('toolUrl must be a valid URL'),
});

type ToolReferenceInput = z.infer<typeof ToolReferenceSchema>;

export class ToolReference {
  readonly toolName: string;
  readonly toolUrl: string;

  private constructor(toolName: string, toolUrl: string) {
    this.toolName = toolName;
    this.toolUrl = toolUrl;
  }

  /**
   * Creates a ToolReference with a validated tool name and URL.
   * Throws if the name is empty or the URL is not a valid URL string.
   */
  static create(input: ToolReferenceInput): ToolReference {
    const result = ToolReferenceSchema.safeParse(input);
    if (!result.success) {
      throw new Error(
        `Invalid tool reference: ${result.error.issues[0]?.message}`,
      );
    }
    return new ToolReference(result.data.toolName, result.data.toolUrl);
  }
}
