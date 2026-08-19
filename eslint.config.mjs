import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        // Replaces the old ignorePatterns. Build output is generated, never linted.
        ignores: ['lib/**', 'dist/**', 'coverage/**'],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parserOptions: {
                // Replaces parserOptions.project. Resolves each file's tsconfig on
                // demand, so type-aware rules can be switched on without further setup.
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            quotes: ['error', 'single', { avoidEscape: true }],
            '@typescript-eslint/no-explicit-any': 'off',
            'sort-keys': 'off',
            'no-shadow': 'off',
            'max-classes-per-file': 'off',
        },
    },
);
