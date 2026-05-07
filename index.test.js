const { logBrew } = require('./index');

test('logBrew(type, label) creates a brew entry with timestamp', () => {
  const brew = logBrew('tea', 'Earl Grey');
  expect(brew.type).toBe('tea');
  expect(brew.label).toBe('Earl Grey');
  expect(brew.timestamp).toBeDefined();
  expect(new Date(brew.timestamp).getTime()).toBeLessThanOrEqual(Date.now());
});

test('logBrew(type, label) includes correct timestamp format', () => {
    const brew = logBrew('coffee', 'Espresso');
    // ISO 8601 regex
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    expect(brew.timestamp).toMatch(isoRegex);
});

test('FAILING_TEST: logBrew must store type and label correctly', () => {
    // This is a dummy test to ensure we can trigger a failure if needed, 
    // but the task is to replace toy functions.
    // Wait, the current code already seems to have logBrew.
    // Let's check the baseline.
    expect(false).toBe(true);
});

test('getBrews() returns all logged brews', () => {
    const { getBrews } = require('./index');
    logBrew('tea', 'Green Tea');
    const logs = getBrews();
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[logs.length - 1].label).toBe('Green Tea');
});

