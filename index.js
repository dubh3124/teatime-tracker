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
  const today = new Date().toISOString().split('T')[0];
  const summary = {
    tea: 0,
    coffee: 0
  };

  brews.forEach(brew => {
    const brewDate = brew.timestamp.split('T')[0];
    if (brewDate === today) {
      if (summary.hasOwnProperty(brew.type)) {
        summary[brew.type]++;
      }
    }
  });

  return summary;
};

module.exports = { logBrew, getBrews, getDailySummary };

