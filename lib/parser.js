const fs = require('fs');
const path = require('path');

function resolveIfFile(val) {
  if (val && val.endsWith('.json') && fs.existsSync(val)) {
    return path.resolve(val);
  }
  return val;
}

function parseJobs(config) {
  let jobs = [];

  if (Array.isArray(config.collections) && config.collections.length > 0) {
    jobs = config.collections.map(item => {
      if (typeof item === 'string') {
        return { collection: resolveIfFile(item) };
      }
      const col = resolveIfFile(item.collection || item.path || '');
      const job = { collection: col };
      if (item.environment) job.environment = item.environment;
      if (item.output) job.output = item.output;
      return job;
    });
  } else {
    const collectionsFolder = path.resolve(config.collectionsFolder || './collections');
    if (!fs.existsSync(collectionsFolder)) {
      throw new Error(`collectionsFolder does not exist: ${collectionsFolder}`);
    }

    const files = fs
      .readdirSync(collectionsFolder)
      .filter(f => f.endsWith('.json'))
      .map(f => path.join(collectionsFolder, f));

    if (files.length === 0) {
      throw new Error(`No collections found in folder: ${collectionsFolder}`);
    }
    jobs = files.map(f => ({ collection: f }));
  }

  if (jobs.length === 0) {
    throw new Error('No collections specified');
  }
  return jobs;
}

module.exports = { parseJobs };
