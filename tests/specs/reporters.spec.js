const { assert, generateConfigFromAnswers } = require('../test-utils');

module.exports = {
  name: 'generateConfigFromAnswers normalizes numeric reporters',
  run: async () => {
    const cfg = await generateConfigFromAnswers({
      collectionsFolder: './collections',
      parallel: true,
      reporters: ['3'],
      outputDir: './results',
      environmentsFolder: './environments'
    });

    assert.strictEqual(cfg.reporters, 'cli,html,json');
  }
};
