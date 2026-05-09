const { logBrew } = require('./index');
const persistence = require('./persistence');

jest.mock('./persistence');

describe('Brew Entry Recording Logic', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should record a brew with type and timestamp', () => {
        const brew = logBrew('tea');
        expect(brew.type).toBe('tea');
        expect(brew.timestamp).toBeDefined();
        expect(new Date(brew.timestamp).toString()).not.toBe('Invalid Date');
    });

    test('should pass recorded brew to persistence layer', () => {
        const brew = logBrew('coffee');
        expect(persistence.saveBrew).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'coffee',
                timestamp: expect.any(String)
            }),
            expect.any(String)
        );
    });

    test('should throw error for invalid brew type', () => {
        expect(() => logBrew('soda')).toThrow('Invalid brew type: soda');
    });

    test('should allow coffee as a valid type', () => {
        const brew = logBrew('coffee');
        expect(brew.type).toBe('coffee');
    });
});
