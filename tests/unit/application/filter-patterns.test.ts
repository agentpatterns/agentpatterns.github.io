import { Pattern } from '@domain/entities/pattern.entity';
import { PatternFilterService } from '@domain/services/pattern-filter.service';
import type { PatternRepositoryPort } from '@application/ports/pattern-repository.port';
import { FilterPatternsUseCase } from '@application/use-cases/filter-patterns.use-case';

class InMemoryPatternRepository implements PatternRepositoryPort {
  constructor(private readonly patterns: Pattern[]) {}

  async findAll(): Promise<readonly Pattern[]> {
    return this.patterns;
  }

  async findBySlug(slug: string): Promise<Pattern | undefined> {
    return this.patterns.find((pattern) => pattern.slug.toString() === slug);
  }

  async findByCategorySlug(categorySlug: string): Promise<readonly Pattern[]> {
    return this.patterns.filter((pattern) => pattern.categorySlug.toString() === categorySlug);
  }
}

function createTestPattern(overrides: {
  name?: string;
  description?: string;
  categorySlug?: string;
  tags?: string[];
} = {}): Pattern {
  return Pattern.create({
    name: overrides.name ?? 'Test Pattern',
    categorySlug: overrides.categorySlug ?? 'test-category',
    description: overrides.description ?? 'A test pattern',
    tags: overrides.tags ?? ['test'],
  });
}

describe('FilterPatternsUseCase', () => {
  describe('when no options are provided', () => {
    it('returns all patterns', async () => {
      const patterns = [
        createTestPattern({ name: 'Pattern One' }),
        createTestPattern({ name: 'Pattern Two' }),
      ];

      const useCase = new FilterPatternsUseCase(
        new InMemoryPatternRepository(patterns),
        new PatternFilterService(),
      );

      const result = await useCase.execute();

      expect(result).toHaveLength(2);
    });

    it('returns all patterns when options object has no filters set', async () => {
      const patterns = [
        createTestPattern({ name: 'Pattern One' }),
        createTestPattern({ name: 'Pattern Two' }),
      ];

      const useCase = new FilterPatternsUseCase(
        new InMemoryPatternRepository(patterns),
        new PatternFilterService(),
      );

      const result = await useCase.execute({});

      expect(result).toHaveLength(2);
    });
  });

  describe('when filtering by tag', () => {
    it('delegates to PatternFilterService and returns only matching patterns', async () => {
      const patterns = [
        createTestPattern({ name: 'TDD Pattern', tags: ['tdd', 'testing'] }),
        createTestPattern({ name: 'BDD Pattern', tags: ['bdd', 'testing'] }),
        createTestPattern({ name: 'CI Pattern', tags: ['ci'] }),
      ];

      const useCase = new FilterPatternsUseCase(
        new InMemoryPatternRepository(patterns),
        new PatternFilterService(),
      );

      const result = await useCase.execute({ tag: 'tdd' });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('TDD Pattern');
    });

    it('returns empty array when no patterns match the tag', async () => {
      const patterns = [createTestPattern({ tags: ['tdd'] })];

      const useCase = new FilterPatternsUseCase(
        new InMemoryPatternRepository(patterns),
        new PatternFilterService(),
      );

      const result = await useCase.execute({ tag: 'nonexistent' });

      expect(result).toHaveLength(0);
    });
  });

  describe('when searching by query', () => {
    it('delegates to PatternFilterService and returns patterns matching the query', async () => {
      const patterns = [
        createTestPattern({ name: 'TDD Guardrails', description: 'Enforce test-driven development' }),
        createTestPattern({ name: 'Architecture Fitness', description: 'Verify structural constraints' }),
      ];

      const useCase = new FilterPatternsUseCase(
        new InMemoryPatternRepository(patterns),
        new PatternFilterService(),
      );

      const result = await useCase.execute({ query: 'tdd' });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('TDD Guardrails');
    });

    it('matches query against description', async () => {
      const patterns = [
        createTestPattern({ name: 'Pattern One', description: 'Uses test-driven development' }),
        createTestPattern({ name: 'Pattern Two', description: 'Uses behaviour-driven development' }),
      ];

      const useCase = new FilterPatternsUseCase(
        new InMemoryPatternRepository(patterns),
        new PatternFilterService(),
      );

      const result = await useCase.execute({ query: 'test-driven' });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Pattern One');
    });
  });

  describe('when both tag and query are provided', () => {
    it('applies tag filter first then narrows by query', async () => {
      const patterns = [
        createTestPattern({ name: 'TDD Guardrails', tags: ['tdd'], description: 'Enforce guardrails' }),
        createTestPattern({ name: 'TDD Basics', tags: ['tdd'], description: 'Introduction to TDD' }),
        createTestPattern({ name: 'BDD Guardrails', tags: ['bdd'], description: 'Enforce guardrails' }),
      ];

      const useCase = new FilterPatternsUseCase(
        new InMemoryPatternRepository(patterns),
        new PatternFilterService(),
      );

      // Tag filter narrows to tdd patterns; query then matches only the one with 'guardrails'
      const result = await useCase.execute({ tag: 'tdd', query: 'guardrails' });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('TDD Guardrails');
    });
  });
});
