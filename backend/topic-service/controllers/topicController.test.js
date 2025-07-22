const topicController = require('./topicController');
const { Topic } = require('../models');

jest.mock('../models', () => ({
    Topic: {
        findAll: jest.fn(),
        findByPk: jest.fn()
    },
    Word: {}
}));

describe('topicController.getAllTopics', () => {
    it('should return all topics', async () => {
        const req = {};
        const res = { json: jest.fn() };
        Topic.findAll.mockResolvedValue([
            { id: 1, name: 'Animals', nameVi: 'Động vật', description: 'desc', image: 'img.jpg', words: [{ id: 1 }] }
        ]);
        await topicController.getAllTopics(req, res);
        expect(res.json).toHaveBeenCalledWith([
            expect.objectContaining({ id: 1, name: 'Animals' })
        ]);
    });
});

describe('topicController.getTopicById', () => {
    it('should return topic if found', async () => {
        const req = { params: { id: 1 } };
        const res = { json: jest.fn() };
        Topic.findByPk.mockResolvedValue({ id: 1, name: 'Animals', words: [{ id: 1 }] });
        await topicController.getTopicById(req, res);
        expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Animals', words: [{ id: 1 }] });
    });

    it('should return 404 if not found', async () => {
        const req = { params: { id: 2 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        Topic.findByPk.mockResolvedValue(null);
        await topicController.getTopicById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Topic not found' });
    });

    it('should handle error', async () => {
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        Topic.findByPk.mockRejectedValue(new Error('DB error'));
        await topicController.getTopicById(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });
});