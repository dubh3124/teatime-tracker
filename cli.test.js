const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const persistence = require('./persistence');

describe('CLI Integration', () => {
  const dbPath = 'brews.json';

  beforeEach(() => {
    const fullPath = path.resolve(__dirname, dbPath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  });

  test('log command records a brew', () => {
    const output = execSync('node index.js log tea').toString();
    expect(output).toContain('Recorded tea');
    
    const brews = persistence.loadBrews();
    expect(brews.length).toBe(1);
    expect(brews[0].type).toBe('tea');
  });

  test('summary command displays daily report', () => {
    execSync('node index.js log tea');
    execSync('node index.js log coffee');
    execSync('node index.js log coffee');

    const output = execSync('node index.js summary').toString();
    expect(output).toContain('2 coffees, 1 tea');
  });
});
