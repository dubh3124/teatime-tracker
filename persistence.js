const fs = require('fs');
const path = require('path');

const DEFAULT_DB_PATH = path.resolve(__dirname, 'brews.json');

function getDbPath() {
  return process.env.BREW_DB || DEFAULT_DB_PATH;
}

function loadBrews(dbPath) {
  dbPath = dbPath || getDbPath();
  if (!fs.existsSync(dbPath)) {
    return [];
  }
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading brews:', error);
    return [];
  }
}

function saveBrew(brew, dbPath) {
  dbPath = dbPath || getDbPath();
  if (brew.rating !== undefined) {
    if (typeof brew.rating !== 'number' || !Number.isInteger(brew.rating) || brew.rating < 1 || brew.rating > 5) {
      throw new Error('Rating must be an integer between 1 and 5');
    }
  }
  const brews = loadBrews(dbPath);
  brews.push(brew);
  try {
    fs.writeFileSync(dbPath, JSON.stringify(brews, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving brew:', error);
  }
}

function updateBrewRating(id, rating, dbPath) {
  dbPath = dbPath || getDbPath();
  const stars = parseInt(rating, 10);
  
  if (isNaN(stars) || stars.toString() !== rating.toString() || stars < 1 || stars > 5) {
    throw new Error('Rating must be an integer between 1 and 5');
  }
  const brews = loadBrews(dbPath);
  const index = brews.findIndex(b => b.timestamp === id);
  if (index === -1) {
    throw new Error(`Brew with ID ${id} not found`);
  }
  brews[index].rating = stars;
  try {
    fs.writeFileSync(dbPath, JSON.stringify(brews, null, 2), 'utf8');
    return brews[index];
  } catch (error) {
    console.error('Error updating brew:', error);
    throw error;
  }
}

function searchHistory(filters = {}, dbPath) {
  dbPath = dbPath || getDbPath();
  const brews = loadBrews(dbPath);
  const filteredBrews = brews.filter(brew => {
    if (filters.startDate && brew.timestamp < filters.startDate) return false;
    if (filters.endDate && brew.timestamp > filters.endDate) return false;
    if (filters.type && brew.type !== filters.type) return false;
    if (filters.query) {
      const label = brew.label || '';
      if (!label.toLowerCase().includes(filters.query.toLowerCase())) return false;
    }
    if (filters.rating !== undefined && brew.rating !== parseInt(filters.rating, 10)) return false;
    if (filters.minRating !== undefined && (brew.rating === undefined || brew.rating < parseInt(filters.minRating, 10))) return false;
    return true;
  });

  const sort = filters.sort;
  if (sort) {
    filteredBrews.sort((a, b) => {
      if (sort === 'rating') {
        const ratingA = a.rating !== undefined ? a.rating : 0;
        const ratingB = b.rating !== undefined ? b.rating : 0;
        return ratingA - ratingB;
      } else if (sort === 'type') {
        return a.type.localeCompare(b.type);
      } else if (sort === 'date') {
        return b.timestamp.localeCompare(a.timestamp);
      }
      return 0;
    });
  } else {
    // Default: descending order by timestamp
    filteredBrews.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  return filteredBrews;
}

function exportToCsv(brews) {
  const header = 'timestamp,type,rating,label';
  const rows = brews.map(brew => {
    const timestamp = brew.timestamp || '';
    const type = brew.type || '';
    const rating = brew.rating !== undefined ? brew.rating : '';
    const label = brew.label || '';
    // simple csv escape (assuming no commas/quotes for now as per label usage)
    return `${timestamp},${type},${rating},"${label.replace(/"/g, '""')}"`;
  });
  return [header, ...rows].join('\n');
}

function deleteBrew(id, dbPath) {
  dbPath = dbPath || getDbPath();
  const brews = loadBrews(dbPath);
  const index = brews.findIndex(b => b.timestamp === id);
  if (index === -1) {
    throw new Error(`Brew with ID ${id} not found`);
  }
  const deleted = brews.splice(index, 1)[0];
  try {
    fs.writeFileSync(dbPath, JSON.stringify(brews, null, 2), 'utf8');
    return deleted;
  } catch (error) {
    console.error('Error deleting brew:', error);
    throw error;
  }
}

module.exports = {
  loadBrews,
  getHistory: loadBrews,
  saveBrew,
  updateBrewRating,
  deleteBrew,
  searchHistory,
  exportToCsv
};
