const fs = require('fs');
const path = require('path');
const { logBrew } = require('./index');

const BREWS_FILE = path.join(__dirname, 'brews.json');

describe('teatime-tracker', () => {
    beforeEach(() => {
        if (fs.existsSync(BREWS_FILE)) {
            fs.unlinkSync(BREWS_FILE);
        }
    });

    test('logBrew(type, label) creates a brew entry with timestamp', () => {
        const brew = logBrew('tea', 'Earl Grey');
        expect(brew.type).toBe('tea');
        expect(brew.label).toBe('Earl Grey');
        expect(brew.timestamp).toBeDefined();
        expect(new Date(brew.timestamp).toString()).not.toBe('Invalid Date');
    });

    test('logBrew(type, label) persists brew to brews.json', () => {
        const type = 'Green';
        const label = 'Afternoon Tea';
        logBrew(type, label);

        expect(fs.existsSync(BREWS_FILE)).toBe(true);
        const brews = JSON.parse(fs.readFileSync(BREWS_FILE, 'utf8'));
        expect(brews).toHaveLength(1);
        expect(brews[0].type).toBe(type);
        expect(brews[0].label).toBe(label);
    });
});

