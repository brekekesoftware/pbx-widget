module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },

  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },

  plugins: ['react', 'react-hooks', 'jsx-a11y'],

  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:tailwindcss/recommended',
    'plugin:prettier/recommended', // Prettier should be last
  ],

  globals: {
    route: false, // ignore ziggy's route not defined error
  },

  settings: {
    react: {
      version: 'detect',
    },
  },

  rules: {
    'react/prop-types': 0, // Ignore in jsx for now...
    'react/react-in-jsx-scope': 0, // Not needed with vite
    'react/no-unescaped-entities': 0,
    'react-hooks/exhaustive-deps': 2,
    'tailwindcss/classnames-order': 0, // prettier-plugin-tailwindcss takes care of this
    'tailwindcss/no-custom-classname': 0,
  },

  overrides: [
    {
      files: ['*.{ts,tsx}'],

      parser: '@typescript-eslint/parser',

      parserOptions: {
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
      },

      plugins: ['@typescript-eslint'],

      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],

      rules: {
        'no-unused-vars': 0,
        'react/prop-types': 0,
        '@typescript-eslint/no-non-null-assertion': 0,
        '@typescript-eslint/no-unused-vars': [2, { argsIgnorePattern: '^_' }],
      },
    },
  ],
};
