import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Category collection: top-level groupings for patterns (e.g. "Context Engineering")
const categories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/categories' }),
  schema: z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    displayOrder: z.number().int().positive(),
  }),
});

// Pattern collection: individual reusable AI coding patterns within a category
const patterns = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/patterns' }),
  schema: z.object({
    name: z.string().min(1),
    categorySlug: z.string().min(1),
    description: z.string().min(1),
    tags: z.array(z.string().min(1)).min(1),
    repoUrl: z.string().url().optional(),
    samplePrompt: z.string().optional(),
    skills: z
      .array(
        z.object({
          skillName: z.string().min(1),
          installCommand: z.string().min(1),
        })
      )
      .optional(),
    tools: z
      .array(
        z.object({
          toolName: z.string().min(1),
          toolUrl: z.string().url(),
        })
      )
      .optional(),
  }),
});

export const collections = { categories, patterns };
