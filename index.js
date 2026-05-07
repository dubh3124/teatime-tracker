const fs = require('fs');
const path = require('path');

const BREWS_FILE = path.join(__dirname, 'brews.json');

function logBrew(type, label) {
    const brew = {
        type,
        label,
        timestamp: new Date().toISOString()
    };
    
    let brews = [];
    if (fs.existsSync(BREWS_FILE)) {
        try {
            brews = JSON.parse(fs.readFileSync(BREWS_FILE, 'utf8'));
        } catch (e) {
            brews = [];
        }
    }
    
    brews.push(brew);
    fs.writeFileSync(BREWS_FILE, JSON.stringify(brews, null, 2));
    
    return brew;
}

module.exports = { logBrew };


