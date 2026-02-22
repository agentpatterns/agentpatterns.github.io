import type { Category } from '@domain/entities/category.entity';
import { CategoryNavigationService } from '@domain/services/category-navigation.service';
import type { CategoryRepositoryPort } from '@application/ports/category-repository.port';
import type { PatternRepositoryPort } from '@application/ports/pattern-repository.port';

export interface CategoryWithPatternCount {
  category: Category;
  patternCount: number;
}

export class ListCategoriesUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepositoryPort,
    private readonly patternRepository: PatternRepositoryPort,
    private readonly categoryNavigationService: CategoryNavigationService,
  ) {}

  /**
   * Fetches all categories and patterns, orders categories by displayOrder,
   * and annotates each with its pattern count. Categories with no patterns
   * are included with a count of zero to support empty-state rendering.
   */
  async execute(): Promise<CategoryWithPatternCount[]> {
    const [categories, patterns] = await Promise.all([
      this.categoryRepository.findAll(),
      this.patternRepository.findAll(),
    ]);

    const orderedCategories = this.categoryNavigationService.listCategoriesOrdered(categories);
    const countMap = this.categoryNavigationService.countPatternsPerCategory(categories, patterns);

    return orderedCategories.map((category) => ({
      category,
      patternCount: countMap.get(category.slug.toString()) ?? 0,
    }));
  }
}
