const questionController = require('./questionController');
const Question = require('../models/Question');

jest.mock('../models/Question');

describe('questionController.getQuestionsByTopic', () => {
    it('should return questions by topic', async () => {
        const req = { params: { topicId: 1 } };
        const res = { json: jest.fn() };
        Question.findAll.mockResolvedValue([
            { id: 1, content: 'What is cat?', topicId: 1 }
        ]);
        await questionController.getQuestionsByTopic(req, res);
        expect(res.json).toHaveBeenCalledWith([
            { id: 1, content: 'What is cat?', topicId: 1 }
        ]);
    });

    it('should handle error', async () => {
        const req = { params: { topicId: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        Question.findAll.mockRejectedValue(new Error('DB error'));
        await questionController.getQuestionsByTopic(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });
});