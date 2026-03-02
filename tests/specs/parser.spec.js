const { fs, path, os, assert } = require('../test-utils');
const { parseJobs } = require('../../lib/parser');

module.exports = {
  name: 'parseJobs supports explicit list and folder discovery',
  run: () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ppcr-parser-test-'));
    const collectionsDir = path.join(tempDir, 'collections');

    try {
      fs.mkdirSync(collectionsDir, { recursive: true });
      fs.writeFileSync(path.join(collectionsDir, 'a.postman_collection.json'), '{}');
      fs.writeFileSync(path.join(collectionsDir, 'b.postman_collection.json'), '{}');

      const explicit = parseJobs({
        collections: [
          path.join(collectionsDir, 'a.postman_collection.json'),
          {
            collection: path.join(collectionsDir, 'b.postman_collection.json'),
            environment: './environments/test.postman_environment.json',
            output: 'result_b'
          }
        ]
      });

      assert.strictEqual(explicit.length, 2);
      assert.ok(explicit[0].collection.endsWith('a.postman_collection.json'));
      assert.strictEqual(explicit[1].environment, './environments/test.postman_environment.json');
      assert.strictEqual(explicit[1].output, 'result_b');

      const discovered = parseJobs({ collectionsFolder: collectionsDir });
      assert.strictEqual(discovered.length, 2);
      assert.ok(discovered.some(j => j.collection.endsWith('a.postman_collection.json')));
      assert.ok(discovered.some(j => j.collection.endsWith('b.postman_collection.json')));
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
};
