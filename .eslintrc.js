module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true
  },
  extends: 'standard',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    semi: ['warn', 'always'],
    quotes: ['warn', 'single'],
    indent: ['warn'],
    'comma-dangle': ['warn'],
    'no-trailing-spaces': ['warn'],
    'no-multiple-empty-lines': ['warn'],
    'consistent-return': ['warn', { treatUndefinedAsUnspecified: true }],
    'space-before-function-paren': ['warn', 'never']
  }
};
