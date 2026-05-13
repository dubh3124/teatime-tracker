const fs = require('fs');
const path = require('path');

describe('README.md', () => {
  let readmeContent;

  beforeAll(() => {
    const readmePath = path.join(__dirname, 'README.md');
    if (!fs.existsSync(readmePath)) {
      readmeContent = null;
      return;
    }
    readmeContent = fs.readFileSync(readmePath, 'utf-8');
  });

  // AC1: README.md exists in repository root with clear project description and purpose.
  test('README.md exists in repository root', () => {
    expect(readmeContent).not.toBeNull();
  });

  test('contains project title and clear description', () => {
    expect(readmeContent).not.toBeNull();
    const hasTitle = /#\s+TeaTime\s+Tracker/i.test(readmeContent) ||
      /#\s+TeaTime Tracker/i.test(readmeContent) ||
      /#\s+teatime-tracker/i.test(readmeContent);
    expect(hasTitle).toBe(true);

    // Should describe purpose: tea/coffee tracking CLI
    const describesPurpose = /tea/i.test(readmeContent) && /coffee/i.test(readmeContent);
    expect(describesPurpose).toBe(true);
  });

  // AC2: Installation section covers npm install and any prerequisites.
  test('contains installation section with npm install and prerequisites', () => {
    expect(readmeContent).not.toBeNull();
    expect(readmeContent).toMatch(/##\s*Installation/i);
    expect(readmeContent).toMatch(/npm\s+(install|i)\b/);
    expect(readmeContent).toMatch(/Node\.js/i);
  });

  // AC3: Quick start section demonstrates basic usage (add, search, rate) with example commands.
  test('contains quick start section demonstrating add, search, rate', () => {
    expect(readmeContent).not.toBeNull();
    expect(readmeContent).toMatch(/##\s*Quick\s*Start/i);
    // Should mention the add/log command
    expect(readmeContent).toMatch(/log\b/);
    // Should mention search
    expect(readmeContent).toMatch(/search\b/);
    // Should mention rate
    expect(readmeContent).toMatch(/rate\b/);
  });

  // AC4: Feature overview lists all supported commands: add, search/history, rate, stats, delete, export.
  test('feature overview lists all supported commands', () => {
    expect(readmeContent).not.toBeNull();
    expect(readmeContent).toMatch(/##\s*Features/i);
    // Check for all required commands
    const requiredCommands = ['add', 'log', 'search', 'history', 'rate', 'stats', 'delete', 'export'];
    requiredCommands.forEach(cmd => {
      expect(readmeContent).toMatch(new RegExp(cmd, 'i'));
    });
  });

  // AC5: Contribution section references TDD workflow and branch protection policy.
  test('contribution section references TDD workflow and branch protection', () => {
    expect(readmeContent).not.toBeNull();
    expect(readmeContent).toMatch(/##\s*Contribut/i);
    expect(readmeContent).toMatch(/TDD/i);
    expect(readmeContent).toMatch(/branch\s*protection/i);
  });
});
