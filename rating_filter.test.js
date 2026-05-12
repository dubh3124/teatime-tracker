const { searchHistory } = require('./persistence');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

describe('Rating Filter Acceptance Tests', () => {
    const dbPath = path.resolve(__dirname, 'test_brews_rating.json');

    beforeEach(() => {
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
        }
        const initialData = [
            { type: 'tea', label: 'Green Tea', rating: 5, timestamp: '2023-01-01T10:00:00.000Z' },
            { type: 'coffee', label: 'Espresso', rating: 3, timestamp: '2023-01-02T10:00:00.000Z' },
            { type: 'tea', label: 'Oolong', rating: 4, timestamp: '2023-01-03T10:00:00.000Z' },
            { type: 'coffee', label: 'Latte', timestamp: '2023-01-04T10:00:00.000Z' } // No rating
        ];
        fs.writeFileSync(dbPath, JSON.stringify(initialData));
        process.env.BREW_DB = dbPath;
    });

    afterAll(() => {
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
        }
        delete process.env.BREW_DB;
    });

    test('persistence.searchHistory should filter by exact rating', () => {
        const results = searchHistory({ rating: 5 });
        expect(results).toHaveLength(1);
        expect(results[0].label).toBe('Green Tea');
    });

    test('persistence.searchHistory should filter by min-rating', () => {
        const results = searchHistory({ minRating: 4 });
        expect(results).toHaveLength(2); // Green Tea (5) and Oolong (4)
        const labels = results.map(r => r.label);
        expect(labels).toContain('Green Tea');
        expect(labels).toContain('Oolong');
    });

    test('CLI history command should accept --rating flag', () => {
        const output = execSync(`BREW_DB=${dbPath} node index.js history --rating=3`).toString();
        expect(output).toContain('Espresso');
        expect(output).not.toContain('Green Tea');
        expect(output).not.toContain('Oolong');
    });

    test('CLI search command should accept --min-rating flag', () => {
        const output = execSync(`BREW_DB=${dbPath} node index.js search --min-rating=4`).toString();
        expect(output).toContain('Green Tea');
        expect(output).toContain('Oolong');
        expect(output).not.toContain('Espresso');
    });
});
