const fs = require('fs');
const path = require('path');

describe('USER_GUIDE.md', () => {
  let guideContent;

  beforeAll(() => {
    const guidePath = path.join(__dirname, 'USER_GUIDE.md');
    if (!fs.existsSync(guidePath)) {
      guideContent = null;
      return;
    }
    guideContent = fs.readFileSync(guidePath, 'utf-8');
  });

  // AC1: User guide covers every command: add, search/history, rate, stats, delete, export.
  test('USER_GUIDE.md exists', () => {
    expect(guideContent).not.toBeNull();
  });

  test('contains title identifying it as a user guide or command reference', () => {
    expect(guideContent).not.toBeNull();
    const hasTitle =
      /#\s+.*(User\s*Guide|Command\s*Reference|CLI\s*Reference)/i.test(guideContent) ||
      /TeaTime\s+Tracker.*Guide/i.test(guideContent);
    expect(hasTitle).toBe(true);
  });

  test('covers add/log command with its own section', () => {
    expect(guideContent).not.toBeNull();
    expect(guideContent).toMatch(/##\s+(.*\b(?:add|log|Recording)\b)/i);
    // must mention 'log' and 'add' as aliases
    expect(guideContent).toMatch(/log\b/);
    expect(guideContent).toMatch(/add\b/);
  });

  test('covers search/history command with its own section', () => {
    expect(guideContent).not.toBeNull();
    expect(guideContent).toMatch(/##\s+(.*\b(?:search|history|Filtering)\b)/i);
    expect(guideContent).toMatch(/search\b/);
    expect(guideContent).toMatch(/history\b/);
  });

  test('covers rate command with its own section', () => {
    expect(guideContent).not.toBeNull();
    expect(guideContent).toMatch(/##\s+(.*\brate\b)/i);
  });

  test('covers stats command with its own section', () => {
    expect(guideContent).not.toBeNull();
    expect(guideContent).toMatch(/##\s+(.*\bstats\b)/i);
  });

  test('covers delete command with its own section', () => {
    expect(guideContent).not.toBeNull();
    expect(guideContent).toMatch(/##\s+(.*\bdelete\b)/i);
  });

  test('covers export command with its own section', () => {
    expect(guideContent).not.toBeNull();
    expect(guideContent).toMatch(/##\s+(.*\bexport\b)/i);
  });

  // AC2: Each command section documents all available flags
  // (--from, --to, --type, --rating, --sort, --format, etc.).
  test('documents --from / --start-date flag', () => {
    expect(guideContent).not.toBeNull();
    expect(guideContent).toMatch(/--from/);
    expect(guideContent).toMatch(/--start-date/);
  });

  test('documents --to / --end-date flag', () => {
    expect(guideContent).not.toBeNull();
    expect(guideContent).toMatch(/--to/);
    expect(guideContent).toMatch(/--end-date/);
  });

  test('documents --type flag', () => {
    expect(guideContent).not.toBeNull();
    expect(guideContent).toMatch(/--type/);
  });

  test('documents --rating flag', () => {
    expect(guideContent).not.toBeNull();
    expect(guideContent).toMatch(/--rating/);
  });

  test('documents --min-rating flag', () => {
    expect(guideContent).not.toBeNull();
    expect(guideContent).toMatch(/--min-rating/);
  });

  test('documents --sort flag', () => {
    expect(guideContent).not.toBeNull();
    expect(guideContent).toMatch(/--sort/);
  });

  test('documents --format flag', () => {
    expect(guideContent).not.toBeNull();
    expect(guideContent).toMatch(/--format/);
  });

  // AC3: Document rating scale (1-5 stars), date format expectations, and CSV export format.
  test('documents rating scale as 1-5 stars', () => {
    expect(guideContent).not.toBeNull();
    expect(guideContent).toMatch(/1.?[-–].?5\s*stars?/i);
  });

  test('documents date format expectations (YYYY-MM-DD)', () => {
    expect(guideContent).not.toBeNull();
    expect(guideContent).toMatch(/YYYY-MM-DD/i);
  });

  test('documents CSV export format', () => {
    expect(guideContent).not.toBeNull();
    expect(guideContent).toMatch(/CSV/i);
  });

  // AC4: Include at least one practical workflow example per command.
  test('includes at least one usage example for add/log command', () => {
    expect(guideContent).not.toBeNull();
    const addSection = guideContent.match(new RegExp('## [^\n]*?(add|log|Recording)[^\n]*', 'i'));
    if (addSection) {
      const sectionStart = addSection.index;
      const nextSection = guideContent.slice(sectionStart).match(/\n## /);
      const sectionEnd = nextSection
        ? sectionStart + nextSection.index
        : guideContent.length;
      const section = guideContent.slice(sectionStart, sectionEnd);
      expect(section).toMatch(/```/);
      expect(section).toMatch(/node index\.js\s+(log|add)\s+(tea|coffee)/);
    }
  });

  test('includes at least one usage example for search/history command', () => {
    expect(guideContent).not.toBeNull();
    const searchSection = guideContent.match(new RegExp('## [^\n]*?(search|history|Filtering)[^\n]*', 'i'));
    if (searchSection) {
      const sectionStart = searchSection.index;
      const nextSection = guideContent.slice(sectionStart).match(/\n## /);
      const sectionEnd = nextSection
        ? sectionStart + nextSection.index
        : guideContent.length;
      const section = guideContent.slice(sectionStart, sectionEnd);
      expect(section).toMatch(/```/);
      expect(section).toMatch(/node index\.js\s+(search|history)/);
    }
  });

  test('includes at least one usage example for rate command', () => {
    expect(guideContent).not.toBeNull();
    const rateSection = guideContent.match(new RegExp('## [^\n]*?rate[^\n]*', 'i'));
    if (rateSection) {
      const sectionStart = rateSection.index;
      const nextSection = guideContent.slice(sectionStart).match(/\n## /);
      const sectionEnd = nextSection
        ? sectionStart + nextSection.index
        : guideContent.length;
      const section = guideContent.slice(sectionStart, sectionEnd);
      expect(section).toMatch(/```/);
      expect(section).toMatch(/node index\.js\s+rate/);
    }
  });

  test('includes at least one usage example for stats command', () => {
    expect(guideContent).not.toBeNull();
    const statsSection = guideContent.match(new RegExp('## [^\n]*?stats[^\n]*', 'i'));
    if (statsSection) {
      const sectionStart = statsSection.index;
      const nextSection = guideContent.slice(sectionStart).match(/\n## /);
      const sectionEnd = nextSection
        ? sectionStart + nextSection.index
        : guideContent.length;
      const section = guideContent.slice(sectionStart, sectionEnd);
      expect(section).toMatch(/```/);
      expect(section).toMatch(/node index\.js\s+stats/);
    }
  });

  test('includes at least one usage example for delete command', () => {
    expect(guideContent).not.toBeNull();
    const deleteSection = guideContent.match(new RegExp('## [^\n]*?delete[^\n]*', 'i'));
    if (deleteSection) {
      const sectionStart = deleteSection.index;
      const nextSection = guideContent.slice(sectionStart).match(/\n## /);
      const sectionEnd = nextSection
        ? sectionStart + nextSection.index
        : guideContent.length;
      const section = guideContent.slice(sectionStart, sectionEnd);
      expect(section).toMatch(/```/);
      expect(section).toMatch(/node index\.js\s+delete/);
    }
  });

  test('includes at least one usage example for export command', () => {
    expect(guideContent).not.toBeNull();
    const exportSection = guideContent.match(new RegExp('## [^\n]*?export[^\n]*', 'i'));
    if (exportSection) {
      const sectionStart = exportSection.index;
      const nextSection = guideContent.slice(sectionStart).match(/\n## /);
      const sectionEnd = nextSection
        ? sectionStart + nextSection.index
        : guideContent.length;
      const section = guideContent.slice(sectionStart, sectionEnd);
      expect(section).toMatch(/```/);
      expect(section).toMatch(/node index\.js\s+export/);
    }
  });
});
