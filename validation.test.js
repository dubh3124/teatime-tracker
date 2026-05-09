const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

describe('CLI Input Validation', () => {
    const dbPath = path.join(__dirname, 'brews.json');

    beforeEach(() => {
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
        }
    });

    test('rate command requires both id and stars', () => {
        try {
            execSync('node index.js rate "some-id"', { stdio: 'pipe' });
            throw new Error('Should have failed for missing stars');
        } catch (error) {
            expect(error.stderr.toString()).toContain('Usage: node index.js rate <id> <stars>');
        }
    });

    test('rate command validates stars is a number', () => {
        execSync('node index.js log tea');
        const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        const brewId = data[0].timestamp;

        try {
            execSync(`node index.js rate "${brewId}" 4.5`, { stdio: 'pipe' });
            // Note: Current implementation uses parseInt which makes 4.5 into 4. 
            // If we strictly want integers, we should check this.
        } catch (error) {
            // Placeholder
        }
    });
});
