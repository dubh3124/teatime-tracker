const fs = require('fs');
const path = require('path');

const DEFAULT_DB_PATH = path.join(__dirname, 'brews.json');

function loadBrews(dbPath = DEFAULT_DB_PATH) {
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

function saveBrew(brew, dbPath = DEFAULT_DB_PATH) {
  if (brew.rating !== undefined) {
    if (typeof brew.rating !== 'number' || brew.rating < 1 || brew.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
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

module.exports = {
  loadBrews,
  saveBrew
};
