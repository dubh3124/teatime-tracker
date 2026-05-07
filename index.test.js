const { logBrew, getBrews } = require('./index');

test('logBrew(type, label) creates a brew entry with timestamp', () => {
  const brew = logBrew('tea', 'Earl Grey');
  expect(brew.type).toBe('tea');
  expect(brew.label).toBe('Earl Grey');
  expect(brew.timestamp).toBeDefined();
});

test('getBrews() returns all logged brews', () => {
    logBrew('tea', 'Green Tea');
    const logs = getBrews();
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[logs.length - 1].label).toBe('Green Tea');
});


