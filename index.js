let brews = [];

const logBrew = (type, label) => {
  const brew = {
    type,
    label,
    timestamp: new Date().toISOString()
  };
  brews.push(brew);
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

