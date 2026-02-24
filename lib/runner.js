const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');

function buildCommand(job, index, resultsFolder, config) {
  const env = job.environment || config.environment;
  const args = ['collection', 'run', job.collection];
  if (env) {
    args.push('-e', env);
  }
  if (config.reporters) {
    args.push('--reporters', config.reporters);
  }

  // handle output files for reporters that support explicit exports
  const defaultBase = job.output || `result_${index + 1}`;
  const reporters = (config.reporters || '').split(',').map(r => r.trim()).filter(Boolean);
  reporters.forEach(r => {
    const lower = r.toLowerCase();
    if (lower === 'json' || lower === 'html' || lower === 'junit') {
      const filename = `${defaultBase}.${lower}`;
      const flag = `--reporter-${lower}-export`;
      args.push(flag, path.join(resultsFolder, filename));
    }
  });

  return ['postman', args];
}

async function runJobs(jobs, config) {
  const resultsFolder = path.resolve(config.exportResultsFolder || './results');
  if (!fs.existsSync(resultsFolder)) {
    fs.mkdirSync(resultsFolder, { recursive: true });
  }

  if (config.parallel) {
    // treat 0 (or any falsy value) as “no cap”: use all jobs
    const limit = (config.maxConcurrency && config.maxConcurrency > 0)
      ? config.maxConcurrency
      : jobs.length;
    let active = 0;
    let idx = 0;
    const queue = jobs.slice();

    return new Promise((resolve, reject) => {
      const next = () => {
        if (queue.length === 0 && active === 0) {
          return resolve();
        }
        while (active < limit && queue.length) {
          const job = queue.shift();
          const jobIndex = idx++;
          active++;
          const [cmd, args] = buildCommand(job, jobIndex, resultsFolder, config);
          logger.log('debug', 'spawn', cmd, args);
          const child = spawn(cmd, args, { stdio: 'inherit' });
          child.on('exit', code => {
            active--;
            if (code !== 0) {
              return reject(new Error(`Job failed: ${job.collection} (exit ${code})`));
            }
            logger.log('info', `✅ Finished ${job.collection}`);
            next();
          });
        }
      };
      next();
    });
  } else {
    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      const [cmd, args] = buildCommand(job, i, resultsFolder, config);
      logger.log('debug', 'spawn sequential', cmd, args);
      await new Promise((res, rej) => {
        const child = spawn(cmd, args, { stdio: 'inherit' });
        child.on('exit', code => {
          if (code !== 0) {
            return rej(new Error(`Job failed: ${job.collection} (exit ${code})`));
          }
          res();
        });
      });
    }
  }
}

module.exports = { runJobs };
