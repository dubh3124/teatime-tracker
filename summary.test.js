const { getDailySummary } = require('./index');
const persistence = require('./persistence');

// Mock persistence to control the history
jest.mock('./persistence', () => ({
  saveBrew: jest.fn(),
  getHistory: jest.fn()
}));

// We'll need to modify index.js to use persistence.getHistory() for the summary
// For now, let's write a test that expects the features defined in Acceptance Criteria

describe('Daily Summary Reporting Engine', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('logic filters brew history for the current calendar day only', () => {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        const history = [
            { type: 'tea', timestamp: `${today}T10:00:00Z` },
            { type: 'coffee', timestamp: `${today}T11:00:00Z` },
            { type: 'tea', timestamp: `${yesterday}T10:00:00Z` }
        ];

        persistence.getHistory.mockReturnValue(history);

        const summary = getDailySummary();
        // Updated expectation: if the requirement says "Output includes counts for each brew type (e.g., '2 teas, 1 coffee')"
        // we might need a formatSummary function or getDailySummary to return a formatted string.
        // But the current implementation returns an object. 
        // Let's assume the requirement "Output includes counts" means the data structure or a string.
        // AC 2 says: Output includes counts for each brew type (e.g., '2 teas, 1 coffee').
        // This sounds like a string report.
        
        expect(summary).toContain('1 tea');
        expect(summary).toContain('1 coffee');
        expect(summary).not.toContain('2 teas'); // Should not include yesterday's tea
    });

    test('verifies correct aggregation for empty history', () => {
        persistence.getHistory.mockReturnValue([]);
        const summary = getDailySummary();
        expect(summary).toBe('No brews recorded for today.');
    });

    test('verifies correct aggregation for multiple types and pluralization', () => {
        const today = new Date().toISOString().split('T')[0];
        const history = [
            { type: 'tea', timestamp: `${today}T10:00:00Z` },
            { type: 'tea', timestamp: `${today}T12:00:00Z` },
            { type: 'coffee', timestamp: `${today}T11:00:00Z` }
        ];
        persistence.getHistory.mockReturnValue(history);
        const summary = getDailySummary();
        expect(summary).toBe('2 teas, 1 coffee');
    });
});
