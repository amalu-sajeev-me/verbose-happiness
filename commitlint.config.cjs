module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      issuePrefixes: ['#'],
    },
  },
  rules: {
    'subject-case': [2, 'always', ['lower-case']],
    'scope-enum': [2, 'always', ['configs', 'formatting', 'code', 'deployment', 'tests']],
  },
};