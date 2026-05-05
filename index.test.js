const { sum } = require('./index');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

test('subtracts 5 - 2 to equal 3', () => {
  const { subtract } = require('./index');
  expect(subtract(5, 2)).toBe(3);
});
