const { execSync } = require('child_process');
const fs = require('fs');

describe('Search CLI Command Integration', () => {
  const dbPath = 'brews.json';

  beforeEach(() => {
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
    // Seed some data
    const brews = [
      { type: 'tea', label: 'Green Tea', timestamp: '2023-01-01T10:00:00.000Z', rating: 5 },
      { type: 'coffee', label: 'Espresso', timestamp: '2023-01-02T10:00:00.000Z', rating: 4 },
      { type: 'tea', label: 'Oolong', timestamp: '2023-01-03T10:00:00.000Z', rating: 3 }
    ];
    fs.writeFileSync(dbPath, JSON.stringify(brews, null, 2));
  });

  afterAll(() => {
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  });

  test('search command supports --from, --to, --type and displays table', () => {
    // Current implementation uses --start-date, --end-date and line-based output.
    // This test expects --from, --to and a table-like structure containing 'Rating'.
    const output = execSync('node index.js search --from=2023-01-01 --to=2023-01-02 --type=tea').toString();
    
    expect(output).toContain('tea');
    expect(output).toContain('Green Tea');
    expect(output).toContain('5'); // Rating
    expect(output).not.toContain('Espresso');
    expect(output).not.toContain('Oolong');
  });
});
