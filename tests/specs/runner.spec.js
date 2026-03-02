const { fs, path, os, assert } = require('../test-utils');
const childProcess = require('child_process');
const EventEmitter = require('events');

function createSpawnMock(outcomes) {
  return () => {
    const child = new EventEmitter();
    const next = outcomes.shift() || { type: 'exit', code: 0 };

    process.nextTick(() => {
      if (next.type === 'error') {
        child.emit('error', new Error(next.message || 'mock spawn error'));
        return;
      }
      child.emit('exit', next.code || 0);
    });

    return child;
  };
}

module.exports = {
  name: 'runJobs handles continueOnError failures in parallel',
  run: async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ppcr-runner-test-'));
    const outcomes = [
      { type: 'exit', code: 0 },
      { type: 'exit', code: 1 },
      { type: 'error', message: 'spawn failed' }
    ];

    const jobs = [
      { collection: 'collection-1' },
      { collection: 'collection-2' },
      { collection: 'collection-3' }
    ];

    const originalSpawn = childProcess.spawn;
    const runnerPath = path.resolve(__dirname, '../../lib/runner');

    try {
      childProcess.spawn = createSpawnMock(outcomes);
      delete require.cache[require.resolve(runnerPath)];
      const { runJobs } = require(runnerPath);

      await assert.rejects(
        () =>
          runJobs(jobs, {
            parallel: true,
            maxConcurrency: 2,
            continueOnError: true,
            reporters: 'cli',
            exportResultsFolder: tempDir
          }),
        /Completed with 2 failed collection\(s\)\./
      );
    } finally {
      childProcess.spawn = originalSpawn;
      delete require.cache[require.resolve(runnerPath)];
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
};
