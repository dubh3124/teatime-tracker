const { logBrew, getBrews, getDailySummary } = require('./index');

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

test('getDailySummary() returns count of brews by type for today', () => {
    // Clear brews for the test if possible or work with what we have
    // For now we add specific ones and check the counts
    logBrew('tea', 'Morning Breakfast');
    logBrew('coffee', 'Espresso');
    logBrew('tea', 'Oolong');
    
    const summary = getDailySummary();
    expect(summary).toHaveProperty('tea');
    expect(summary).toHaveProperty('coffee');
    expect(summary.tea).toBeGreaterThanOrEqual(2);
    expect(summary.coffee).toBeGreaterThanOrEqual(1);
});


