import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['src/core/domain/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['@application/*', '@shell/*', '@ui/*', 'astro:*', 'preact*'], message: 'Domain layer must not import from application, shell, or UI layers.' },
        ],
      }],
    },
  },
  {
    files: ['src/core/application/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['@shell/*', '@ui/*', 'astro:*', 'preact*'], message: 'Application layer must not import from shell or UI layers.' },
        ],
      }],
    },
  },
  {
    files: ['src/**/*.ts', 'src/**/*.tsx', 'tests/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
    },
  },
];
