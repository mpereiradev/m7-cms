// PostToolUse hook: run Prettier on any .ts/.tsx file in the monorepo apps
// Uses __dirname so it works regardless of the shell's CWD
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const monoRoot = path.resolve(__dirname, '..', '..');

const chunks = [];
process.stdin.on('data', d => chunks.push(d));
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(Buffer.concat(chunks));
    const filePath = (input.tool_input || {}).file_path || '';

    if (!/\.(ts|tsx)$/.test(filePath)) return;

    const normalized = filePath.replace(/\\/g, '/');
    const appMatch = normalized.match(/apps\/(m7-cms-api|m7-cms-web)/);
    if (!appMatch) return;

    const binName = process.platform === 'win32' ? 'prettier.CMD' : 'prettier';
    const prettierBin = path.join(monoRoot, 'apps', appMatch[1], 'node_modules', '.bin', binName);
    if (!fs.existsSync(prettierBin)) return;

    execSync(`"${prettierBin}" --write "${filePath}"`, { stdio: 'inherit' });
  } catch (_) {
    // best-effort — never block Claude
  }
});
