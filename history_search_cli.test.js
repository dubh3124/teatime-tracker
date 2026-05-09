const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'brews.json');

describe('History Search CLI', () => {
    beforeEach(() => {
        const initialData = [
            { type: 'tea', label: 'Earl Grey', timestamp: '2023-01-01T10:00:00.000Z', rating: 5 },
            { type: 'coffee', label: 'Espresso', timestamp: '2023-01-02T10:00:00.000Z', rating: 4 },
            { type: 'tea', label: 'Green Tea', timestamp: '2023-01-03T10:00:00.000Z' }
        ];
        fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
    });

    afterAll(() => {
        if (fs.existsSync(DB_PATH)) {
            fs.unlinkSync(DB_PATH);
        }
    });

    test('supports --from, --to, and --type flags', () => {
        // Based on AC, let's aim for 'history' command as requested.
        
        const output = execSync('node index.js history --from=2023-01-01 --to=2023-01-02 --type=tea').toString();
        
        expect(output).toContain('2023-01-01');
        expect(output).toContain('tea');
        expect(output).toContain('Earl Grey');
        expect(output).toContain('5'); // rating
        
        expect(output).not.toContain('Espresso');
        expect(output).not.toContain('Green Tea');
    });

    test('history command displays table including rating', () => {
        const output = execSync('node index.js history --type=coffee').toString();
        expect(output).toContain('Espresso');
        expect(output).toContain('4');
    });
});
