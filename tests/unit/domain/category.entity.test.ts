import { Category } from '@domain/entities/category.entity';

describe('Category', () => {
  it('creates with valid props and derives slug from name', () => {
    const category = Category.create({
      name: 'Context Engineering',
      description: 'Patterns for engineering AI context',
      displayOrder: 1,
    });
    expect(category.name).toBe('Context Engineering');
    expect(category.slug.toString()).toBe('context-engineering');
    expect(category.description).toBe('Patterns for engineering AI context');
    expect(category.displayOrder.value).toBe(1);
  });

  it('rejects empty name', () => {
    expect(() =>
      Category.create({
        name: '',
        description: 'Test',
        displayOrder: 1,
      }),
    ).toThrow();
  });

  it('rejects non-positive displayOrder', () => {
    expect(() =>
      Category.create({
        name: 'Test',
        description: 'Test',
        displayOrder: 0,
      }),
    ).toThrow();
  });

  it('rejects empty description', () => {
    expect(() =>
      Category.create({
        name: 'Test',
        description: '',
        displayOrder: 1,
      }),
    ).toThrow();
  });
});
