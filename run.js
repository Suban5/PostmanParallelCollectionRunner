#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const { loadConfig } = require('./lib/config');
const { parseJobs } = require('./lib/parser');
const logger = require('./lib/logger');
const { runJobs } = require('./lib/runner');
const { interactiveSetup, generateConfigFromAnswers, saveConfig } = require('./lib/interactive');

const packageJson = require('./package.json');

// Simple argument parsing
const args = process.argv.slice(2);
let cfgPath = './config.json';
let verbose = false;
let continueOnError;

// Handle flags that exit early
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  
  if (a === '--version' || a === '-v') {
    console.log(`postman-parallel ${packageJson.version}`);
    process.exit(0);
  }
  
  if (a === '--help' || a === '-h') {
    showHelp();
    process.exit(0);
  }

  if (a === '--init' || a === '-i') {
    handleInit()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
    return;
  }

  if (a === '--validate') {
    handleValidate(args[++i] || cfgPath);
    return;
  }

  if (a === '--list') {
    handleList(args[++i] || cfgPath);
    return;
  }

  if (a === '--doctor') {
    handleDoctor();
    return;
  }

  if (a === '--config' || a === '-c') {
    cfgPath = args[++i];
  } else if (a === '--verbose') {
    verbose = true;
  } else if (a === '--continue-on-error') {
    continueOnError = true;
  }
}

logger.setLevel(verbose);

// Default: run collections
runDefault(cfgPath, continueOnError);

// ============= Helper Functions =============

function showHelp() {
  const help = `
📚 Postman Parallel Collection Runner v${packageJson.version}

Usage:
  postman-parallel [options]

Options:
  --config, -c <path>    Path to config file (default: ./config.json)
  --init, -i             Interactive setup wizard
  --validate [path]      Validate config file
  --list [path]          List available collections
  --doctor               Diagnostic check
  --continue-on-error    Continue running other collections after a failure
  --verbose              Show detailed logs
  --help, -h             Show this help
  --version              Show version

Examples:
  postman-parallel --init              # Create config interactively
  postman-parallel                     # Run with default config
  postman-parallel -c ./config.json    # Run with specific config
  postman-parallel --continue-on-error # Run all collections, even if one fails
  postman-parallel --validate          # Check config validity
  postman-parallel --list              # Show collections

Documentation:
  📖 https://github.com/Suban5/PostmanParallelCollectionRunner#readme
`;
  console.log(help);
}

async function handleInit() {
  try {
    const answers = await interactiveSetup();
    const config = await generateConfigFromAnswers(answers);
    const result = await saveConfig(config);

    if (result.success) {
      logger.log('info', '');
      logger.log('info', '✅ Configuration saved successfully!');
      logger.log('info', `📄 Location: ${result.path}`);
      logger.log('info', '');
      logger.log('info', '🚀 Next steps:');
      logger.log('info', '   1. Review the config: cat config.json');
      logger.log('info', '   2. Run collections: postman-parallel');
      logger.log('info', '   3. Check results: cat results/result.json');
      logger.log('info', '');
    } else {
      logger.log('error', `Failed to save config: ${result.error}`);
      process.exit(1);
    }
  } catch (err) {
    logger.log('error', `Setup cancelled: ${err.message}`);
    process.exit(1);
  }
}

function handleValidate(configPath) {
  try {
    const config = loadConfig(configPath);
    const jobs = parseJobs(config);
    
    logger.log('info', '');
    logger.log('info', '✅ Configuration is valid!');
    logger.log('info', `📄 Config file: ${path.resolve(configPath)}`);
    if (config.collectionsFolder) {
      logger.log('info', `📂 Collections folder: ${config.collectionsFolder}`);
    } else if (Array.isArray(config.collections)) {
      logger.log('info', `📂 Collections source: explicit list (${config.collections.length} item(s))`);
    }
    logger.log('info', `🚀 Collections to run: ${jobs.length}`);
    logger.log('info', `⚡ Parallel mode: ${config.parallel ? 'enabled' : 'disabled'}`);
    logger.log('info', `📊 Reporters: ${config.reporters || 'cli'}`);
    logger.log('info', '');
  } catch (err) {
    logger.log('error', '❌ Configuration validation failed:');
    logger.log('error', `  ${err.message}`);
    logger.log('error', '');
    logger.log('error', '💡 Quick fixes:');
    logger.log('error', '   1. Check the config file exists and is valid JSON');
    logger.log('error', '   2. Ensure all paths point to existing files');
    logger.log('error', '   3. Run: postman-parallel --init (to create new config)');
    logger.log('error', '');
    process.exit(1);
  }
}

function handleList(configPath) {
  try {
    const config = loadConfig(configPath);
    const jobs = parseJobs(config);
    
    logger.log('info', '');
    logger.log('info', `📂 Found ${jobs.length} collection(s):`);
    jobs.forEach((job, idx) => {
      const collName = path.basename(job.collection);
      const envInfo = job.environment ? ` (env: ${path.basename(job.environment)})` : '';
      logger.log('info', `  ${idx + 1}. ${collName}${envInfo}`);
    });
    logger.log('info', '');
    logger.log('info', `Run "postman-parallel" to execute these collections`);
    logger.log('info', '');
  } catch (err) {
    logger.log('error', `Failed to load config: ${err.message}`);
    process.exit(1);
  }
}

