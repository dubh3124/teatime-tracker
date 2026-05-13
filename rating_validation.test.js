const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Acceptance Criterion 1 & 2: Centralized validation logic with user-friendly messages
describe('Centralized Rating Validation', () => {
  const validation = require('./validation');

  describe('validateRating', () => {
    test('should exist as a standalone, centralized validation function', () => {
      expect(validation.validateRating).toBeDefined();
      expect(typeof validation.validateRating).toBe('function');
    });

    test('should return { valid: true } for valid integer ratings 1-5', () => {
      for (let r = 1; r <= 5; r++) {
        expect(validation.validateRating(r)).toEqual({ valid: true });
      }
    });

    test('should return { valid: true } for valid string ratings "1"-"5"', () => {
      for (let r = 1; r <= 5; r++) {
        expect(validation.validateRating(String(r))).toEqual({ valid: true });
      }
    });

    test('should return { valid: false, message } for non-integer ratings', () => {
      const result = validation.validateRating(4.5);
      expect(result.valid).toBe(false);
      expect(result.message).toBeDefined();
      expect(typeof result.message).toBe('string');
      expect(result.message.length).toBeGreaterThan(0);
      expect(result.message.toLowerCase()).toMatch(/rating|between|integer/);
    });

    test('should return { valid: false, message } for ratings below 1', () => {
      const result = validation.validateRating(0);
      expect(result.valid).toBe(false);
      expect(result.message).toBeDefined();
      expect(result.message.toLowerCase()).toMatch(/rating|between|1.*5|range/);
    });

    test('should return { valid: false, message } for ratings above 5', () => {
      const result = validation.validateRating(6);
      expect(result.valid).toBe(false);
      expect(result.message).toBeDefined();
      expect(result.message.toLowerCase()).toMatch(/rating|between|1.*5|range/);
    });

    test('should return { valid: false, message } for non-numeric string ratings', () => {
      const result = validation.validateRating('bad');
      expect(result.valid).toBe(false);
      expect(result.message).toBeDefined();
      expect(result.message.toLowerCase()).toMatch(/rating|between|integer|number/);
    });

    test('should return { valid: false, message } for undefined rating', () => {
      const result = validation.validateRating(undefined);
      expect(result.valid).toBe(false);
      expect(result.message).toBeDefined();
    });

    test('should return { valid: false, message } for null rating', () => {
      const result = validation.validateRating(null);
      expect(result.valid).toBe(false);
      expect(result.message).toBeDefined();
    });

    test('should return user-friendly error messages that explain what is expected', () => {
      const result = validation.validateRating(99);
      expect(result.message).toBeDefined();
      // Message should be helpful - mention valid range and integer requirement
      expect(result.message.length).toBeGreaterThan(10);
      expect(result.message).not.toMatch(/^\s*$/); // not blank
    });

    test('should produce distinct, context-specific error messages for different failure modes', () => {
      const undefinedResult = validation.validateRating(undefined);
      const nullResult = validation.validateRating(null);
      const nonNumericResult = validation.validateRating('bad');
      const floatResult = validation.validateRating(4.5);
      const tooLowResult = validation.validateRating(0);
      const tooHighResult = validation.validateRating(6);

      // Each failure type should have a distinct message tailored to the specific problem
      const messages = new Set([
        undefinedResult.message,
        nullResult.message,
        nonNumericResult.message,
        floatResult.message,
        tooLowResult.message,
        tooHighResult.message
      ]);

      // At least 3 distinct messages among 6 failure modes
      expect(messages.size).toBeGreaterThanOrEqual(3);

      // Messages must reference what the user got wrong
      expect(tooHighResult.message.toLowerCase()).toMatch(/5/);
      expect(tooLowResult.message.toLowerCase()).toMatch(/1/);
      expect(floatResult.message.toLowerCase()).toMatch(/whole|integer/);
      expect(nonNumericResult.message.toLowerCase()).toMatch(/number|numeric/);
    });
  });

  describe('isValidRating', () => {
    test('should exist as a convenience boolean checker', () => {
      expect(validation.isValidRating).toBeDefined();
      expect(typeof validation.isValidRating).toBe('function');
    });

    test('should return true for valid ratings', () => {
      expect(validation.isValidRating(3)).toBe(true);
      expect(validation.isValidRating('5')).toBe(true);
    });

    test('should return false for invalid ratings', () => {
      expect(validation.isValidRating(0)).toBe(false);
      expect(validation.isValidRating(6)).toBe(false);
      expect(validation.isValidRating(4.5)).toBe(false);
      expect(validation.isValidRating('bad')).toBe(false);
    });
  });
});

