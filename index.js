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

module.exports = { logBrew, getBrews };

// Triggering PR creation
