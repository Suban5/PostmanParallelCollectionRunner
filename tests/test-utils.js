const fs = require('fs');
const path = require('path');
const os = require('os');
const assert = require('assert');
const { spawnSync } = require('child_process');
const { generateConfigFromAnswers } = require('../lib/interactive');

const repoRoot = path.resolve(__dirname, '..');
const nodeCmd = process.execPath;
const runJs = path.join(repoRoot, 'run.js');

function runCli(args, options = {}) {
  return spawnSync(nodeCmd, [runJs, ...args], {
    cwd: options.cwd || repoRoot,
    input: options.input,
    encoding: 'utf8'
  });
}

module.exports = {
  fs,
  path,
  os,
  assert,
  spawnSync,
  generateConfigFromAnswers,
  repoRoot,
  nodeCmd,
  runJs,
  runCli
};
