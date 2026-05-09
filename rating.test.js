const { execSync } = require('child_process');
const fs = require('fs');
const persistence = require('./persistence');

const path = require('path');

describe('CLI Rating', () => {
    const dbPath = path.join(__dirname, 'brews.json');

    beforeEach(() => {
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
        }
    });

    afterEach(() => {
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
        }
    });

    test('rate command updates an existing brew rating', () => {
        // First, record a brew to get an ID (or just rely on the first brew in persistence)
        execSync('node index.js log tea');
        const brewsBefore = persistence.loadBrews();
        const brewId = brewsBefore[brewsBefore.length - 1].timestamp;

        // Rate the brew
        const output = execSync(`node index.js rate "${brewId}" 5`).toString();
        expect(output).toContain(`Successfully rated brew ${brewId} with 5 stars`);

        const brewsAfter = persistence.loadBrews();
        expect(brewsAfter[brewsAfter.length - 1].rating).toBe(5);
    });

    test('rate command validates integer rating (must be an integer)', () => {
        execSync('node index.js log tea');
        const brewsBefore = persistence.loadBrews();
        const brewId = brewsBefore[brewsBefore.length - 1].timestamp;

        try {
            execSync(`node index.js rate "${brewId}" 4.5`, { stdio: 'pipe' });
            throw new Error('Should have failed for non-integer rating');
        } catch (error) {
            expect(error.stderr.toString()).toContain('Rating must be an integer between 1 and 5');
        }
    });

    test('rate command validates range (not too high)', () => {
        execSync('node index.js log tea');
        const brewsBefore = persistence.loadBrews();
        const brewId = brewsBefore[brewsBefore.length - 1].timestamp;

        try {
            execSync(`node index.js rate "${brewId}" 6`, { stdio: 'pipe' });
            throw new Error('Should have failed for rating > 5');
        } catch (error) {
            expect(error.stderr.toString()).toContain('Rating must be an integer between 1 and 5');
        }
    });

    test('rate command handles non-existent ID', () => {
        try {
            execSync('node index.js rate "non-existent-id" 5', { stdio: 'pipe' });
            throw new Error('Should have failed for non-existent ID');
        } catch (error) {
            expect(error.stderr.toString()).toContain('Brew with ID non-existent-id not found');
        }
    });
});
