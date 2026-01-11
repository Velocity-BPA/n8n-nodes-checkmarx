module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 2022,
  },
  plugins: ['@typescript-eslint', 'n8n-nodes-base'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:n8n-nodes-base/community',
    'prettier',
  ],
  env: {
    node: true,
    es2022: true,
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '*.js',
    '!.eslintrc.js',
    'gulpfile.js',
    'test/**/*.ts',
  ],
  rules: {
    // TypeScript rules
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',

    // n8n rules - adjusted for this project
    'n8n-nodes-base/node-param-description-miscased-id': 'warn',
    'n8n-nodes-base/node-param-description-missing-final-period': 'off',
    'n8n-nodes-base/node-param-description-wrong-for-dynamic-options': 'off',
    'n8n-nodes-base/node-param-option-description-identical-to-name': 'off',
    'n8n-nodes-base/node-param-description-unneeded-backticks': 'warn',
    'n8n-nodes-base/node-class-description-missing-subtitle': 'off',
    'n8n-nodes-base/node-param-description-excess-final-period': 'off',

    // General rules
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-constant-condition': ['error', { checkLoops: false }],
    'prefer-const': 'error',
    'no-var': 'error',
    eqeqeq: ['error', 'always'],
  },
};
