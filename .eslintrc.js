module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // '@typescript-eslint/no-explicit-any': ['off'], // 初期开发暂时关闭，正式开发补充类型必须启用，避免所谓的anyscript
    // '@typescript-eslint/no-unused-vars': ['off'],
    // '@typescript-eslint/ban-types': ['off']
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'state',
          'storeState',
        ],
      },
    ],
    'spaced-comment': ['error', 'always', {
      line: {
        markers: ['#region', '#endregion', 'region', 'endregion'],
      },
    }],
    'max-len': ['error', {
      code: 300,
      ignorePattern: 'd="([\\s\\S]*?)"', // 避免检测框架自己带上的svg
      ignoreComments: true,
      ignoreStrings: true,
      ignoreUrls: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
    }],
    'prefer-destructuring': ['error', {
      VariableDeclarator: {
        array: true,
        object: true,
      },
      AssignmentExpression: {
        array: false,
        object: false,
      },
    }],
    '@typescript-eslint/no-namespace': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error', {
      ignoreTypeValueShadow: true, // enum声明时候有bug，去掉此规则
    }],
    'linebreak-style': ['off', 'windows'],
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
    {
      files: [
        './mock/*.{j,t}s?(x)',
        './src/utils/mock/*.{j,t}s?(x)',
      ],
      rules: {
        'no-var': ['off'],
        '@typescript-eslint/no-var-requires': ['off'],
      },
    },
  ],
};
