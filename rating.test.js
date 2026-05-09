const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const persistence = require('./persistence');

describe('CLI Rating', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'teatime-rating-'));
    const dbPath = path.join(tmpDir, 'brews.json');

    afterEach(() => {
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
        }
    });

    afterAll(() => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    test('rate command updates an existing brew rating', () => {
        execSync(`BREW_DB=${dbPath} node index.js log tea`);
        const brewsBefore = persistence.loadBrews(dbPath);
        const brewId = brewsBefore[brewsBefore.length - 1].timestamp;

        const output = execSync(`BREW_DB=${dbPath} node index.js rate "${brewId}" 5`).toString();
        expect(output).toContain(`Successfully rated brew ${brewId} with 5 stars`);

        const brewsAfter = persistence.loadBrews(dbPath);
        expect(brewsAfter[brewsAfter.length - 1].rating).toBe(5);
    });

    test('rate command validates integer rating (must be an integer)', () => {
        execSync(`BREW_DB=${dbPath} node index.js log tea`);
        const brewsBefore = persistence.loadBrews(dbPath);
        const brewId = brewsBefore[brewsBefore.length - 1].timestamp;

        try {
            execSync(`BREW_DB=${dbPath} node index.js rate "${brewId}" 4.5`, { stdio: 'pipe' });
            throw new Error('Should have failed for non-integer rating');
        } catch (error) {
            expect(error.stderr.toString()).toContain('Rating must be an integer between 1 and 5');
        }
    });

    test('rate command validates range (not too high)', () => {
        execSync(`BREW_DB=${dbPath} node index.js log tea`);
        const brewsBefore = persistence.loadBrews(dbPath);
        const brewId = brewsBefore[brewsBefore.length - 1].timestamp;

        try {
            execSync(`BREW_DB=${dbPath} node index.js rate "${brewId}" 6`, { stdio: 'pipe' });
            throw new Error('Should have failed for rating > 5');
        } catch (error) {
            expect(error.stderr.toString()).toContain('Rating must be an integer between 1 and 5');
        }
    });

    test('rate command handles non-existent ID', () => {
        try {
            execSync(`BREW_DB=${dbPath} node index.js rate "non-existent-id" 5`, { stdio: 'pipe' });
            throw new Error('Should have failed for non-existent ID');
        } catch (error) {
            expect(error.stderr.toString()).toContain('Brew with ID non-existent-id not found');
        }
    });
});
