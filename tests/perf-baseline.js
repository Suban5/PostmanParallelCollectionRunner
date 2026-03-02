const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const childProcess = require('child_process');

function createSpawnMock(delayMs = 5) {
  return () => {
    const child = new EventEmitter();
    setTimeout(() => {
      child.emit('exit', 0);
    }, delayMs);
    return child;
  };
}

function makeJobs(count) {
  return Array.from({ length: count }, (_, index) => ({
    collection: `collection-${index + 1}`
  }));
}

async function benchmark(jobCount, maxConcurrency, delayMs, runJobs) {
  const jobs = makeJobs(jobCount);
  const start = process.hrtime.bigint();

  await runJobs(jobs, {
    parallel: true,
    maxConcurrency,
    continueOnError: false,
    reporters: 'cli',
    exportResultsFolder: path.resolve('./results/perf-baseline')
  });

  const end = process.hrtime.bigint();
  const durationMs = Number(end - start) / 1e6;
  return {
    jobCount,
    maxConcurrency,
    simulatedProcessDelayMs: delayMs,
    totalDurationMs: Number(durationMs.toFixed(2)),
    avgDurationPerJobMs: Number((durationMs / jobCount).toFixed(2)),
    throughputJobsPerSecond: Number((jobCount / (durationMs / 1000)).toFixed(2))
  };
}

(async () => {
  const originalSpawn = childProcess.spawn;
  const runnerPath = path.resolve(__dirname, '../lib/runner');
  const delayMs = 5;

  try {
    childProcess.spawn = createSpawnMock(delayMs);
    delete require.cache[require.resolve(runnerPath)];
    const { runJobs } = require(runnerPath);

    const baseline = {
      generatedAt: new Date().toISOString(),
      environment: {
        node: process.version,
        platform: process.platform,
        arch: process.arch
      },
      scenarios: []
    };

    const scenarios = [
      { jobCount: 10, maxConcurrency: 2 },
      { jobCount: 50, maxConcurrency: 5 },
      { jobCount: 100, maxConcurrency: 10 }
    ];

    for (const scenario of scenarios) {
      baseline.scenarios.push(
        await benchmark(scenario.jobCount, scenario.maxConcurrency, delayMs, runJobs)
      );
    }

    const outputPath = path.resolve('./results/performance-baseline.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(baseline, null, 2));

    console.log('✅ Performance baseline generated:', outputPath);
    baseline.scenarios.forEach((row) => {
      console.log(
        `  - jobs=${row.jobCount}, concurrency=${row.maxConcurrency}, total=${row.totalDurationMs}ms, throughput=${row.throughputJobsPerSecond}/s`
      );
    });
  } catch (error) {
    console.error('❌ Failed to generate performance baseline');
    console.error(error.message);
    process.exit(1);
  } finally {
    childProcess.spawn = originalSpawn;
    delete require.cache[require.resolve(runnerPath)];
  }
})();
