import { getCollection } from 'astro:content';

import { Category } from '@domain/entities/category.entity';
import { Pattern } from '@domain/entities/pattern.entity';
import type { CategoryRepositoryPort } from '@application/ports/category-repository.port';
import type { PatternRepositoryPort } from '@application/ports/pattern-repository.port';

/**
 * Fetches all category entries from Astro's content layer and maps them to
 * domain entities. This is shared by both repository classes to avoid
 * duplicating the getCollection call when both repos are instantiated at the
 * same composition root.
 */
async function fetchAllCategories(): Promise<readonly Category[]> {
  const rawCategories = await getCollection('categories');
  return rawCategories.map((entry) =>
    Category.create({
      name: entry.data.name,
      description: entry.data.description,
      displayOrder: entry.data.displayOrder,
    }),
  );
}

/**
 * Fetches all pattern entries from Astro's content layer and maps them to
 * domain entities. This is shared by AstroPatternRepository to keep the
 * collection-fetching logic in one place.
 */
async function fetchAllPatterns(): Promise<readonly Pattern[]> {
  const rawPatterns = await getCollection('patterns');
  return rawPatterns.map((entry) =>
    Pattern.create({
      name: entry.data.name,
      categorySlug: entry.data.categorySlug,
      description: entry.data.description,
      tags: entry.data.tags,
      repoUrl: entry.data.repoUrl,
      samplePrompt: entry.data.samplePrompt,
      skills: entry.data.skills,
      tools: entry.data.tools,
    }),
  );
}

/**
 * Implements CategoryRepositoryPort using Astro's content collection API.
 *
 * This adapter is intentionally thin: it delegates all data fetching to
 * the shared fetchAllCategories helper so that the domain-to-Astro mapping
 * lives in exactly one place.
 */
export class AstroCategoryRepository implements CategoryRepositoryPort {
  async findAll(): Promise<readonly Category[]> {
    return fetchAllCategories();
  }

  async findBySlug(slug: string): Promise<Category | undefined> {
    const categories = await fetchAllCategories();
    // Using strict equality against the slug value-object's string representation
    return categories.find((category) => category.slug.toString() === slug);
  }
}

/**
 * Implements PatternRepositoryPort using Astro's content collection API.
 *
 * Like AstroCategoryRepository, this adapter stays thin and delegates all
 * data fetching to fetchAllPatterns so the mapping logic is not duplicated.
 */
export class AstroPatternRepository implements PatternRepositoryPort {
  async findAll(): Promise<readonly Pattern[]> {
    return fetchAllPatterns();
  }

  async findBySlug(slug: string): Promise<Pattern | undefined> {
    const patterns = await fetchAllPatterns();
    return patterns.find((pattern) => pattern.slug.toString() === slug);
  }

  async findByCategorySlug(categorySlug: string): Promise<readonly Pattern[]> {
    const patterns = await fetchAllPatterns();
    return patterns.filter((pattern) => pattern.categorySlug.toString() === categorySlug);
  }
}
