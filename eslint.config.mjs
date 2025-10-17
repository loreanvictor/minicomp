import path from 'node:path'
import { fileURLToPath } from 'node:url'

import globals from 'globals'

import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import { FlatCompat } from '@eslint/eslintrc'

import tslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default defineConfig([globalIgnores(['dist/**/*']), {
  extends: compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended'),
  plugins: {
    '@typescript-eslint': tslint,
  },
  languageOptions: {
    parser: tsparser,
    globals: {
      ...globals.browser,
      ...globals.node,
    },
  },

  rules: {
    curly: 'warn',
    semi: ['warn', 'never'],
    indent: ['warn', 2],
    eqeqeq: 'warn',
    quotes: ['warn', 'single', {
      avoidEscape: true,
    }],

    'no-unused-vars': 'off',
    'no-shadow': 'warn',
    'prefer-const': 'warn',
    'prefer-spread': 'warn',
    'prefer-object-spread': 'warn',
    'newline-before-return': 'warn',
    'eol-last': 'warn',
    'no-trailing-spaces': 'warn',
    'no-unused-expressions': ['error', {
      allowShortCircuit: true,
      allowTernary: true,
    }],

    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/adjacent-overload-signatures': 'warn',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-empty-interface': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-inferrable-types': 'warn',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-unused-expressions': ['error', {
      allowShortCircuit: true,
      allowTernary: true,
    }],
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_|^renderer$',
      varsIgnorePattern: '^_',
    }],

    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-var-requires': 'off',
  },
}, {
  files: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  rules: {
    'no-unused-expressions': 'off',
  },
}])
