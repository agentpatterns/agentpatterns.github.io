import { z } from 'zod';
import { Slug } from '../value-objects/slug.value-object';
import { Tag } from '../value-objects/tag.value-object';
import { RepoUrl } from '../value-objects/repo-url.value-object';
import { PromptSnippet } from '../value-objects/prompt-snippet.value-object';
import { SkillReference } from '../value-objects/skill-reference.value-object';
import { ToolReference } from '../value-objects/tool-reference.value-object';

// Input schema validates structural requirements before constructing value objects.
// Optional fields are left as raw primitives here; value object construction
// happens inside the factory so errors surface with meaningful messages.
const PatternPropsSchema = z.object({
  name: z.string().min(1, 'Pattern name must not be empty'),
  categorySlug: z.string().min(1, 'Pattern categorySlug must not be empty'),
  description: z.string().min(1, 'Pattern description must not be empty'),
  tags: z.array(z.string()).min(1, 'Pattern must have at least one tag'),
  repoUrl: z.string().optional(),
  samplePrompt: z.string().optional(),
  skills: z
    .array(z.object({ skillName: z.string(), installCommand: z.string() }))
    .optional(),
  tools: z
    .array(z.object({ toolName: z.string(), toolUrl: z.string() }))
    .optional(),
});

type PatternProps = z.infer<typeof PatternPropsSchema>;

export class Pattern {
  readonly name: string;
  readonly slug: Slug;
  readonly categorySlug: Slug;
  readonly description: string;
  readonly tags: readonly Tag[];
  readonly repoUrl: RepoUrl | undefined;
  readonly samplePrompt: PromptSnippet | undefined;
  readonly skills: readonly SkillReference[] | undefined;
  readonly tools: readonly ToolReference[] | undefined;

  private constructor(
    name: string,
    slug: Slug,
    categorySlug: Slug,
    description: string,
    tags: readonly Tag[],
    repoUrl: RepoUrl | undefined,
    samplePrompt: PromptSnippet | undefined,
    skills: readonly SkillReference[] | undefined,
    tools: readonly ToolReference[] | undefined,
  ) {
    this.name = name;
    this.slug = slug;
    this.categorySlug = categorySlug;
    this.description = description;
    this.tags = tags;
    this.repoUrl = repoUrl;
    this.samplePrompt = samplePrompt;
    this.skills = skills;
    this.tools = tools;
  }

  /**
   * Factory method that validates raw input and constructs a Pattern with all
   * derived value objects. The slug is derived from the name; categorySlug is
   * treated as already-slugified (authored in content) and validated as-is.
   */
  static create(props: PatternProps): Pattern {
    const result = PatternPropsSchema.safeParse(props);
    if (!result.success) {
      throw new Error(
        `Invalid pattern props: ${result.error.issues[0]?.message}`,
      );
    }

    const {
      name,
      categorySlug,
      description,
      tags,
      repoUrl,
      samplePrompt,
      skills,
      tools,
    } = result.data;

    const nameSlug = Slug.fromName(name);
    const categorySlugObject = Slug.create(categorySlug);
    const tagObjects = tags.map((rawTag) => Tag.create(rawTag));

    const repoUrlObject =
      repoUrl !== undefined ? RepoUrl.create(repoUrl) : undefined;

    const samplePromptObject =
      samplePrompt !== undefined ? PromptSnippet.create(samplePrompt) : undefined;

    const skillObjects =
      skills !== undefined
        ? skills.map((skillInput) => SkillReference.create(skillInput))
        : undefined;

    const toolObjects =
      tools !== undefined
        ? tools.map((toolInput) => ToolReference.create(toolInput))
        : undefined;

    return new Pattern(
      name,
      nameSlug,
      categorySlugObject,
      description,
      tagObjects,
      repoUrlObject,
      samplePromptObject,
      skillObjects,
      toolObjects,
    );
  }
}
