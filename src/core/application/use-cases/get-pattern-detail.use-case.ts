import type { Pattern } from '@domain/entities/pattern.entity';
import type { PatternRepositoryPort } from '@application/ports/pattern-repository.port';

export class GetPatternDetailUseCase {
  constructor(private readonly patternRepository: PatternRepositoryPort) {}

  /**
   * Retrieves a single pattern by its slug. Returns undefined when the slug
   * does not match any known pattern so callers can render a 404 state.
   */
  async execute(slug: string): Promise<Pattern | undefined> {
    return this.patternRepository.findBySlug(slug);
  }
}
