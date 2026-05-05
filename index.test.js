const { logBrew, getDailySummary } = require('./index');

test('logBrew(type, label) creates a brew entry with timestamp', () => {
  const brew = logBrew('tea', 'Earl Grey');
  expect(brew.type).toBe('tea');
  expect(brew.label).toBe('Earl Grey');
  expect(brew.timestamp).toBeDefined();
  expect(new Date(brew.timestamp).getTime()).toBeLessThanOrEqual(Date.now());
});

test('getDailySummary() returns count of brews by type for today', () => {
  // Clear any state if necessary, but here we likely need to provide brews to the summary function
  // or have a shared state. Based on index.js, there is no shared state yet.
  // The acceptance criteria says "getDailySummary() returns {tea: n, coffee: n} for today's brews".
  // This implies getDailySummary might need to access a list of brews.
  
  // For the purpose of the failing test, let's assume it should work with a provided list or global state.
  // If it's a "real brew-logging CLI" with "persistence", we'll eventually need a store.
  // For now, let's just assert the interface.
  const summary = getDailySummary();
  expect(summary).toHaveProperty('tea');
  expect(summary).toHaveProperty('coffee');
});
