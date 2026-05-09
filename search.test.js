const fs = require('fs');
const path = require('path');
const { searchHistory: searchHistoryCore } = require('./index');
const { saveBrew, searchHistory } = require('./persistence');

describe('Persistence Layer Search', () => {
  const testDbPath = path.join(__dirname, 'test-search-brews.json');

  const brew1 = { type: 'tea', label: 'Earl Grey', timestamp: '2023-10-01T10:00:00.000Z' };
  const brew2 = { type: 'coffee', label: 'Espresso', timestamp: '2023-10-02T10:00:00.000Z' };
  const brew3 = { type: 'tea', label: 'Green Tea', timestamp: '2023-10-03T10:00:00.000Z' };

  beforeEach(() => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
    saveBrew(brew1, testDbPath);
    saveBrew(brew2, testDbPath);
    saveBrew(brew3, testDbPath);
  });

  afterAll(() => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  test('should filter by date range', () => {
    const results = searchHistory({ 
      startDate: '2023-10-01T00:00:00.000Z', 
      endDate: '2023-10-02T23:59:59.999Z' 
    }, testDbPath);
    expect(results).toHaveLength(2);
    expect(results).toContainEqual(brew1);
    expect(results).toContainEqual(brew2);
  });

  test('should filter by tea type (exact match)', () => {
    const results = searchHistory({ type: 'tea' }, testDbPath);
    expect(results).toHaveLength(2);
    expect(results).toContainEqual(brew1);
    expect(results).toContainEqual(brew3);
  });

  test('should filter by tea type (partial match on label)', () => {
    const results = searchHistory({ query: 'Grey' }, testDbPath);
    expect(results).toHaveLength(1);
    expect(results[0].label).toBe('Earl Grey');
  });

  test('should handle case-insensitive partial match', () => {
    const results = searchHistory({ query: 'grey' }, testDbPath);
    expect(results).toHaveLength(1);
    expect(results[0].label).toBe('Earl Grey');
  });

  test('should filter by multiple criteria', () => {
    const results = searchHistory({ 
      startDate: '2023-10-01T00:00:00.000Z', 
      type: 'tea' 
    }, testDbPath);
    expect(results).toHaveLength(2);
    expect(results).toContainEqual(brew1);
    expect(results).toContainEqual(brew3);
  });
});

describe('End-to-End Search Logic', () => {
  const testDbPath = path.join(__dirname, 'brews.json'); 

  const brew1 = { type: 'tea', label: 'Earl Grey', timestamp: '2023-10-01T10:00:00.000Z' };

  beforeEach(() => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
    saveBrew(brew1, testDbPath);
  });

  test('should integrate with index.js searchHistory', () => {
    const results = searchHistoryCore({ type: 'tea' });
    expect(results).toHaveLength(1);
    expect(results[0].type).toBe('tea');
  });
});
