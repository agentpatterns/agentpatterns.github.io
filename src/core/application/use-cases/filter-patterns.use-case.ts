import type { Pattern } from '@domain/entities/pattern.entity';
import { PatternFilterService } from '@domain/services/pattern-filter.service';
import type { PatternRepositoryPort } from '@application/ports/pattern-repository.port';

export interface FilterPatternsOptions {
  tag?: string;
  query?: string;
}

export class FilterPatternsUseCase {
  constructor(
    private readonly patternRepository: PatternRepositoryPort,
    private readonly patternFilterService: PatternFilterService,
  ) {}

  /**
   * Retrieves all patterns and applies optional tag and/or query filters via
   * the domain PatternFilterService. When both filters are provided, tag
   * filtering is applied first so the search operates on the narrowed set.
   * Returns all patterns unfiltered when no options are supplied.
   */
  async execute(options?: FilterPatternsOptions): Promise<readonly Pattern[]> {
    const allPatterns = await this.patternRepository.findAll();

    if (options === undefined || (options.tag === undefined && options.query === undefined)) {
      return allPatterns;
    }

    let filteredPatterns: readonly Pattern[] = allPatterns;

    if (options.tag !== undefined) {
      filteredPatterns = this.patternFilterService.filterByTag(filteredPatterns, options.tag);
    }

    if (options.query !== undefined) {
      filteredPatterns = this.patternFilterService.search(filteredPatterns, options.query);
    }

    return filteredPatterns;
  }
}
