const { assert, runCli } = require('../test-utils');

module.exports = {
  name: '--validate/--list basic behavior',
  run: () => {
    const valid = runCli(['--validate', './tests/fixtures/basic/config-valid.json']);
    assert.strictEqual(valid.status, 0, `Expected exit code 0, got ${valid.status}\n${valid.stdout}\n${valid.stderr}`);
    assert.match(valid.stdout, /Configuration is valid/i);

    const invalid = runCli(['--validate', './tests/fixtures/basic/config-invalid-reporters.json']);
    assert.notStrictEqual(invalid.status, 0, 'Expected non-zero exit code for invalid config');
    assert.match(invalid.stdout + invalid.stderr, /"reporters" must be a comma‑separated string\.|"reporters" must be a comma-separated string\./i);

    const list = runCli(['--list', './tests/fixtures/basic/config-valid.json']);
    assert.strictEqual(list.status, 0, `Expected exit code 0, got ${list.status}\n${list.stdout}\n${list.stderr}`);
    assert.match(list.stdout, /sample\.postman_collection\.json/i);
  }
};