// Acceptance Criterion 3: Verify command checks existing history for invalid data
describe('Verify Command - History Integrity Check', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'teatime-verify-'));
  const dbPath = path.join(tmpDir, 'brews.json');

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('verify command should report "All brews have valid ratings" when data is clean', () => {
    // Create a clean data file with valid ratings
    const cleanData = [
      { type: 'tea', label: 'Green', rating: 5, timestamp: '2023-01-01T10:00:00.000Z' },
      { type: 'coffee', label: 'Espresso', rating: 3, timestamp: '2023-01-02T10:00:00.000Z' },
      { type: 'tea', label: 'Oolong', timestamp: '2023-01-03T10:00:00.000Z' } // No rating is fine
    ];
    fs.writeFileSync(dbPath, JSON.stringify(cleanData));

    const output = execSync(`BREW_DB=${dbPath} node index.js verify`, { stdio: 'pipe' }).toString();
    expect(output.toLowerCase()).toMatch(/valid|clean|ok|no issues|all/);
  });

  test('verify command should detect and report brews with invalid ratings (e.g., rating: 0)', () => {
    const badData = [
      { type: 'tea', label: 'Green', rating: 5, timestamp: '2023-01-01T10:00:00.000Z' },
      { type: 'coffee', label: 'Bad Brew', rating: 0, timestamp: '2023-01-02T10:00:00.000Z' },
      { type: 'tea', label: 'Oolong', rating: 3, timestamp: '2023-01-03T10:00:00.000Z' }
    ];
    fs.writeFileSync(dbPath, JSON.stringify(badData));

    try {
      execSync(`BREW_DB=${dbPath} node index.js verify`, { stdio: 'pipe' });
      throw new Error('Should have exited with code 1');
    } catch (error) {
      const output = error.stderr ? error.stderr.toString() : error.stdout.toString();
      expect(output).toContain('Bad Brew');
      expect(output.toLowerCase()).toMatch(/invalid|issue|problem|error|found/);
    }
  });

  test('verify command should detect brews with ratings above 5', () => {
    const badData = [
      { type: 'tea', label: 'Overrated', rating: 10, timestamp: '2023-01-01T10:00:00.000Z' }
    ];
    fs.writeFileSync(dbPath, JSON.stringify(badData));

    try {
      execSync(`BREW_DB=${dbPath} node index.js verify`, { stdio: 'pipe' });
      throw new Error('Should have exited with code 1');
    } catch (error) {
      const output = error.stderr ? error.stderr.toString() : error.stdout.toString();
      expect(output).toContain('Overrated');
      expect(output.toLowerCase()).toMatch(/invalid|issue|problem|error|found/);
    }
  });

  test('verify command should detect non-integer ratings in existing data', () => {
    const badData = [
      { type: 'coffee', label: 'Fractional', rating: 3.5, timestamp: '2023-01-01T10:00:00.000Z' }
    ];
    fs.writeFileSync(dbPath, JSON.stringify(badData));

    try {
      execSync(`BREW_DB=${dbPath} node index.js verify`, { stdio: 'pipe' });
      throw new Error('Should have exited with code 1');
    } catch (error) {
      const output = error.stderr ? error.stderr.toString() : error.stdout.toString();
      expect(output).toContain('Fractional');
      expect(output.toLowerCase()).toMatch(/invalid|issue|problem|error|found/);
    }
  });

  test('verify command should exit with code 0 when no issues found', () => {
    const cleanData = [
      { type: 'tea', label: 'Green', rating: 4, timestamp: '2023-01-01T10:00:00.000Z' }
    ];
    fs.writeFileSync(dbPath, JSON.stringify(cleanData));

    const result = execSync(`BREW_DB=${dbPath} node index.js verify`, { stdio: 'pipe' });
    // execSync would throw if exit code != 0, so reaching here means exit 0
    expect(result).toBeDefined();
  });

  test('verify command should exit with code 1 when issues are found', () => {
    const badData = [
      { type: 'tea', label: 'Bad', rating: 7, timestamp: '2023-01-01T10:00:00.000Z' }
    ];
    fs.writeFileSync(dbPath, JSON.stringify(badData));

    try {
      execSync(`BREW_DB=${dbPath} node index.js verify`, { stdio: 'pipe' });
      throw new Error('Should have exited with code 1');
    } catch (error) {
      expect(error.status).toBe(1);
    }
  });
});

