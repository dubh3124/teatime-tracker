const { logBrew } = require('./index');
const persistence = require('./persistence');

jest.mock('./persistence');

describe('Brew Rating Integration during Recording', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should optionally accept and store a rating during brew recording', () => {
        const rating = 5;
        const brew = logBrew('tea', undefined, rating);
        expect(brew.type).toBe('tea');
        expect(brew.rating).toBe(5);
        expect(persistence.saveBrew).toHaveBeenCalledWith(expect.objectContaining({
            type: 'tea',
            rating: 5
        }));
    });

    test('should NOT include rating if not provided during recording', () => {
        const brew = logBrew('coffee');
        expect(brew.type).toBe('coffee');
        expect(brew.rating).toBeUndefined();
        expect(persistence.saveBrew).toHaveBeenCalledWith(expect.not.objectContaining({
            rating: expect.anything()
        }));
    });
});
