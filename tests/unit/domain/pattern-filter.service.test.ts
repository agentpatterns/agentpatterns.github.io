import { PatternFilterService } from '@domain/services/pattern-filter.service';
import { Pattern } from '@domain/entities/pattern.entity';

function createTestPattern(overrides: {
  name?: string;
  description?: string;
  tags?: string[];
  categorySlug?: string;
} = {}): Pattern {
  return Pattern.create({
    name: overrides.name ?? 'Test Pattern',
    categorySlug: overrides.categorySlug ?? 'test-category',
    description: overrides.description ?? 'A test pattern',
    tags: overrides.tags ?? ['test'],
  });
}

describe('PatternFilterService', () => {
  const service = new PatternFilterService();

  describe('filterByTag', () => {
    it('returns only patterns containing the tag', () => {
      const patterns = [
        createTestPattern({ name: 'P1', tags: ['tdd', 'testing'] }),
        createTestPattern({ name: 'P2', tags: ['bdd', 'testing'] }),
        createTestPattern({ name: 'P3', tags: ['tdd', 'ci'] }),
      ];
      const result = service.filterByTag(patterns, 'tdd');
      expect(result).toHaveLength(2);
      expect(result.every((p) => p.tags.some((t) => t.toString() === 'tdd'))).toBe(true);
    });

    it('returns empty array when no patterns match', () => {
      const patterns = [
        createTestPattern({ tags: ['tdd'] }),
        createTestPattern({ tags: ['bdd'] }),
      ];
      const result = service.filterByTag(patterns, 'nonexistent');
      expect(result).toHaveLength(0);
    });

    it('is case-insensitive', () => {
      const patterns = [createTestPattern({ tags: ['TDD'] })];
      const result = service.filterByTag(patterns, 'tdd');
      expect(result).toHaveLength(1);
    });
  });

  describe('search', () => {
    it('returns patterns matching query in name', () => {
      const patterns = [
        createTestPattern({ name: 'TDD Guardrails' }),
        createTestPattern({ name: 'Architecture Fitness' }),
      ];
      const result = service.search(patterns, 'tdd');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('TDD Guardrails');
    });

    it('returns patterns matching query in description', () => {
      const patterns = [
        createTestPattern({ description: 'Enforce test-driven development' }),
        createTestPattern({ description: 'Check architecture boundaries' }),
      ];
      const result = service.search(patterns, 'test-driven');
      expect(result).toHaveLength(1);
    });

    it('is case-insensitive', () => {
      const patterns = [createTestPattern({ name: 'TDD Guardrails' })];
      const result = service.search(patterns, 'tdd guardrails');
      expect(result).toHaveLength(1);
    });

    it('returns empty array when no patterns match', () => {
      const patterns = [createTestPattern({ name: 'TDD' })];
      const result = service.search(patterns, 'nonexistent');
      expect(result).toHaveLength(0);
    });
  });
});
