const fs = require('fs');
const path = require('path');
const readline = require('readline');
const logger = require('./logger');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let scriptedAnswers = null;
let scriptedAnswerIndex = 0;

if (!process.stdin.isTTY) {
  try {
    const rawInput = fs.readFileSync(0, 'utf8');
    scriptedAnswers = rawInput.split(/\r?\n/);
  } catch {
    scriptedAnswers = [];
  }
}

function normalizeReporters(input, includeDefaults = true) {
  const reporterMap = {
    '1': 'cli',
    '2': 'json',
    '3': 'html',
    'cli': 'cli',
    'json': 'json',
    'html': 'html',
    'junit': 'junit'
  };

  const tokens = Array.isArray(input)
    ? input
    : String(input || '')
      .split(',')
      .map(r => r.trim())
      .filter(Boolean);

  const mapped = tokens
    .map(r => reporterMap[String(r).toLowerCase()] || String(r).toLowerCase())
    .filter(Boolean);

  const set = new Set(mapped);

  if (includeDefaults) {
    set.add('cli');
    set.add('json');
  }

  if (set.size === 0) {
    set.add('cli');
    set.add('json');
  }

  const order = ['cli', 'html', 'json', 'junit'];
  return order.filter(r => set.has(r)).join(',');
}

function question(prompt) {
  return new Promise((resolve) => {
    if (Array.isArray(scriptedAnswers)) {
      process.stdout.write(prompt);
      const answer = scriptedAnswers[scriptedAnswerIndex++] || '';
      process.stdout.write(`${answer}\n`);
      resolve(answer);
      return;
    }

    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function interactiveSetup() {
  console.log('\n📋 Postman Parallel Runner - Interactive Setup\n');
  
  const answers = {};

  // Question 1: Collections folder
  let collectionsFolder = await question('📂 Where are your collection files located? (default: ./collections): ');
  answers.collectionsFolder = collectionsFolder.trim() || './collections';
  
  // Validate collections folder exists
  if (!fs.existsSync(answers.collectionsFolder)) {
    logger.log('warn', `⚠️  Directory does not exist: ${answers.collectionsFolder}`);
    const create = await question('Create it? (yes/no): ');
    if (create.toLowerCase() === 'yes' || create.toLowerCase() === 'y') {
      fs.mkdirSync(answers.collectionsFolder, { recursive: true });
      logger.log('info', `✅ Created directory: ${answers.collectionsFolder}`);
    }
  }

  // Question 2: Collections or collectionsFolder
  const useFolder = await question('Auto-discover collections in folder? (yes/no, default: yes): ');
  if (useFolder.toLowerCase() !== 'no' && useFolder.toLowerCase() !== 'n') {
    // Use folder approach
    answers.collections = [];
  } else {
    // Use explicit collections array
    answers.collections = [];
    let addMore = true;
    let count = 1;
    while (addMore) {
      const collPath = await question(`Collection ${count} path (or leave empty to skip): `);
      if (collPath.trim()) {
        answers.collections.push({ collection: collPath.trim() });
        count++;
        const continueAdding = await question('Add another collection? (yes/no): ');
        if (continueAdding.toLowerCase() !== 'yes' && continueAdding.toLowerCase() !== 'y') {
          addMore = false;
        }
      } else {
        addMore = false;
      }
    }
  }

  // Question 3: Parallel execution
  const parallelAnswer = await question('Run collections in parallel? (yes/no, default: yes): ');
  answers.parallel = parallelAnswer.toLowerCase() !== 'no' && parallelAnswer.toLowerCase() !== 'n';

  // Question 4: Environment support
  const useEnv = await question('Use environment files? (yes/no, default: no): ');
  if (useEnv.toLowerCase() === 'yes' || useEnv.toLowerCase() === 'y') {
    answers.environmentsFolder = await question('Environments folder (default: ./environments): ');
    answers.environmentsFolder = answers.environmentsFolder.trim() || './environments';
  }

  // Question 5: Reporter configuration
  console.log('\n📊 Reporter options:');
  console.log('  1. cli (terminal output)');
  console.log('  2. json (results in JSON)');
  console.log('  3. html (HTML report)');
  const reporters = await question('Choose reporters (comma-separated, default: cli,json): ');
  answers.reporters = normalizeReporters(reporters, true);

  // Question 6: Output directory
  const outputDir = await question('Results output directory (default: ./results): ');
  answers.outputDir = outputDir.trim() || './results';

  rl.close();

  return answers;
}

async function generateConfigFromAnswers(answers) {
  const config = {
    collectionsFolder: answers.collectionsFolder,
    parallel: answers.parallel,
    reporters: normalizeReporters(answers.reporters, true),
    outputDir: answers.outputDir
  };

  if (answers.collections && answers.collections.length > 0) {
    config.collections = answers.collections;
  }

  if (answers.environmentsFolder) {
    config.environmentsFolder = answers.environmentsFolder;
  }

  return config;
}

async function saveConfig(config, outputPath = './config.json') {
  try {
    fs.writeFileSync(outputPath, JSON.stringify(config, null, 2));
    return { success: true, path: path.resolve(outputPath) };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = {
  interactiveSetup,
  generateConfigFromAnswers,
  saveConfig
};
