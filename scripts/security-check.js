const fs = require('fs');
const path = require('path');

const pkRegex = /(?:private_key|privatekey|secret|apikey|api_key)\s*[:=]\s*['"][0-9a-zA-Z_.-]{20,}['"]/i;
let knownSecret = '';
let knownApiKey = '';
if (fs.existsSync('.env.local')) {
  const envText = fs.readFileSync('.env.local', 'utf8');
  const secretMatch = envText.match(/BACKEND_PRIVATE_KEY=(.*)/);
  if (secretMatch) knownSecret = secretMatch[1].trim();
  const apiMatch = envText.match(/AI_API_KEY=(.*)/);
  if (apiMatch) knownApiKey = apiMatch[1].trim();
}

let violations = 0;

function scan(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules', '.next', '.git', 'out', 'dist', 'cache', 'artifacts'].includes(e.name)) continue;
      scan(full);
    } else {
      if (e.name.startsWith('.env.local')) continue;
      try {
        const content = fs.readFileSync(full, 'utf8');
        if (content.includes(knownSecret) || content.includes(knownApiKey)) {
          console.error('[SECURITY LEAK] Known secret found in:', full);
          violations++;
        }
        const match = content.match(pkRegex);
        if (match && !full.includes('.env.example')) {
          console.warn('[POTENTIAL CREDENTIAL] Found in:', full, '->', match[0]);
        }
      } catch (err) {}
    }
  }
}

scan('.');
if (violations === 0) {
  console.log('✓ SECURITY AUDIT PASSED: Zero secret leaks detected.');
} else {
  console.error(`✕ FAILED: ${violations} secret leak(s) found!`);
  process.exit(1);
}
