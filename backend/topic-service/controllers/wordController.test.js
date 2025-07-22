const wordController = require('./wordController');
const { Topic, Word } = require('../models');

jest.mock('../models', () => ({
    Topic: { findAll: jest.fn() },
    Word: { findAll: jest.fn() }
}));

describe('wordController.searchWords', () => {
    let req, res;

    beforeEach(() => {
        req = { query: { q: 'cat', type: 'all' } };
        res = { json: jest.fn() };
    });

    it('should return empty array if no searchTerm', async () => {
        req.query.q = '';
        await wordController.searchWords(req, res);
        expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should return topics if type is topics', async () => {
        req.query.type = 'topics';
        require('../models').Topic.findAll.mockResolvedValue([
            { id: 1, name: 'Animals', nameVi: 'Động vật', description: 'desc', words: [{ id: 1 }, { id: 2 }] }
        ]);
        await wordController.searchWords(req, res);
        expect(res.json).toHaveBeenCalled();
    });

    it('should return words if type is vocabulary', async () => {
        req.query.type = 'vocabulary';
        require('../models').Word.findAll.mockResolvedValue([
            { id: 1, english: 'cat', vietnamese: 'con mèo', topic: { name: 'Animals', nameVi: 'Động vật' } }
        ]);
        await wordController.searchWords(req, res);
        expect(res.json).toHaveBeenCalled();
    });
});