function handleDoctor() {
  logger.log('info', '');
  logger.log('info', '🏥 Running diagnostic checks...');
  logger.log('info', '');

  // Check Node version
  const nodeVersion = process.version;
  logger.log('info', `✅ Node.js: ${nodeVersion}`);

  // Check if Postman CLI executable is available in PATH (with OS-specific fallbacks)
  const postmanCandidates = [
    'postman',
    'postman.cmd',
    'postman.exe',
    '/opt/homebrew/bin/postman',
    '/usr/local/bin/postman',
    '/snap/bin/postman'
  ];
  let postmanDetected = null;

  for (const candidate of postmanCandidates) {
    const check = spawnSync(candidate, ['--version'], { encoding: 'utf8' });
    if (check.status === 0) {
      postmanDetected = {
        command: candidate,
        version: (check.stdout || '').trim()
      };
      break;
    }
  }

  if (postmanDetected) {
    if (postmanDetected.version) {
      logger.log('info', `✅ Postman CLI: installed (${postmanDetected.version})`);
    } else {
      logger.log('info', '✅ Postman CLI: installed');
    }
    logger.log('info', `   Binary: ${postmanDetected.command}`);
  } else {
    logger.log('warn', '⚠️  Postman CLI: not found in PATH');
    logger.log('info', '   Install with: npm install -g postman-cli');
    logger.log('info', `   PATH: ${process.env.PATH || '(empty)'}`);
  }

  // Auto-detect config*.json files
  const files = fs.readdirSync(process.cwd());
  const configFiles = files.filter(f => /^config.*\.json$/.test(f));
  let hasWarningsOrErrors = false;

  const collectionLooksLikeFilePath = (value) => {
    if (!value || typeof value !== 'string') return false;
    const looksLikeCloudId = !value.includes(path.sep) && !value.endsWith('.json');
    if (looksLikeCloudId) return false;
    return value.endsWith('.json') || value.includes(path.sep) || value.startsWith('.');
  };

  if (configFiles.length > 0) {
    const configFileUsed = configFiles[0];
    try {
      const cfg = loadConfig(configFileUsed);
      logger.log('info', `✅ ${configFileUsed}: valid`);

      const jobs = parseJobs(cfg);
      logger.log('info', `✅ Jobs parsed: ${jobs.length} collection(s)`);

      let missingPaths = 0;
      jobs.forEach(job => {
        if (collectionLooksLikeFilePath(job.collection) && !fs.existsSync(path.resolve(job.collection))) {
          missingPaths += 1;
          logger.log('warn', `⚠️  Missing collection file: ${job.collection}`);
        }
        if (job.environment && collectionLooksLikeFilePath(job.environment) && !fs.existsSync(path.resolve(job.environment))) {
          missingPaths += 1;
          logger.log('warn', `⚠️  Missing environment file: ${job.environment}`);
        }
      });

      if (missingPaths > 0) {
        hasWarningsOrErrors = true;
      }
    } catch (err) {
      logger.log('error', `❌ ${configFileUsed}: invalid (${err.message})`);
      hasWarningsOrErrors = true;
    }
  } else {
    logger.log('warn', '⚠️  No config*.json file found');
    logger.log('info', '   Create one with: postman-parallel --init');
    hasWarningsOrErrors = true;
  }

  logger.log('info', '');
  if (!hasWarningsOrErrors) {
    logger.log('info', 'Diagnostic complete. All systems operational! 🚀');
  } else {
    logger.log('warn', 'Diagnostic complete. Issues detected above.');
  }
  logger.log('info', '');
}

function runDefault(cfgPath, continueOnErrorFlag) {
  let config;
  try {
    config = loadConfig(cfgPath);
    logger.log('debug', `Config parsed successfully: ${path.resolve(cfgPath)}`);
  } catch (err) {
    logger.log('error', err.message);
    logger.log('error', '');
    logger.log('error', '💡 Quick fixes:');
    logger.log('error', '   1. Create a config: postman-parallel --init');
    logger.log('error', '   2. Validate config: postman-parallel --validate');
    logger.log('error', '   3. Check help: postman-parallel --help');
    logger.log('error', '');
    process.exit(1);
  }

  let jobs;
  try {
    jobs = parseJobs(config);
    logger.log('debug', `Jobs parsed: ${jobs.length}`);
    jobs.forEach((job, index) => {
      logger.log(
        'debug',
        `job[${index}] collection=${job.collection}${job.environment ? ` environment=${job.environment}` : ''}${job.output ? ` output=${job.output}` : ''}`
      );
    });
  } catch (err) {
    logger.log('error', err.message);
    process.exit(1);
  }

  logger.log('info', `📂 Found ${jobs.length} collection(s):`, jobs.map(j => j.collection));

  const effectiveContinueOnError =
    typeof continueOnErrorFlag === 'boolean'
      ? continueOnErrorFlag
      : ('continueOnError' in config ? Boolean(config.continueOnError) : true);

  config.continueOnError = effectiveContinueOnError;
  if (config.continueOnError) {
    logger.log('info', 'ℹ️  Continue-on-error is enabled');
  }

  runJobs(jobs, config)
    .then(() => {
      logger.log('info', '🎉 All collections completed');
    })
    .catch(err => {
      logger.log('error', err.message);
      process.exit(1);
    });
}
