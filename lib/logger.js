const levels = { error: 0, warn: 1, info: 2, debug: 3 };
let currentLevel = levels.info;

function setLevel(verbose) {
  currentLevel = verbose ? levels.debug : levels.info;
}

function log(level, ...args) {
  if (levels[level] <= currentLevel) {
    const fn = console[level] || console.log;
    fn(...args);
  }
}

module.exports = { setLevel, log, levels };
