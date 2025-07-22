const resultController = require('./resultController');
const Result = require('../models/Result');
const Question = require('../models/Question');

jest.mock('../models/Result');
jest.mock('../models/Question');

describe('resultController.submitTest', () => {
    it('should calculate score and return it', async () => {
        const req = {
            body: {
                userId: 1,
                testId: 1,
                answers: { 1: 'A', 2: 'B' },
                timeTaken: 30
            }
        };
        const res = { json: jest.fn() };
        Question.findAll.mockResolvedValue([
            { id: 1, answer: 'A' },
            { id: 2, answer: 'B' }
        ]);
        Result.create.mockResolvedValue({ score: 20 });
        await resultController.submitTest(req, res);
        expect(res.json).toHaveBeenCalledWith({ score: 20 });
    });

    it('should handle error', async () => {
        const req = { body: { userId: 1, testId: 1, answers: {} } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        Question.findAll.mockRejectedValue(new Error('DB error'));
        await resultController.submitTest(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });
});