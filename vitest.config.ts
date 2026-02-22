import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@domain': `${currentDirectory}src/core/domain`,
      '@application': `${currentDirectory}src/core/application`,
      '@shell': `${currentDirectory}src/shell`,
      '@ui': `${currentDirectory}src/ui`,
      '@content': `${currentDirectory}src/content`,
    },
  },
  test: {
    globals: true,
    passWithNoTests: true,
    include: ['tests/**/*.test.ts'],
  },
});
