const testController = require('./testController');
const Test = require('../models/Test');
const Question = require('../models/Question');

jest.mock('../models/Test');
jest.mock('../models/Question');

describe('testController.getAllTests', () => {
    it('should return all tests', async () => {
        const req = {};
        const res = { json: jest.fn() };
        Test.findAll.mockResolvedValue([
            { id: 1, name: 'Test 1', topicIds: [1, 2], createdAt: new Date(), questions: [{ id: 1 }] }
        ]);
        await testController.getAllTests(req, res);
        expect(res.json).toHaveBeenCalled();
    });
});