import type { Category } from '@domain/entities/category.entity';
import type { Pattern } from '@domain/entities/pattern.entity';
import type { CategoryRepositoryPort } from '@application/ports/category-repository.port';
import type { PatternRepositoryPort } from '@application/ports/pattern-repository.port';

export interface CategoryWithPatterns {
  category: Category;
  patterns: readonly Pattern[];
}

export class GetCategoryWithPatternsUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepositoryPort,
    private readonly patternRepository: PatternRepositoryPort,
  ) {}

  /**
   * Fetches a category by slug and loads all patterns belonging to it.
   * Returns undefined when the category slug is not found so callers can
   * render a 404 state without needing to catch exceptions.
   */
  async execute(slug: string): Promise<CategoryWithPatterns | undefined> {
    const category = await this.categoryRepository.findBySlug(slug);

    if (category === undefined) {
      return undefined;
    }

    const patterns = await this.patternRepository.findByCategorySlug(slug);

    return { category, patterns };
  }
}
