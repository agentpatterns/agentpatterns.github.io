import { Pattern } from '@domain/entities/pattern.entity';

describe('Pattern', () => {
  it('creates with valid props and derives slug from name', () => {
    const pattern = Pattern.create({
      name: 'TDD Guardrails',
      categorySlug: 'testing-and-validation',
      description: 'Enforce test-driven development in agentic workflows',
      tags: ['tdd', 'testing'],
    });
    expect(pattern.name).toBe('TDD Guardrails');
    expect(pattern.slug.toString()).toBe('tdd-guardrails');
    expect(pattern.categorySlug.toString()).toBe('testing-and-validation');
    expect(pattern.tags).toHaveLength(2);
    expect(pattern.tags[0].toString()).toBe('tdd');
  });

  it('creates with optional fields', () => {
    const pattern = Pattern.create({
      name: 'Architecture Fitness Testing',
      categorySlug: 'testing-and-validation',
      description: 'Use ArchUnitTS for architecture fitness tests',
      tags: ['architecture'],
      repoUrl: 'https://github.com/LukasNiessen/ArchUnitTS',
      samplePrompt: 'Write architecture fitness tests for this project',
      skills: [{ skillName: 'tdd', installCommand: 'claude plugin install tdd' }],
      tools: [{ toolName: 'ArchUnitTS', toolUrl: 'https://github.com/LukasNiessen/ArchUnitTS' }],
    });
    expect(pattern.repoUrl?.toString()).toBe('https://github.com/LukasNiessen/ArchUnitTS');
    expect(pattern.samplePrompt?.toString()).toBe('Write architecture fitness tests for this project');
    expect(pattern.skills).toHaveLength(1);
    expect(pattern.tools).toHaveLength(1);
  });

  it('rejects empty name', () => {
    expect(() =>
      Pattern.create({
        name: '',
        categorySlug: 'test',
        description: 'Test',
        tags: ['test'],
      }),
    ).toThrow();
  });

  it('rejects empty tags array', () => {
    expect(() =>
      Pattern.create({
        name: 'Test',
        categorySlug: 'test',
        description: 'Test',
        tags: [],
      }),
    ).toThrow();
  });

  it('rejects empty description', () => {
    expect(() =>
      Pattern.create({
        name: 'Test',
        categorySlug: 'test',
        description: '',
        tags: ['test'],
      }),
    ).toThrow();
  });
});
