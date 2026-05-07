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

module.exports = { logBrew };

