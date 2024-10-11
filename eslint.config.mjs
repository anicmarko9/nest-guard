import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import _import from 'eslint-plugin-import';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...fixupConfigRules(
    compat.extends('plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'plugin:import/typescript'),
  ),

  {
    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslintEslintPlugin),
      import: fixupPluginRules(_import),
    },

    languageOptions: {
      globals: { ...globals.node, ...globals.jest },

      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'module',

      parserOptions: { project: 'tsconfig.json', tsconfigRootDir: path.resolve(__dirname) },
    },

    rules: {
      'import/no-cycle': 2,
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',

      'prettier/prettier': [
        'error',
        { semi: true, trailingComma: 'all', singleQuote: true, printWidth: 100, tabWidth: 2, endOfLine: 'lf' },
      ],
    },
  },
];
