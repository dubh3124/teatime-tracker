const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

describe('Search CLI Command Integration', () => {
  const dbPath = 'brews.json';

  beforeEach(() => {
    const fullPath = path.resolve(process.cwd(), dbPath);
    console.log('DEBUG: Seeding path ' + fullPath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
    // Seed some data
    const brews = [
      { type: 'tea', label: 'Green Tea', timestamp: '2023-01-01T10:00:00.000Z', rating: 5 },
      { type: 'coffee', label: 'Espresso', timestamp: '2023-01-02T10:00:00.000Z', rating: 4 },
      { type: 'tea', label: 'Oolong', timestamp: '2023-01-03T10:00:00.000Z', rating: 3 }
    ];
    fs.writeFileSync(fullPath, JSON.stringify(brews, null, 2));
  });

  afterAll(() => {
    const fullPath = path.resolve(process.cwd(), dbPath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  });

  test('search command supports --from, --to, --type and displays table', () => {
    const output = execSync('node index.js search --from=2023-01-01 --to=2023-01-01T23:59:59 --type=tea').toString();
    
    expect(output).toContain('tea');
    expect(output).toContain('Green Tea');
    expect(output).toContain('5'); // Rating
    expect(output).not.toContain('Espresso');
    expect(output).not.toContain('Oolong');
  });
});
