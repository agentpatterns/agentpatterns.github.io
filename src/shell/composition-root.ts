import { AstroCategoryRepository, AstroPatternRepository } from './adapters/astro-content.adapter';
import { FilterPatternsUseCase } from '@application/use-cases/filter-patterns.use-case';
import { GetCategoryWithPatternsUseCase } from '@application/use-cases/get-category-with-patterns.use-case';
import { GetPatternDetailUseCase } from '@application/use-cases/get-pattern-detail.use-case';
import { ListCategoriesUseCase } from '@application/use-cases/list-categories.use-case';
import { CategoryNavigationService } from '@domain/services/category-navigation.service';
import { PatternFilterService } from '@domain/services/pattern-filter.service';

/**
 * Creates a fully-wired ListCategoriesUseCase.
 *
 * ListCategoriesUseCase only needs access to categories, so it receives the
 * category repository and the navigation service that sorts/filters them.
 */
export function createListCategoriesUseCase(): ListCategoriesUseCase {
  const categoryRepository = new AstroCategoryRepository();
  const patternRepository = new AstroPatternRepository();
  const categoryNavigationService = new CategoryNavigationService();
  return new ListCategoriesUseCase(categoryRepository, patternRepository, categoryNavigationService);
}

/**
 * Creates a fully-wired FilterPatternsUseCase.
 *
 * FilterPatternsUseCase applies tag and text filtering across patterns, so
 * it receives the pattern repository and the domain filter service that
 * encapsulates the matching rules.
 */
export function createFilterPatternsUseCase(): FilterPatternsUseCase {
  const patternRepository = new AstroPatternRepository();
  const patternFilterService = new PatternFilterService();
  return new FilterPatternsUseCase(patternRepository, patternFilterService);
}

/**
 * Creates a fully-wired GetPatternDetailUseCase.
 *
 * This use-case looks up a single pattern by slug, so it only requires the
 * pattern repository.
 */
export function createGetPatternDetailUseCase(): GetPatternDetailUseCase {
  const patternRepository = new AstroPatternRepository();
  return new GetPatternDetailUseCase(patternRepository);
}

/**
 * Creates a fully-wired GetCategoryWithPatternsUseCase.
 *
 * This use-case assembles a category together with all of its associated
 * patterns, so it requires both repositories. The navigation service is also
 * wired in to support display-order sorting of any nested category data.
 */
export function createGetCategoryWithPatternsUseCase(): GetCategoryWithPatternsUseCase {
  const categoryRepository = new AstroCategoryRepository();
  const patternRepository = new AstroPatternRepository();
  return new GetCategoryWithPatternsUseCase(categoryRepository, patternRepository);
}
