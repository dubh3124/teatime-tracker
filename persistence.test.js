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

  test('should save and retrieve rating field', () => {
    const brew = { type: 'Earl Grey', timestamp: new Date().toISOString(), rating: 5 };
    saveBrew(brew, testDbPath);
    const brews = loadBrews(testDbPath);
    expect(brews[0].rating).toBe(5);
  });

  test('should throw error for ratings outside 1-5 range', () => {
    const brewLow = { type: 'Earl Grey', timestamp: new Date().toISOString(), rating: 0 };
    const brewHigh = { type: 'Earl Grey', timestamp: new Date().toISOString(), rating: 6 };
    const brewInvalid = { type: 'Earl Grey', timestamp: new Date().toISOString(), rating: 'invalid' };

    expect(() => saveBrew(brewLow, testDbPath)).toThrow('Rating must be at least 1');
    expect(() => saveBrew(brewHigh, testDbPath)).toThrow('Rating must be at most 5');
    expect(() => saveBrew(brewInvalid, testDbPath)).toThrow('Rating must be a numeric value');
  });
});
