const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('CLI --help Output', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'teatime-help-'));
  const dbPath = path.join(tmpDir, 'brews.json');

  const runCLI = (args) => {
    try {
      return execSync(`node index.js ${args}`, {
        env: { ...process.env, BREW_DB: dbPath },
        timeout: 5000
      }).toString();
    } catch (error) {
      return (error.stdout ? error.stdout.toString() : '') + (error.stderr ? error.stderr.toString() : '');
    }
  };

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  // Helper: assert help output exists and contains expected text
  const assertHelpContains = (command, expectedTexts) => {
    const output = runCLI(command);
    expectedTexts.forEach(text => {
      expect(output).toContain(text);
    });
  };

  describe('root --help', () => {
    test('shows available commands and usage', () => {
      const output = runCLI('--help');
      expect(output).toContain('Usage:');
      expect(output).toContain('log');
      expect(output).toContain('summary');
      expect(output).toContain('rate');
      expect(output).toContain('search');
      expect(output).toContain('history');
      expect(output).toContain('delete');
      expect(output).toContain('stats');
      expect(output).toContain('verify');
    });
  });

  describe('log --help', () => {
    test('describes log command flags including rating value range', () => {
      const output = runCLI('log --help');
      expect(output).toContain('log');
      expect(output).toContain('type');
      expect(output).toContain('rating');
      expect(output).toContain('1-5');
      expect(output).toContain('Usage:');
    });
  });

  describe('rate --help', () => {
    test('describes rate command flags with star range', () => {
      const output = runCLI('rate --help');
      expect(output).toContain('rate');
      expect(output).toContain('id');
      expect(output).toContain('stars');
      expect(output).toContain('1-5');
      expect(output).toContain('Usage:');
    });
  });

  describe('search --help', () => {
    test('describes search flags with accepted values', () => {
      const output = runCLI('search --help');
      expect(output).toContain('search');
      expect(output).toContain('--from');
      expect(output).toContain('--to');
      expect(output).toContain('--type');
      expect(output).toContain('--query');
      expect(output).toContain('--rating');
      expect(output).toContain('--min-rating');
      expect(output).toContain('--sort');
      expect(output).toContain('1-5');
      expect(output).toContain('Usage:');
    });
  });

  describe('history --help', () => {
    test('describes history command flags (alias for search)', () => {
      const output = runCLI('history --help');
      expect(output).toContain('history');
      expect(output).toContain('--from');
      expect(output).toContain('--to');
      expect(output).toContain('--type');
      expect(output).toContain('Usage:');
    });
  });

  describe('delete --help', () => {
    test('describes delete command flags', () => {
      const output = runCLI('delete --help');
      expect(output).toContain('delete');
      expect(output).toContain('id');
      expect(output).toContain('--yes');
      expect(output).toContain('Usage:');
    });
  });

  describe('summary --help', () => {
    test('describes summary command', () => {
      const output = runCLI('summary --help');
      expect(output).toContain('summary');
      expect(output).toContain('daily');
      expect(output).toContain('Usage:');
    });
  });

  describe('stats --help', () => {
    test('describes stats command', () => {
      const output = runCLI('stats --help');
      expect(output).toContain('stats');
      expect(output).toContain('rating');
      expect(output).toContain('Usage:');
    });
  });

  describe('verify --help', () => {
    test('describes verify command', () => {
      const output = runCLI('verify --help');
      expect(output).toContain('verify');
      expect(output).toContain('rating');
      expect(output).toContain('Usage:');
    });
  });
});
