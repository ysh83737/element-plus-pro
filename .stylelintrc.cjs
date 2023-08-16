module.exports = {
  root: true,
  plugins: ['stylelint-scss'],
  extends: [
    'stylelint-config-recess-order', // stylelint-order
    'stylelint-config-standard-scss',
    'stylelint-config-standard-vue/scss',
  ],
  ignoreFiles: ['**/*.js', '**/*.ts'],
  rules: {
    // https://github.com/hudochenkov/stylelint-order/blob/master/rules/order/README.md
    'order/order': [
      'dollar-variables',
      'custom-properties',
      'at-rules',
      'declarations',
      'rules',
    ],
    'block-closing-brace-empty-line-before': ['never'],
    'max-empty-lines': 1,
    'no-eol-whitespace': true,
    'no-missing-end-of-source-newline': true,
    'block-no-empty': true,
  },
};
