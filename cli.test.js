const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const persistence = require('./persistence');

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

  test('search command filters by type and displays results', () => {
    const brew1 = { type: 'tea', timestamp: '2023-10-01T10:00:00.000Z', rating: 4 };
    const brew2 = { type: 'coffee', timestamp: '2023-10-02T10:00:00.000Z', rating: 5 };
    
    persistence.saveBrew(brew1, dbPath);
    persistence.saveBrew(brew2, dbPath);

    const output = execSync(`BREW_DB=${dbPath} node index.js search --type=tea`).toString();
    expect(output).toContain('tea');
    expect(output).toContain('2023-10-01T10:00:00.000Z');
    expect(output).toContain('4');
    expect(output).not.toContain('coffee');
  });

  test('search command filters by date range', () => {
    const brew1 = { type: 'tea', timestamp: '2023-10-01T10:00:00.000Z' };
    const brew2 = { type: 'tea', timestamp: '2023-10-05T10:00:00.000Z' };
    
    persistence.saveBrew(brew1, dbPath);
    persistence.saveBrew(brew2, dbPath);

    const output = execSync(`BREW_DB=${dbPath} node index.js search --from=2023-10-01T00:00:00.000Z --to=2023-10-02T23:59:59.000Z`).toString();
    expect(output).toContain('2023-10-01T10:00:00.000Z');
    expect(output).not.toContain('2023-10-05T10:00:00.000Z');
  });
});
