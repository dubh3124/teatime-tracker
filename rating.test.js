const { execSync } = require('child_process');
const fs = require('fs');
const persistence = require('./persistence');

describe('CLI Rating', () => {
    const dbPath = 'brews.json';

    beforeEach(() => {
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
        }
    });

    test('rate command updates an existing brew rating', () => {
        // First, record a brew to get an ID (or just rely on the first brew in persistence)
        execSync('node index.js log tea');
        const brewsBefore = persistence.loadBrews();
        const brewId = brewsBefore[0].timestamp; // Using timestamp as ID for now based on current structure

        // Rate the brew
        const output = execSync(`node index.js rate "${brewId}" 5`).toString();
        expect(output).toContain('Rated brew');

        const brewsAfter = persistence.loadBrews();
        expect(brewsAfter[0].rating).toBe(5);
    });

    test('rate command validates star range', () => {
        execSync('node index.js log tea');
        const brewsBefore = persistence.loadBrews();
        const brewId = brewsBefore[0].timestamp;

        try {
            execSync(`node index.js rate "${brewId}" 6`);
            fail('Should have failed for rating > 5');
        } catch (error) {
            expect(error.stderr.toString()).toContain('Rating must be between 1 and 5');
        }
    });
});
