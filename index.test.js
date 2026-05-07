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
    // We need to ensure we are testing clean state if possible, 
    // but the current index.js uses a global array.
    // Let's just check if it returns the expected counts for what we add.
    const startSummary = getDailySummary();
    const startTea = startSummary.tea || 0;
    const startCoffee = startSummary.coffee || 0;

    logBrew('tea', 'Morning Breakfast');
    logBrew('coffee', 'Espresso');
    logBrew('tea', 'Oolong');
    
    const summary = getDailySummary();
    expect(summary.tea).toBe(startTea + 2);
    expect(summary.coffee).toBe(startCoffee + 1);
});


