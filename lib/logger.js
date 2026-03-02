const levels = { error: 0, warn: 1, info: 2, debug: 3 };
let currentLevel = levels.info;

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

function supportsColor() {
  return Boolean(process.stdout && process.stdout.isTTY && !process.env.NO_COLOR);
}

function colorize(level, text) {
  if (!supportsColor()) return text;

  if (level === 'error') return `${colors.red}${text}${colors.reset}`;
  if (level === 'warn') return `${colors.yellow}${text}${colors.reset}`;
  if (level === 'debug') return `${colors.dim}${text}${colors.reset}`;
  return `${colors.cyan}${text}${colors.reset}`;
}

function setLevel(verbose) {
  currentLevel = verbose ? levels.debug : levels.info;
}

function log(level, ...args) {
  if (levels[level] <= currentLevel) {
    const fn = console[level] || console.log;
    fn(...args.map(arg => (typeof arg === 'string' ? colorize(level, arg) : arg)));
  }
}

module.exports = { setLevel, log, levels };
