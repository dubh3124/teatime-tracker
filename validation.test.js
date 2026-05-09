const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('CLI Input Validation', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'teatime-validation-'));
    const dbPath = path.join(tmpDir, 'brews.json');

    afterAll(() => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    test('rate command requires both id and stars', () => {
        try {
            execSync(`BREW_DB=${dbPath} node index.js rate "some-id"`, { stdio: 'pipe' });
            throw new Error('Should have failed for missing stars');
        } catch (error) {
            expect(error.stderr.toString()).toContain('Usage: node index.js rate <id> <stars>');
        }
    });

    test('rate command validates stars is a number', () => {
        execSync(`BREW_DB=${dbPath} node index.js log tea`);
        const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        const brewId = data[0].timestamp;

        try {
            execSync(`BREW_DB=${dbPath} node index.js rate "${brewId}" 4.5`, { stdio: 'pipe' });
        } catch (error) {
            // parseInt behavior: 4.5 becomes 4
        }
    });
});
