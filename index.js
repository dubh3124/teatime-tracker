const persistence = require('./persistence');
const { validateRating } = require('./validation');

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
    const result = validateRating(rating);
    if (!result.valid) {
      throw new Error(result.message);
    }
    brew.rating = parseInt(rating, 10);
  }
  persistence.saveBrew(brew);
  return brew;
};

const getBrews = () => persistence.loadBrews();

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

const getRatingStats = () => {
  const history = persistence.getHistory();
  if (history.length === 0) {
    return 'No ratings recorded.';
  }

  const statsMap = {};
  history.forEach(brew => {
    if (!statsMap[brew.type]) {
      statsMap[brew.type] = { sum: 0, count: 0 };
    }
    if (brew.rating !== undefined) {
      statsMap[brew.type].sum += brew.rating;
      statsMap[brew.type].count += 1;
    }
  });

  const types = Object.keys(statsMap).sort();
  return types
    .map(type => {
      const stats = statsMap[type];
      if (stats.count === 0) {
        return `${type}: No ratings`;
      }
      const avg = (stats.sum / stats.count).toFixed(2);
      return `${type}: ${avg} (${stats.count} rating${stats.count === 1 ? '' : 's'})`;
    })
    .join('\n');
};

const updateBrewRating = (id, rating) => {
  return persistence.updateBrewRating(id, rating);
};

const searchHistory = (filters) => {
  return persistence.searchHistory(filters);
};

const deleteBrew = (id) => {
  return persistence.deleteBrew(id);
};

module.exports = { logBrew, getBrews, getDailySummary, getRatingStats, updateBrewRating, searchHistory, deleteBrew };

if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  // Startup verification: check existing history for invalid ratings
  if (command !== 'verify') {
    const startupReport = persistence.verifyHistory();
    if (!startupReport.valid) {
      console.error(`Warning: ${startupReport.issues.length} brew(s) in history have invalid ratings. Run 'node index.js verify' for details.`);
    }
  }

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
  } else if (command === 'stats') {
    console.log(getRatingStats());
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
  } else if (command === 'search' || command === 'history' || command === 'export') {
    const filters = {};
    if (command === 'export') filters.format = 'csv';
    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      if (arg.startsWith('--start-date=') || arg.startsWith('--from=')) filters.startDate = arg.split('=')[1];
      else if (arg.startsWith('--end-date=') || arg.startsWith('--to=')) filters.endDate = arg.split('=')[1];
      else if (arg.startsWith('--type=')) filters.type = arg.split('=')[1];
      else if (arg.startsWith('--query=')) filters.query = arg.split('=')[1];
      else if (arg.startsWith('--rating=')) filters.rating = arg.split('=')[1];
      else if (arg.startsWith('--min-rating=')) filters.minRating = arg.split('=')[1];
      else if (arg.startsWith('--format=')) filters.format = arg.split('=')[1];
      else if (arg.startsWith('--sort=')) filters.sort = arg.split('=')[1];
    }
    const results = searchHistory(filters);
    if (filters.format === 'csv') {
      console.log(persistence.exportToCsv(results));
    } else if (results.length === 0) {
      console.log('No brews found matching criteria.');
    } else {
      console.log('Results:');
      results.forEach(brew => {
        console.log(`[${brew.timestamp}] ${brew.type} (Rating: ${brew.rating !== undefined ? brew.rating : '-'}): ${brew.label || '-'}`);
      });
    }
  } else if (command === 'delete') {
    const id = args[1];
    const confirmed = args.includes('--yes') || args.includes('-y');
    if (!id) {
      console.error('Usage: node index.js delete <id> [--yes|-y]');
      process.exit(1);
    }
    if (!confirmed) {
      console.error('Confirmation required. Use --yes or -y to confirm deletion.');
      process.exit(1);
    }
    try {
      persistence.deleteBrew(id);
      console.log(`Deleted brew ${id}`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  } else if (command === 'verify') {
    const report = persistence.verifyHistory();
    if (report.valid) {
      console.log('All brews have valid ratings.');
    } else {
      console.error(`Found ${report.issues.length} brew(s) with invalid ratings:`);
      report.issues.forEach(issue => {
        console.error(`  [${issue.id}] ${issue.type} ${issue.label || ''} rating=${issue.rating}: ${issue.message}`);
      });
      process.exit(1);
    }
  } else {
    console.error('Usage: node index.js <log|summary|rate|search|history|delete> [args]');
    process.exit(1);
  }
}


