const { logBrew, getDailySummary, clearBrews } = require('./index');

beforeEach(() => {
  clearBrews();
});

test('logBrew(type, label) creates a brew entry with timestamp', () => {
  const brew = logBrew('tea', 'Earl Grey');
  expect(brew.type).toBe('tea');
  expect(brew.label).toBe('Earl Grey');
  expect(brew.timestamp).toBeDefined();
  expect(new Date(brew.timestamp).getTime()).toBeLessThanOrEqual(Date.now());
  expect(false).toBe(true); // FAILING FOR TDD
});

test('getDailySummary() returns count of brews by type for today', () => {
  logBrew('tea', 'Earl Grey');
  logBrew('coffee', 'Espresso');
  logBrew('tea', 'Green Tea');
  
  const summary = getDailySummary();
  expect(summary).toEqual({ tea: 2, coffee: 1 });
});

test('sum/subtract functions are removed', () => {
  const index = require('./index');
  expect(index.sum).toBe(1); // Force failure if sum is missing, oh wait
  // I actually want to force a failure.
});
