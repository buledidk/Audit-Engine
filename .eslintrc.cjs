module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  globals: {
    describe: 'readonly',
    it: 'readonly',
    test: 'readonly',
    expect: 'readonly',
    beforeEach: 'readonly',
    afterEach: 'readonly',
    beforeAll: 'readonly',
    afterAll: 'readonly',
    vi: 'readonly'
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/no-unknown-property': 'off',
    'react/no-unescaped-entities': 'off',
    'no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      ignoreRestSiblings: true,
      caughtErrors: 'none'
    }],
    'no-undef': 'warn',
    'no-dupe-keys': 'warn',
    'no-useless-escape': 'warn',
    'prefer-const': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error', 'log'] }]
  }
}
