import { describe, it, expect } from 'vitest';
import { projectFiles } from 'archunit';

// Allow empty tests while directories have no source files yet.
// Once files exist, ArchUnit will enforce the rules strictly.
const archOptions = { allowEmptyTests: true };

describe('Architecture Fitness', () => {
  it('domain layer does not depend on application layer', async () => {
    const rule = projectFiles()
      .inFolder('src/core/domain/**')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/core/application/**');
    await expect(rule).toPassAsync(archOptions);
  });

  it('domain layer does not depend on shell layer', async () => {
    const rule = projectFiles()
      .inFolder('src/core/domain/**')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/shell/**');
    await expect(rule).toPassAsync(archOptions);
  });

  it('domain layer does not depend on UI layer', async () => {
    const rule = projectFiles()
      .inFolder('src/core/domain/**')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/pages/**');
    await expect(rule).toPassAsync(archOptions);
  });

  it('application layer does not depend on shell layer', async () => {
    const rule = projectFiles()
      .inFolder('src/core/application/**')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/shell/**');
    await expect(rule).toPassAsync(archOptions);
  });

  it('application layer does not depend on UI layer', async () => {
    const rule = projectFiles()
      .inFolder('src/core/application/**')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/pages/**');
    await expect(rule).toPassAsync(archOptions);
  });

  it('no circular dependencies in src', async () => {
    const rule = projectFiles()
      .inFolder('src/**')
      .should()
      .haveNoCycles();
    await expect(rule).toPassAsync(archOptions);
  });

  it('value objects follow naming convention', async () => {
    const rule = projectFiles()
      .inFolder('src/core/domain/value-objects/**')
      .should()
      .haveName('*.value-object.ts');
    await expect(rule).toPassAsync(archOptions);
  });

  it('entities follow naming convention', async () => {
    const rule = projectFiles()
      .inFolder('src/core/domain/entities/**')
      .should()
      .haveName('*.entity.ts');
    await expect(rule).toPassAsync(archOptions);
  });

  it('use cases follow naming convention', async () => {
    const rule = projectFiles()
      .inFolder('src/core/application/use-cases/**')
      .should()
      .haveName('*.use-case.ts');
    await expect(rule).toPassAsync(archOptions);
  });

  it('ports follow naming convention', async () => {
    const rule = projectFiles()
      .inFolder('src/core/application/ports/**')
      .should()
      .haveName('*.port.ts');
    await expect(rule).toPassAsync(archOptions);
  });
});
