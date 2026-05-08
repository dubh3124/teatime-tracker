const persistence = require('./persistence');

let brews = [];

const logBrew = (type, label) => {
  if (type !== 'tea' && type !== 'coffee') {
    throw new Error(`Invalid brew type: ${type}`);
  }
  const brew = {
    type,
    label,
    timestamp: new Date().toISOString()
  };
  brews.push(brew);
  persistence.saveBrew(brew);
  return brew;
};

const getBrews = () => brews;

const getDailySummary = () => {
  const history = persistence.loadBrews();
  const today = new Date().toISOString().split('T')[0];
  const summaryMap = {};

  history.forEach(brew => {
    const brewDate = brew.timestamp.split('T')[0];
    if (brewDate === today) {
      summaryMap[brew.type] = (summaryMap[brew.type] || 0) + 1;
    }
  });

  const types = Object.keys(summaryMap).sort().reverse();
  if (types.length === 0) {
    return 'No brews recorded for today.';
  }

  return types
    .map(type => {
      const count = summaryMap[type];
      const pluralType = count === 1 ? type : (type === 'coffee' ? 'coffees' : 'teas');
      return `${count} ${pluralType}`;
    })
    .join(', ');
};

module.exports = { logBrew, getBrews, getDailySummary };

