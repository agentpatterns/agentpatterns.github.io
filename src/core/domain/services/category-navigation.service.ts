import type { Category } from '../entities/category.entity';
import type { Pattern } from '../entities/pattern.entity';

export class CategoryNavigationService {
  /**
   * Returns a new array of categories sorted by displayOrder ascending.
   * Does not mutate the input array; creates a sorted copy so callers
   * can rely on referential stability of the original collection.
   */
  listCategoriesOrdered(categories: readonly Category[]): Category[] {
    return [...categories].sort((categoryA, categoryB) =>
      categoryA.displayOrder.compareTo(categoryB.displayOrder),
    );
  }

  /**
   * Builds a map from category slug string to the count of patterns belonging
   * to that category. Categories with no matching patterns are included with
   * a count of zero so callers can render empty states without special-casing.
   */
  countPatternsPerCategory(
    categories: readonly Category[],
    patterns: readonly Pattern[],
  ): Map<string, number> {
    const countMap = new Map<string, number>();

    // Initialise every category with zero so missing-pattern categories are represented.
    for (const category of categories) {
      countMap.set(category.slug.toString(), 0);
    }

    for (const pattern of patterns) {
      const slugKey = pattern.categorySlug.toString();
      const existingCount = countMap.get(slugKey) ?? 0;
      countMap.set(slugKey, existingCount + 1);
    }

    return countMap;
  }
}
