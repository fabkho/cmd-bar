module.exports = {
  env: {
    node: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript',
    '@vue/typescript/recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    'vue/no-multiple-template-root': 'off',
  },
  ignorePatterns: ['node_modules', 'build', 'dist', 'public']
}
