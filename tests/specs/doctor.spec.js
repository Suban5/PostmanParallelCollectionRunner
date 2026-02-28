const { fs, path, assert, repoRoot, runCli } = require('../test-utils');

module.exports = {
  name: '--doctor handles invalid config without module crash',
  run: () => {
    const configPath = path.join(repoRoot, 'config.json');
    const backupPath = path.join(repoRoot, 'config.json.test-backup');

    fs.copyFileSync(configPath, backupPath);
    try {
      fs.writeFileSync(
        configPath,
        JSON.stringify(
          {
            collectionsFolder: './collections',
            parallel: true,
            reporters: ['3'],
            outputDir: './results'
          },
          null,
          2
        )
      );

      const result = runCli(['--doctor']);
      const output = `${result.stdout}\n${result.stderr}`;

      assert.strictEqual(result.status, 0, `Expected doctor to exit 0, got ${result.status}\n${output}`);
      assert.match(output, /config\.json: invalid/i);
      assert.doesNotMatch(output, /Cannot find module '\.\/config\.json'/i);
    } finally {
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, configPath);
        fs.unlinkSync(backupPath);
      }
    }
  }
};
