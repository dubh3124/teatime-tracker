const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'brews.json');

describe('CSV Export Integration', () => {
  beforeEach(() => {
    if (fs.existsSync(DB_FILE)) {
      fs.unlinkSync(DB_FILE);
    }
  });

  afterAll(() => {
    if (fs.existsSync(DB_FILE)) {
      fs.unlinkSync(DB_FILE);
    }
    if (fs.existsSync('export.csv')) {
      fs.unlinkSync('export.csv');
    }
  });

  test('User can export brew history to CSV using --format=csv', () => {
    // Record some brews
    execSync('node index.js log tea 5');
    execSync('node index.js log coffee 3');

    // Run search with csv format
    const output = execSync('node index.js search --format=csv').toString();

    // Check if output is a valid CSV
    const lines = output.trim().split('\n');
    expect(lines.length).toBe(3); // Header + 2 rows
    expect(lines[0]).toBe('timestamp,type,rating,label');
    
    // Default sort is now date descending. Latest is coffee.
    const row1 = lines[1].split(',');
    expect(row1[1]).toBe('coffee');
    expect(row1[2]).toBe('3');
    
    // Second data row is tea
    const row2 = lines[2].split(',');
    expect(row2[1]).toBe('tea');
    expect(row2[2]).toBe('5');
  });

  test('User can export brew history to CSV using export command', () => {
    // Record some brews
    execSync('node index.js log tea 5');
    execSync('node index.js log coffee 3');

    // Run export command
    const output = execSync('node index.js export').toString();

    const lines = output.trim().split('\n');
    expect(lines[0]).toBe('timestamp,type,rating,label');
    expect(lines.length).toBe(3);
  });

  test('User can export brew history to CSV using --format=csv with filters', () => {
    // Record some brews
    execSync('node index.js log tea 5');
    execSync('node index.js log coffee 3');

    // Run search with filter and csv format
    const output = execSync('node index.js search --type=tea --format=csv').toString();

    const lines = output.trim().split('\n');
    expect(lines.length).toBe(2); // Header + 1 row
    expect(lines[0]).toBe('timestamp,type,rating,label');
    expect(lines[1]).toContain('tea');
    expect(lines[1]).toContain('5');
    expect(lines[1]).not.toContain('coffee');
  });
});
