const { scopes } = require('./scopes');
module.exports = {
  extends: ['gitmoji'],
  rules: {
    'header-max-length': [0, 'always', 100],
    'scope-enum': [0, 'always', scopes],
  },
};
