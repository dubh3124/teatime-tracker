const { execSync } = require('child_process');
const fs = require('fs');
const persistence = require('./persistence');

describe('CLI Rating', () => {
    test('rate command updates an existing brew rating', () => {
        const dbPathForTest = 'brews.json';
        if (fs.existsSync(dbPathForTest)) fs.unlinkSync(dbPathForTest);

        // First, record a brew to get an ID
        execSync('node index.js log tea');
        const brewsBefore = persistence.loadBrews();
        const brewId = brewsBefore[brewsBefore.length - 1].timestamp;

        // Rate the brew
        const output = execSync(`node index.js rate "${brewId}" 5`).toString();
        expect(output).toContain(`Successfully rated brew ${brewId} with 5 stars`);

        const brewsAfter = persistence.loadBrews();
        expect(brewsAfter[brewsAfter.length - 1].rating).toBe(5);
        
        if (fs.existsSync(dbPathForTest)) fs.unlinkSync(dbPathForTest);
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

    test('should allow rating at the time of recording', () => {
        const type = 'coffee';
        const rating = 5;
        const output = execSync(`node index.js log ${type} --rating=${rating}`).toString();
        expect(output).toContain(`Recorded ${type}`);
        
        // Verify it was saved with the rating
        const history = persistence.loadBrews();
        const lastBrew = history[history.length - 1];
        expect(lastBrew.type).toBe(type);
        expect(lastBrew.rating).toBe(rating);
    });

    test('should reject invalid rating at the time of recording', () => {
        try {
            execSync('node index.js log tea --rating=6', { stdio: 'pipe' });
            throw new Error('Should have thrown an error');
        } catch (error) {
            expect(error.stderr.toString()).toContain('Rating must be an integer between 1 and 5');
        }
    });
});
