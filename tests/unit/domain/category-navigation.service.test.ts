import { CategoryNavigationService } from '@domain/services/category-navigation.service';
import { Category } from '@domain/entities/category.entity';
import { Pattern } from '@domain/entities/pattern.entity';

function createTestCategory(overrides: {
  name?: string;
  displayOrder?: number;
} = {}): Category {
  return Category.create({
    name: overrides.name ?? 'Test Category',
    description: 'A test category',
    displayOrder: overrides.displayOrder ?? 1,
  });
}

function createTestPattern(categorySlug: string): Pattern {
  return Pattern.create({
    name: 'Test Pattern',
    categorySlug,
    description: 'A test pattern',
    tags: ['test'],
  });
}

describe('CategoryNavigationService', () => {
  const service = new CategoryNavigationService();

  describe('listCategoriesOrdered', () => {
    it('returns categories sorted by displayOrder', () => {
      const categories = [
        createTestCategory({ name: 'Third', displayOrder: 3 }),
        createTestCategory({ name: 'First', displayOrder: 1 }),
        createTestCategory({ name: 'Second', displayOrder: 2 }),
      ];
      const result = service.listCategoriesOrdered(categories);
      expect(result[0].name).toBe('First');
      expect(result[1].name).toBe('Second');
      expect(result[2].name).toBe('Third');
    });
  });

  describe('countPatternsPerCategory', () => {
    it('counts patterns for each category', () => {
      const categories = [
        createTestCategory({ name: 'Testing' }),
        createTestCategory({ name: 'Architecture', displayOrder: 2 }),
      ];
      const patterns = [
        createTestPattern('testing'),
        createTestPattern('testing'),
        createTestPattern('architecture'),
      ];
      const result = service.countPatternsPerCategory(categories, patterns);
      expect(result.get('testing')).toBe(2);
      expect(result.get('architecture')).toBe(1);
    });

    it('returns zero for categories with no patterns', () => {
      const categories = [createTestCategory({ name: 'Empty' })];
      const patterns: Pattern[] = [];
      const result = service.countPatternsPerCategory(categories, patterns);
      expect(result.get('empty')).toBe(0);
    });
  });
});
