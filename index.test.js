const { logBrew } = require('./index');

test('logBrew(type, label) creates a brew entry with timestamp', () => {
  const brew = logBrew('tea', 'Earl Grey');
  expect(brew.type).toBe('tea');
  expect(brew.label).toBe('Earl Grey');
  expect(brew.timestamp).toBeDefined();
  expect(new Date(brew.timestamp).getTime()).toBeLessThanOrEqual(Date.now());
});
