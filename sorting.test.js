const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'teatime-sorting-'));
const DB_PATH = path.join(tmpDir, 'brews.json');

describe('History Sorting CLI', () => {
    beforeEach(() => {
        const initialData = [
            { type: 'tea', label: 'Earl Grey', timestamp: '2023-01-01T10:00:00.000Z', rating: 5 },
            { type: 'coffee', label: 'Espresso', timestamp: '2023-01-02T10:00:00.000Z', rating: 3 },
            { type: 'tea', label: 'Green Tea', timestamp: '2023-01-03T10:00:00.000Z', rating: 4 }
        ];
        fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
    });

    afterAll(() => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    test('default sort is date descending', () => {
        const output = execSync(`BREW_DB=${DB_PATH} node index.js history`).toString();
        const lines = output.split('\n').filter(line => line.includes('[2023-01-'));
        
        // Expected order: 2023-01-03, 2023-01-02, 2023-01-01
        expect(lines[0]).toContain('2023-01-03');
        expect(lines[1]).toContain('2023-01-02');
        expect(lines[2]).toContain('2023-01-01');
    });

    test('sorts by rating ascending (implied order check)', () => {
        // Technically AC just says "accepts a --sort flag (date, rating, or type)"
        // Usually sort flags imply ascending or have a default. Let's assume ascending for rating/type if not specified, 
        // but the AC says "Default sort is date descending".
        
        const output = execSync(`BREW_DB=${DB_PATH} node index.js history --sort=rating`).toString();
        const lines = output.split('\n').filter(line => line.includes('[2023-01-'));
        
        // Ratings: 3 (Espresso), 4 (Green Tea), 5 (Earl Grey)
        expect(lines[0]).toContain('Espresso');
        expect(lines[1]).toContain('Green Tea');
        expect(lines[2]).toContain('Earl Grey');
    });

    test('sorts by type', () => {
        const output = execSync(`BREW_DB=${DB_PATH} node index.js history --sort=type`).toString();
        const lines = output.split('\n').filter(line => line.includes('[2023-01-'));
        
        // Types: coffee, tea, tea
        expect(lines[0]).toContain('coffee');
        expect(lines[1]).toContain('tea');
        expect(lines[2]).toContain('tea');
    });

    test('sorts by date explicitly', () => {
        const output = execSync(`BREW_DB=${DB_PATH} node index.js history --sort=date`).toString();
        const lines = output.split('\n').filter(line => line.includes('[2023-01-'));
        
        // Default for date is descending as per AC
        expect(lines[0]).toContain('2023-01-03');
        expect(lines[1]).toContain('2023-01-02');
        expect(lines[2]).toContain('2023-01-01');
    });
});
