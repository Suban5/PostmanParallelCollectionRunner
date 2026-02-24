#!/usr/bin/env node

const path = require('path');
const { loadConfig } = require('./lib/config');
const { parseJobs } = require('./lib/parser');
const logger = require('./lib/logger');
const { runJobs } = require('./lib/runner');

// simple argument parsing
const args = process.argv.slice(2);
let cfgPath = './config.json';
let verbose = false;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--config' || a === '-c') {
    cfgPath = args[++i];
  } else if (a === '--verbose' || a === '-v') {
    verbose = true;
  } else if (a === '--help' || a === '-h') {
    console.log('Usage: node run.js [--config path] [--verbose]');
    process.exit(0);
  }
}

logger.setLevel(verbose);

let config;
try {
  config = loadConfig(cfgPath);
} catch (err) {
  logger.log('error', err.message);
  process.exit(1);
}

let jobs;
try {
  jobs = parseJobs(config);
} catch (err) {
  logger.log('error', err.message);
  process.exit(1);
}

logger.log('info', `📂 Found ${jobs.length} collection(s):`, jobs.map(j => j.collection));

runJobs(jobs, config)
  .then(() => {
    logger.log('info', '🎉 All collections completed');
  })
  .catch(err => {
    logger.log('error', err.message);
    process.exit(1);
  });
