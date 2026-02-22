import { Slug } from '@domain/value-objects/slug.value-object';
import { Tag } from '@domain/value-objects/tag.value-object';
import { RepoUrl } from '@domain/value-objects/repo-url.value-object';
import { PromptSnippet } from '@domain/value-objects/prompt-snippet.value-object';
import { SkillReference } from '@domain/value-objects/skill-reference.value-object';
import { ToolReference } from '@domain/value-objects/tool-reference.value-object';
import { DisplayOrder } from '@domain/value-objects/display-order.value-object';

describe('Slug', () => {
  it('creates from a name string by lowercasing and hyphenating', () => {
    const slug = Slug.fromName('Context Engineering');
    expect(slug.toString()).toBe('context-engineering');
  });

  it('creates from already-slugified string', () => {
    const slug = Slug.create('context-engineering');
    expect(slug.toString()).toBe('context-engineering');
  });

  it('strips special characters', () => {
    const slug = Slug.fromName('TDD & BDD: Testing!');
    expect(slug.toString()).toBe('tdd-bdd-testing');
  });

  it('rejects empty string', () => {
    expect(() => Slug.create('')).toThrow();
  });

  it('supports equality comparison', () => {
    const slugA = Slug.create('test');
    const slugB = Slug.create('test');
    expect(slugA.equals(slugB)).toBe(true);
  });
});

describe('Tag', () => {
  it('creates from a non-empty string', () => {
    const tag = Tag.create('tdd');
    expect(tag.toString()).toBe('tdd');
  });

  it('normalizes to lowercase', () => {
    const tag = Tag.create('TDD');
    expect(tag.toString()).toBe('tdd');
  });

  it('trims whitespace', () => {
    const tag = Tag.create('  tdd  ');
    expect(tag.toString()).toBe('tdd');
  });

  it('rejects empty string', () => {
    expect(() => Tag.create('')).toThrow();
  });

  it('supports equality comparison', () => {
    const tagA = Tag.create('tdd');
    const tagB = Tag.create('TDD');
    expect(tagA.equals(tagB)).toBe(true);
  });
});

describe('RepoUrl', () => {
  it('creates from valid URL string', () => {
    const url = RepoUrl.create('https://github.com/example/repo');
    expect(url.toString()).toBe('https://github.com/example/repo');
  });

  it('rejects invalid URL', () => {
    expect(() => RepoUrl.create('not-a-url')).toThrow();
  });

  it('rejects empty string', () => {
    expect(() => RepoUrl.create('')).toThrow();
  });
});

describe('PromptSnippet', () => {
  it('creates from non-empty string', () => {
    const snippet = PromptSnippet.create('Use TDD to implement this feature');
    expect(snippet.toString()).toBe('Use TDD to implement this feature');
  });

  it('rejects empty string', () => {
    expect(() => PromptSnippet.create('')).toThrow();
  });
});

describe('SkillReference', () => {
  it('creates with name and install command', () => {
    const skill = SkillReference.create({
      skillName: 'tdd',
      installCommand: 'claude plugin install tdd',
    });
    expect(skill.skillName).toBe('tdd');
    expect(skill.installCommand).toBe('claude plugin install tdd');
  });

  it('rejects empty skill name', () => {
    expect(() =>
      SkillReference.create({ skillName: '', installCommand: 'cmd' }),
    ).toThrow();
  });
});

describe('ToolReference', () => {
  it('creates with name and URL', () => {
    const tool = ToolReference.create({
      toolName: 'ArchUnitTS',
      toolUrl: 'https://github.com/LukasNiessen/ArchUnitTS',
    });
    expect(tool.toolName).toBe('ArchUnitTS');
    expect(tool.toolUrl).toBe('https://github.com/LukasNiessen/ArchUnitTS');
  });

  it('rejects empty tool name', () => {
    expect(() =>
      ToolReference.create({ toolName: '', toolUrl: 'https://example.com' }),
    ).toThrow();
  });
});

describe('DisplayOrder', () => {
  it('creates from positive integer', () => {
    const order = DisplayOrder.create(1);
    expect(order.value).toBe(1);
  });

  it('rejects zero', () => {
    expect(() => DisplayOrder.create(0)).toThrow();
  });

  it('rejects negative numbers', () => {
    expect(() => DisplayOrder.create(-1)).toThrow();
  });

  it('rejects non-integer', () => {
    expect(() => DisplayOrder.create(1.5)).toThrow();
  });

  it('supports comparison for ordering', () => {
    const orderA = DisplayOrder.create(1);
    const orderB = DisplayOrder.create(2);
    expect(orderA.compareTo(orderB)).toBeLessThan(0);
  });
});
