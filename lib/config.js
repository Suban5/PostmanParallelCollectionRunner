const fs = require('fs');
const path = require('path');

function loadConfig(configPath) {
  const absolute = path.resolve(configPath || './config.json');
  if (!fs.existsSync(absolute)) {
    throw new Error(`Config not found at ${absolute}`);
  }
  let cfg;
  try {
    cfg = require(absolute);
  } catch (e) {
    throw new Error(`Unable to parse JSON at ${absolute}: ${e.message}`);
  }
  validate(cfg);
  return cfg;
}

function validate(cfg) {
  const errors = [];

  if ('collectionsFolder' in cfg && typeof cfg.collectionsFolder !== 'string') {
    errors.push('"collectionsFolder" must be a string.');
  }

  if ('collections' in cfg) {
    if (!Array.isArray(cfg.collections)) {
      errors.push('"collections" must be an array.');
    } else {
      cfg.collections.forEach((job, idx) => {
        if (typeof job === 'string') return;
        if (typeof job === 'object' && job !== null) {
          if (!job.collection && !job.path) {
            errors.push(`collections[${idx}] requires a \"collection\" field.`);
          } else if (job.collection && typeof job.collection !== 'string') {
            errors.push(`collections[${idx}].collection must be a string.`);
          }
          if (job.environment && typeof job.environment !== 'string') {
            errors.push(`collections[${idx}].environment must be a string.`);
          }
          if (job.output && typeof job.output !== 'string') {
            errors.push(`collections[${idx}].output must be a string.`);
          }
        } else {
          errors.push(`collections[${idx}] must be a string or object.`);
        }
      });
    }
  }

  if ('environment' in cfg && typeof cfg.environment !== 'string') {
    errors.push('"environment" must be a string.');
  }

  if ('parallel' in cfg && typeof cfg.parallel !== 'boolean') {
    errors.push('"parallel" must be a boolean.');
  }

  if ('maxConcurrency' in cfg) {
    // zero means “no limit” (use as many workers as there are jobs).
    // validator previously required >=1; relax to allow 0 so a user can
    // explicitly say they want the default behaviour.
    if (!Number.isInteger(cfg.maxConcurrency) || cfg.maxConcurrency < 0) {
      errors.push('"maxConcurrency" must be a non‑negative integer.');
    }
  }

  if ('reporters' in cfg && typeof cfg.reporters !== 'string') {
    errors.push('"reporters" must be a comma‑separated string.');
  }

  if ('exportResultsFolder' in cfg && typeof cfg.exportResultsFolder !== 'string') {
    errors.push('"exportResultsFolder" must be a string.');
  }

  if (errors.length) {
    throw new Error('Configuration validation errors:\n' + errors.join('\n'));
  }
}

module.exports = { loadConfig };
