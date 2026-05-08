const fs = require('fs');
const path = require('path');
const { saveBrew, loadBrews } = require('./persistence');

describe('Persistence Layer', () => {
  const testDbPath = path.join(__dirname, 'test-brews.json');

  beforeEach(() => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  afterAll(() => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  test('should save and load a brew object', () => {
    const brew = { type: 'Earl Grey', timestamp: new Date().toISOString() };
    saveBrew(brew, testDbPath);
    const brews = loadBrews(testDbPath);
    expect(brews).toHaveLength(1);
    expect(brews[0]).toEqual(brew);
  });

  test('should load empty array if file does not exist', () => {
    const brews = loadBrews(testDbPath);
    expect(brews).toEqual([]);
  });

  test('should append brews to existing history', () => {
    const brew1 = { type: 'Green Tea', timestamp: '2023-10-01T10:00:00Z' };
    const brew2 = { type: 'Oolong', timestamp: '2023-10-01T11:00:00Z' };
    
    saveBrew(brew1, testDbPath);
    saveBrew(brew2, testDbPath);
    
    const brews = loadBrews(testDbPath);
    expect(brews).toHaveLength(2);
    expect(brews).toEqual([brew1, brew2]);
  });
});
