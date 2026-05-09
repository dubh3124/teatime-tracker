const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('Search CLI Command Integration', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'teatime-search-'));
  const dbPath = path.join(tmpDir, 'brews.json');

  beforeEach(() => {
    const brews = [
      { type: 'tea', label: 'Green Tea', timestamp: '2023-01-01T10:00:00.000Z', rating: 5 },
      { type: 'coffee', label: 'Espresso', timestamp: '2023-01-02T10:00:00.000Z', rating: 4 },
      { type: 'tea', label: 'Oolong', timestamp: '2023-01-03T10:00:00.000Z', rating: 3 }
    ];
    fs.writeFileSync(dbPath, JSON.stringify(brews, null, 2));
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('history command supports --from, --to, --type and displays table', () => {
    const output = execSync(`BREW_DB=${dbPath} node index.js history --from=2023-01-01 --to=2023-01-01T23:59:59 --type=tea`).toString();

    expect(output).toContain('tea');
    expect(output).toContain('Green Tea');
    expect(output).toContain('5');
    expect(output).not.toContain('Espresso');
    expect(output).not.toContain('Oolong');
  });

  test('search command (alias for history) supports flags', () => {
    const output = execSync(`BREW_DB=${dbPath} node index.js search --from=2023-01-01 --to=2023-01-01T23:59:59 --type=tea`).toString();

    expect(output).toContain('tea');
    expect(output).toContain('Green Tea');
    expect(output).toContain('5');
  });
});