// Acceptance Criterion 3 (extended): Startup verification checks history on load
describe('Startup History Verification', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'teatime-startup-'));
  const dbPath = path.join(tmpDir, 'brews.json');

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('any command should warn on startup if history contains invalid ratings', () => {
    const badData = [
      { type: 'tea', label: 'Bad', rating: 0, timestamp: '2023-01-01T10:00:00.000Z' },
      { type: 'coffee', label: 'Ok', rating: 4, timestamp: '2023-01-02T10:00:00.000Z' }
    ];
    fs.writeFileSync(dbPath, JSON.stringify(badData));

    // Running any command (summary) should detect and warn about invalid data on startup
    try {
      execSync(`BREW_DB=${dbPath} node index.js summary`, { stdio: 'pipe' });
    } catch (_) {
      // May or may not exit with error
    }

    // The startup check writes to stderr when invalid data is found
    // Use a separate call to capture stderr
    let stderrOutput = '';
    try {
      execSync(`BREW_DB=${dbPath} node index.js summary`, { stdio: 'pipe', stderr: 'pipe' });
    } catch (error) {
      stderrOutput = error.stderr ? error.stderr.toString() : '';
    }

    // Capture via a different mechanism - redirect stderr
    const result = execSync(`BREW_DB=${dbPath} node index.js summary 2>&1`, { stdio: 'pipe' });
    const combined = result.toString().toLowerCase();
    // Startup verification should detect invalid data and warn about it
    expect(combined).toMatch(/invalid|issue|warning|bad|corrupted|found/);
  });

  test('commands should not warn on startup when all ratings are valid', () => {
    const cleanData = [
      { type: 'tea', label: 'Green', rating: 5, timestamp: '2023-01-01T10:00:00.000Z' },
      { type: 'coffee', label: 'Espresso', rating: 3, timestamp: '2023-01-02T10:00:00.000Z' }
    ];
    fs.writeFileSync(dbPath, JSON.stringify(cleanData));

    const output = execSync(`BREW_DB=${dbPath} node index.js summary 2>&1`, { stdio: 'pipe' }).toString().toLowerCase();
    // When data is clean, there should be no warnings about invalid ratings
    expect(output).not.toMatch(/invalid|corrupted|bad rating/);
  });
});

// Acceptance Criterion 2 (cross-cutting): All rating error messages should be user-friendly
describe('User-Friendly Error Messages Across the Application', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'teatime-friendly-'));
  const dbPath = path.join(tmpDir, 'brews.json');

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('log command should show friendly error for invalid rating', () => {
    try {
      execSync(`BREW_DB=${dbPath} node index.js log tea 0`, { stdio: 'pipe' });
      throw new Error('Should have failed');
    } catch (error) {
      const stderr = error.stderr.toString();
      expect(stderr.length).toBeGreaterThan(0);
      expect(stderr.toLowerCase()).toMatch(/rating|between|integer/);
      // Should not be a raw technical error
      expect(stderr).not.toMatch(/TypeError|ReferenceError|SyntaxError/);
    }
  });

  test('rate command should show friendly error for invalid rating', () => {
    execSync(`BREW_DB=${dbPath} node index.js log tea`);
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const brewId = data[0].timestamp;

    try {
      execSync(`BREW_DB=${dbPath} node index.js rate "${brewId}" 6`, { stdio: 'pipe' });
      throw new Error('Should have failed');
    } catch (error) {
      const stderr = error.stderr.toString();
      expect(stderr.length).toBeGreaterThan(0);
      expect(stderr.toLowerCase()).toMatch(/rating|between|integer/);
    }
  });
});
