const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');

function getReportOutputPaths(job, index, resultsFolder, config) {
  const defaultBase = job.output || `result_${index + 1}`;
  const reporters = (config.reporters || '').split(',').map(r => r.trim()).filter(Boolean);
  return reporters
    .map(r => r.toLowerCase())
    .filter(r => r === 'json' || r === 'html' || r === 'junit')
    .map(r => path.join(resultsFolder, `${defaultBase}.${r}`));
}

function logReportOutputPaths(job, index, resultsFolder, config) {
  const reportPaths = getReportOutputPaths(job, index, resultsFolder, config);
  if (reportPaths.length === 0) {
    return;
  }

  logger.log('info', `📝 Report outputs for ${job.collection}:`);
  reportPaths.forEach(reportPath => {
    logger.log('info', `   - ${reportPath}`);
  });
}

function logFinalReportSummary(reportSummaries) {
  if (!Array.isArray(reportSummaries) || reportSummaries.length === 0) {
    return;
  }

  logger.log('info', '');
  logger.log('info', '🧾 Report files summary:');
  reportSummaries.forEach(summary => {
    logger.log('info', `  ${summary.collection}`);
    summary.reportPaths.forEach(reportPath => {
      const exists = fs.existsSync(reportPath);
      logger.log('info', `   - ${reportPath}${exists ? '' : ' (not found)'}`);
    });
  });
}

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
  const continueOnError = Boolean(config.continueOnError);
  const failures = [];
  const reportSummaries = [];
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
          logFinalReportSummary(reportSummaries);
          if (failures.length > 0) {
            return reject(new Error(`Completed with ${failures.length} failed collection(s).`));
          }
          return resolve();
        }
        while (active < limit && queue.length) {
          const job = queue.shift();
          const jobIndex = idx++;
          active++;
          reportSummaries.push({
            collection: job.collection,
            reportPaths: getReportOutputPaths(job, jobIndex, resultsFolder, config)
          });
          const [cmd, args] = buildCommand(job, jobIndex, resultsFolder, config);
          logger.log('debug', 'spawn', cmd, args);
          const child = spawn(cmd, args, { stdio: 'inherit' });
          child.on('error', err => {
            active--;
            const message = `Job failed to start: ${job.collection} (${err.message})`;
            if (continueOnError) {
              failures.push({ collection: job.collection, code: -1, reason: err.message });
              logger.log('error', message);
              next();
              return;
            }
            reject(new Error(message));
          });
          child.on('exit', code => {
            active--;
            if (code !== 0) {
              const message = `Job failed: ${job.collection} (exit ${code})`;
              if (continueOnError) {
                failures.push({ collection: job.collection, code });
                logger.log('error', message);
                next();
                return;
              }
              return reject(new Error(message));
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
      reportSummaries.push({
        collection: job.collection,
        reportPaths: getReportOutputPaths(job, i, resultsFolder, config)
      });
      const [cmd, args] = buildCommand(job, i, resultsFolder, config);
      logger.log('debug', 'spawn sequential', cmd, args);
      await new Promise((res, rej) => {
        const child = spawn(cmd, args, { stdio: 'inherit' });
        child.on('error', err => {
          const message = `Job failed to start: ${job.collection} (${err.message})`;
          if (continueOnError) {
            failures.push({ collection: job.collection, code: -1, reason: err.message });
            logger.log('error', message);
            return res();
          }
          rej(new Error(message));
        });
        child.on('exit', code => {
          if (code !== 0) {
            const message = `Job failed: ${job.collection} (exit ${code})`;
            if (continueOnError) {
              failures.push({ collection: job.collection, code });
              logger.log('error', message);
              return res();
            }
            return rej(new Error(message));
          }
          res();
        });
      });
    }

    logFinalReportSummary(reportSummaries);

    if (failures.length > 0) {
      throw new Error(`Completed with ${failures.length} failed collection(s).`);
    }
  }
}

module.exports = { runJobs };
