const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('Delete Brew Feature', () => {
  describe('Persistence Layer - deleteBrew', () => {
    const { saveBrew, loadBrews, deleteBrew } = require('./persistence');
    const testDbPath = path.join(__dirname, 'test-delete-brews.json');

    beforeEach(() => {
      if (fs.existsSync(testDbPath)) {
        fs.unlinkSync(testDbPath);
      }
    });

    afterAll(() => {
      if (fs.existsSync(testDbPath)) {
        fs.unlinkSync(testDbPath);
      }
    });

    test('should delete a brew by ID (timestamp) and remove it from storage', () => {
      const brew1 = { type: 'tea', label: 'Green', timestamp: '2023-10-01T10:00:00Z' };
      const brew2 = { type: 'coffee', label: 'Espresso', timestamp: '2023-10-01T11:00:00Z' };
      saveBrew(brew1, testDbPath);
      saveBrew(brew2, testDbPath);

      const deleted = deleteBrew('2023-10-01T10:00:00Z', testDbPath);

      expect(deleted).toEqual(brew1);
      const brews = loadBrews(testDbPath);
      expect(brews).toHaveLength(1);
      expect(brews[0]).toEqual(brew2);
    });

    test('should throw error when brew ID is not found', () => {
      const brew = { type: 'tea', label: 'Green', timestamp: '2023-10-01T10:00:00Z' };
      saveBrew(brew, testDbPath);

      expect(() => deleteBrew('nonexistent-id', testDbPath)).toThrow('Brew with ID nonexistent-id not found');
    });
  });

  describe('CLI Integration - delete command', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'teatime-delete-'));
    const dbPath = path.join(tmpDir, 'brews.json');

    const runCLI = (args) => {
      try {
        return execSync(`node index.js ${args}`, { env: { ...process.env, BREW_DB: dbPath } }).toString();
      } catch (error) {
        return error.stdout ? error.stdout.toString() + error.stderr.toString() : error.message;
      }
    };

    beforeEach(() => {
      if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
      }
    });

    afterAll(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    test('delete command with --yes flag removes a brew record by ID', () => {
      // Record a brew first
      const logOutput = runCLI('log tea');
      expect(logOutput).toContain('Recorded tea');

      // Get the brews to find the ID
      const brews = require('./persistence').loadBrews(dbPath);
      expect(brews.length).toBe(1);
      const brewId = brews[0].timestamp;

      // Delete the brew
      const deleteOutput = runCLI(`delete ${brewId} --yes`);
      expect(deleteOutput).toContain('Deleted brew');

      // Verify it's gone from storage
      const remainingBrews = require('./persistence').loadBrews(dbPath);
      expect(remainingBrews.length).toBe(0);
    });

    test('delete command without confirmation flag prompts for confirmation', () => {
      // Record a brew first
      runCLI('log tea');
      const brews = require('./persistence').loadBrews(dbPath);
      const brewId = brews[0].timestamp;

      // Try to delete without --yes (should fail due to no confirmation)
      const deleteOutput = runCLI(`delete ${brewId}`);
      expect(deleteOutput).toContain('Confirmation required');

      // Verify the brew still exists
      const remainingBrews = require('./persistence').loadBrews(dbPath);
      expect(remainingBrews.length).toBe(1);
    });

    test('stats reflect removal after deletion', () => {
      // Record some brews with ratings for stats
      runCLI('log tea 5');
      runCLI('log coffee 3');

      const brews = require('./persistence').loadBrews(dbPath);
      expect(brews.length).toBe(2);

      // Stats before deletion
      const statsBefore = runCLI('stats');
      expect(statsBefore).toContain('tea:');
      expect(statsBefore).toContain('coffee:');

      // Delete the tea
      const teaId = brews.find(b => b.type === 'tea').timestamp;
      runCLI(`delete ${teaId} --yes`);

      // Stats after deletion
      const statsAfter = runCLI('stats');
      expect(statsAfter).not.toContain('tea:');
      expect(statsAfter).toContain('coffee:');
    });

    test('delete command with invalid ID shows error', () => {
      const output = runCLI('delete nonexistent-id --yes');
      expect(output).toContain('not found');
    });
  });
});
