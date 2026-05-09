const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('CLI Integration', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'teatime-cli-'));
  const dbPath = path.join(tmpDir, 'brews.json');

  beforeEach(() => {
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('log command records a brew', () => {
    const output = execSync(`BREW_DB=${dbPath} node index.js log tea`).toString();
    expect(output).toContain('Recorded tea');

    const brews = require('./persistence').loadBrews(dbPath);
    expect(brews.length).toBe(1);
    expect(brews[0].type).toBe('tea');
  });

  test('summary command displays daily report', () => {
    execSync(`BREW_DB=${dbPath} node index.js log tea`);
    execSync(`BREW_DB=${dbPath} node index.js log coffee`);
    execSync(`BREW_DB=${dbPath} node index.js log coffee`);

    const output = execSync(`BREW_DB=${dbPath} node index.js summary`).toString();
    expect(output).toContain('2 coffees, 1 tea');
  });
});
