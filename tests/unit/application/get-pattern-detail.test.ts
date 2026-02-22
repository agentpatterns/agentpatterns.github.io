import { Pattern } from '@domain/entities/pattern.entity';
import type { PatternRepositoryPort } from '@application/ports/pattern-repository.port';
import { GetPatternDetailUseCase } from '@application/use-cases/get-pattern-detail.use-case';

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
  categorySlug?: string;
  tags?: string[];
} = {}): Pattern {
  return Pattern.create({
    name: overrides.name ?? 'Test Pattern',
    categorySlug: overrides.categorySlug ?? 'test-category',
    description: 'A test pattern',
    tags: overrides.tags ?? ['test'],
  });
}

describe('GetPatternDetailUseCase', () => {
  it('returns the pattern when the slug matches', async () => {
    const pattern = createTestPattern({ name: 'TDD Guardrails' });
    const useCase = new GetPatternDetailUseCase(new InMemoryPatternRepository([pattern]));

    // Pattern.create derives the slug from the name: 'TDD Guardrails' -> 'tdd-guardrails'
    const result = await useCase.execute('tdd-guardrails');

    expect(result).toBeDefined();
    expect(result?.name).toBe('TDD Guardrails');
  });

  it('returns undefined when the slug does not match any pattern', async () => {
    const pattern = createTestPattern({ name: 'TDD Guardrails' });
    const useCase = new GetPatternDetailUseCase(new InMemoryPatternRepository([pattern]));

    const result = await useCase.execute('unknown-slug');

    expect(result).toBeUndefined();
  });

  it('returns undefined when the repository is empty', async () => {
    const useCase = new GetPatternDetailUseCase(new InMemoryPatternRepository([]));

    const result = await useCase.execute('any-slug');

    expect(result).toBeUndefined();
  });

  it('returns the correct pattern when multiple patterns exist', async () => {
    const patterns = [
      createTestPattern({ name: 'TDD Guardrails' }),
      createTestPattern({ name: 'Architecture Fitness' }),
      createTestPattern({ name: 'Context Engineering' }),
    ];
    const useCase = new GetPatternDetailUseCase(new InMemoryPatternRepository(patterns));

    const result = await useCase.execute('architecture-fitness');

    expect(result).toBeDefined();
    expect(result?.name).toBe('Architecture Fitness');
  });
});
