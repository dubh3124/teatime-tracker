const persistence = require('./persistence');

let brews = [];

const logBrew = (type, label, rating) => {
  if (type !== 'tea' && type !== 'coffee') {
    throw new Error(`Invalid brew type: ${type}`);
  }
  const brew = {
    type,
    label,
    timestamp: new Date().toISOString()
  };
  if (rating !== undefined) {
    const stars = parseInt(rating, 10);
    if (isNaN(stars) || stars < 1 || stars > 5) {
      throw new Error('Rating must be an integer between 1 and 5');
    }
    brew.rating = stars;
  }
  brews.push(brew);
  persistence.saveBrew(brew);
  return brew;
};

const getBrews = () => brews;

const getDailySummary = () => {
  const history = persistence.getHistory();
  const today = new Date().toISOString().split('T')[0];
  const summaryMap = {};

  history.forEach(brew => {
    const brewDate = brew.timestamp.split('T')[0];
    if (brewDate === today) {
      summaryMap[brew.type] = (summaryMap[brew.type] || 0) + 1;
    }
  });

  const types = Object.keys(summaryMap).sort();
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

const updateBrewRating = (id, rating) => {
  return persistence.updateBrewRating(id, rating);
};

module.exports = { logBrew, getBrews, getDailySummary, updateBrewRating };

if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'log') {
    const type = args[1];
    const rating = args[2];
    try {
      const brew = logBrew(type, undefined, rating);
      console.log(`Recorded ${brew.type} at ${brew.timestamp}${brew.rating ? ` with rating ${brew.rating}` : ''}`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  } else if (command === 'summary') {
    console.log(getDailySummary());
  } else if (command === 'rate') {
    const id = args[1];
    const stars = args[2];
    if (!id || !stars) {
      console.error('Usage: node index.js rate <id> <stars>');
      process.exit(1);
    }
    try {
      const brew = updateBrewRating(id, stars);
      console.log(`Successfully rated brew ${id} with ${brew.rating} stars`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  } else {
    console.error('Usage: node index.js <log|summary|rate> [args]');
    process.exit(1);
  }
}


