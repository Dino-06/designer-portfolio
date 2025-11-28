// eslint.config.js (FIXED FOR SVELTE)

import js from '@eslint/js';
import globals from 'globals';
import { defineFlatConfig } from 'eslint-flat-config';
import svelte from 'eslint-plugin-svelte';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default defineFlatConfig([
    {
        // 1. Base JavaScript files and global settings
        files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
        languageOptions: {
            globals: globals.browser,
            ecmaVersion: 2022,
            sourceType: 'module',
        },
        extends: [js.configs.recommended],
    },
    {
        // 2. Svelte files configuration
        files: ['**/*.svelte'],
        languageOptions: {
            // Use the TypeScript parser (recommended for Svelte)
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
                extraFileExtensions: ['.svelte'],
            },
            globals: globals.browser,
        },
        plugins: {
            svelte,
            '@typescript-eslint': ts,
        },
        processor: 'svelte/svelte',
        rules: {
            // Apply recommended Svelte rules
            ...svelte.configs.recommended.rules,
            
            // Example custom rule
            'no-unused-vars': 'off', // Svelte often flags imports/vars incorrectly
        },
    },
    // Optional: Ignore build artifacts
    { ignores: ['dist', 'node_modules', 'public/projects_data.js'] },
]);