const fs = require('fs');
const path = require('path');

function loadConfig(configPath) {
  let absolute;
  if (configPath) {
    absolute = path.resolve(configPath);
  } else {
    // Auto-detect config*.json files in current directory
    const files = fs.readdirSync(process.cwd());
    const configFiles = files.filter(f => /^config.*\.json$/.test(f));
    if (configFiles.length === 0) {
      const errorMsg = `
❌ No config file found in ${process.cwd()}

💡 How to fix:
   1. Create a config interactively: postman-parallel --init
   2. Or specify a different config: postman-parallel --config <path>
   3. Or check the path is correct: ls config*.json

📖 Learn more: https://github.com/Suban5/PostmanParallelCollectionRunner#quick-start
`;
      throw new Error(errorMsg);
    }
    absolute = path.resolve(configFiles[0]); // Use first found config file
  }
  if (!fs.existsSync(absolute)) {
    const errorMsg = `
❌ Config file not found at ${absolute}

💡 How to fix:
   1. Create a config interactively: postman-parallel --init
   2. Or specify a different config: postman-parallel --config <path>
   3. Or check the path is correct: ls ${configPath || 'config*.json'}

📖 Learn more: https://github.com/Suban5/PostmanParallelCollectionRunner#quick-start
`;
    throw new Error(errorMsg);
  }
  let cfg;
  try {
    cfg = require(absolute);
  } catch (e) {
    const errorMsg = `
❌ JSON parse error in ${absolute}

Error details: ${e.message}

💡 How to fix:
   - Check for trailing commas: "key": value,  ← Remove comma before }
   - Check all strings have quotes: "key": "value"
   - Check all braces { } and brackets [ ] are balanced
   - Use an online JSON validator: https://jsonlint.com/

Example of valid config:
{
  "collectionsFolder": "./collections",
  "parallel": true,
  "reporters": ["cli", "json"],
  "outputDir": "./results"
}
`;
    throw new Error(errorMsg);
  }
  validate(cfg);
  // Minimal required config validation
  const missing = [];
  if (!('reporters' in cfg)) {
    missing.push('reporters');
  }
  if (!('collections' in cfg) && !('collectionsFolder' in cfg)) {
    missing.push('collections or collectionsFolder');
  }
  if (missing.length) {
    throw new Error(`❌ Config file missing required fields: ${missing.join(', ')}`);
  }
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
    const errorMsg = `
❌ Configuration validation errors:

${errors.map(e => `  • ${e}`).join('\n')}

💡 How to check your config:
   1. Validate: postman-parallel --validate
   2. View your config: cat config.json
   3. Create a new one: postman-parallel --init

📖 Config reference: https://github.com/Suban5/PostmanParallelCollectionRunner/docs/CONFIGURATION.md
`;
    throw new Error(errorMsg);
  }
}

module.exports = { loadConfig };
