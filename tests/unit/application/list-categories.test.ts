import { Category } from '@domain/entities/category.entity';
import { Pattern } from '@domain/entities/pattern.entity';
import { CategoryNavigationService } from '@domain/services/category-navigation.service';
import type { CategoryRepositoryPort } from '@application/ports/category-repository.port';
import type { PatternRepositoryPort } from '@application/ports/pattern-repository.port';
import { ListCategoriesUseCase } from '@application/use-cases/list-categories.use-case';

class InMemoryCategoryRepository implements CategoryRepositoryPort {
  constructor(private readonly categories: Category[]) {}

  async findAll(): Promise<readonly Category[]> {
    return this.categories;
  }

  async findBySlug(slug: string): Promise<Category | undefined> {
    return this.categories.find((category) => category.slug.toString() === slug);
  }
}

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

function createTestCategory(overrides: {
  name?: string;
  description?: string;
  displayOrder?: number;
} = {}): Category {
  return Category.create({
    name: overrides.name ?? 'Test Category',
    description: overrides.description ?? 'A test category',
    displayOrder: overrides.displayOrder ?? 1,
  });
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

describe('ListCategoriesUseCase', () => {
  it('returns categories ordered by displayOrder with pattern counts', async () => {
    const categories = [
      createTestCategory({ name: 'Context Engineering', displayOrder: 2 }),
      createTestCategory({ name: 'Testing Patterns', displayOrder: 1 }),
    ];
    const patterns = [
      createTestPattern({ categorySlug: 'context-engineering' }),
      createTestPattern({ categorySlug: 'context-engineering' }),
      createTestPattern({ categorySlug: 'testing-patterns' }),
    ];

    const useCase = new ListCategoriesUseCase(
      new InMemoryCategoryRepository(categories),
      new InMemoryPatternRepository(patterns),
      new CategoryNavigationService(),
    );

    const result = await useCase.execute();

    // Ordered by displayOrder ascending: Testing Patterns (1) then Context Engineering (2)
    expect(result).toHaveLength(2);
    expect(result[0].category.name).toBe('Testing Patterns');
    expect(result[0].patternCount).toBe(1);
    expect(result[1].category.name).toBe('Context Engineering');
    expect(result[1].patternCount).toBe(2);
  });

  it('returns zero pattern count for categories with no patterns', async () => {
    const categories = [createTestCategory({ name: 'Empty Category', displayOrder: 1 })];
    const patterns: Pattern[] = [];

    const useCase = new ListCategoriesUseCase(
      new InMemoryCategoryRepository(categories),
      new InMemoryPatternRepository(patterns),
      new CategoryNavigationService(),
    );

    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0].category.name).toBe('Empty Category');
    expect(result[0].patternCount).toBe(0);
  });

  it('returns empty array when there are no categories', async () => {
    const useCase = new ListCategoriesUseCase(
      new InMemoryCategoryRepository([]),
      new InMemoryPatternRepository([]),
      new CategoryNavigationService(),
    );

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });
});
