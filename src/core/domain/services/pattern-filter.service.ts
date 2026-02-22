import type { Pattern } from '../entities/pattern.entity';

export class PatternFilterService {
  /**
   * Returns all patterns whose tags include an exact case-insensitive match
   * for the given tag string. Tags are stored normalized to lowercase by the
   * Tag value object, so we only need to lowercase the input for comparison.
   */
  filterByTag(patterns: readonly Pattern[], tag: string): Pattern[] {
    const normalizedTag = tag.toLowerCase();
    return patterns.filter((pattern) =>
      pattern.tags.some((patternTag) => patternTag.toString() === normalizedTag),
    );
  }

  /**
   * Returns all patterns where the name or description contains the query string,
   * using a case-insensitive substring match. Useful for free-text discovery
   * without requiring exact tag knowledge.
   */
  search(patterns: readonly Pattern[], query: string): Pattern[] {
    const normalizedQuery = query.toLowerCase();
    return patterns.filter((pattern) => {
      const nameMatches = pattern.name.toLowerCase().includes(normalizedQuery);
      const descriptionMatches = pattern.description
        .toLowerCase()
        .includes(normalizedQuery);
      return nameMatches || descriptionMatches;
    });
  }
}
