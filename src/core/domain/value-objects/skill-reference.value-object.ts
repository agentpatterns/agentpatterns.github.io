import { z } from 'zod';

const SkillReferenceSchema = z.object({
  skillName: z.string().min(1, 'skillName must not be empty'),
  installCommand: z.string().min(1, 'installCommand must not be empty'),
});

type SkillReferenceInput = z.infer<typeof SkillReferenceSchema>;

export class SkillReference {
  readonly skillName: string;
  readonly installCommand: string;

  private constructor(skillName: string, installCommand: string) {
    this.skillName = skillName;
    this.installCommand = installCommand;
  }

  /**
   * Creates a SkillReference with a validated skill name and install command.
   * Throws if either field is empty.
   */
  static create(input: SkillReferenceInput): SkillReference {
    const result = SkillReferenceSchema.safeParse(input);
    if (!result.success) {
      throw new Error(
        `Invalid skill reference: ${result.error.issues[0]?.message}`,
      );
    }
    return new SkillReference(result.data.skillName, result.data.installCommand);
  }
}
