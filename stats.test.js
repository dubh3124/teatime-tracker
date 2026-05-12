const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.resolve(__dirname, 'test_brews_stats.json');

describe('Brew Rating Statistics CLI', () => {
  beforeEach(() => {
    if (fs.existsSync(DB_PATH)) {
      fs.unlinkSync(DB_PATH);
    }
    process.env.BREW_DB = DB_PATH;
  });

  afterAll(() => {
    if (fs.existsSync(DB_PATH)) {
      fs.unlinkSync(DB_PATH);
    }
  });

  const runCLI = (args) => {
    try {
      return execSync(`node index.js ${args}`, { env: { ...process.env, BREW_DB: DB_PATH } }).toString();
    } catch (error) {
      return error.stdout.toString() + error.stderr.toString();
    }
  };

  test('calculates and displays average ratings grouped by tea type', () => {
    // Setup some data
    const brews = [
      { type: 'tea', label: 'Green', rating: 5, timestamp: '2023-10-01T10:00:00Z' },
      { type: 'tea', label: 'Black', rating: 3, timestamp: '2023-10-01T11:00:00Z' },
      { type: 'coffee', label: 'Espresso', rating: 4, timestamp: '2023-10-01T12:00:00Z' },
      { type: 'tea', label: 'Oolong', timestamp: '2023-10-01T13:00:00Z' }, // No rating
    ];
    fs.writeFileSync(DB_PATH, JSON.stringify(brews));

    const output = runCLI('stats');
    
    // Expected:
    // tea: 4.00 (2 ratings)
    // coffee: 4.00 (1 rating)
    expect(output).toContain('tea: 4.00');
    expect(output).toContain('coffee: 4.00');
  });

  test('handles cases where no ratings exist for a type', () => {
    const brews = [
      { type: 'tea', label: 'Green', timestamp: '2023-10-01T10:00:00Z' },
    ];
    fs.writeFileSync(DB_PATH, JSON.stringify(brews));

    const output = runCLI('stats');
    expect(output).toContain('tea: No ratings');
  });

  test('handles empty database', () => {
    const output = runCLI('stats');
    expect(output).toContain('No ratings recorded.');
  });
});
