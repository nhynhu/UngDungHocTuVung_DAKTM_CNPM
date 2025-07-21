const Word = require('../models/Word');
const Topic = require('../models/Topic');
const { Op } = require('sequelize');

/**
 * Lấy từ vựng theo topic (cho Flashcards)
 */
exports.getWordsByTopic = async (req, res) => {
    try {
        const words = await Word.findAll({
            where: { TopicId: req.params.topicId },
            include: [{ model: Topic, attributes: ['name', 'nameVi'] }]
        });

        // Format cho Flashcards component
        const flashcards = words.map(word => ({
            id: word.id,
            front: word.english,      // Mặt trước flashcard
            back: word.vietnamese,    // Mặt sau flashcard
            english: word.english,
            vietnamese: word.vietnamese,
            topic: word.Topic?.nameVi || word.Topic?.name || 'Unknown'
        }));

        res.json(flashcards);
    } catch (err) {
        console.error('Get words by topic error:', err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Search API cho SearchBox component
 */
exports.searchWords = async (req, res) => {
    try {
        const { q, type = 'all' } = req.query;

        if (!q || q.trim() === '') {
            return res.json([]);
        }

        let results = [];
        const searchTerm = q.toLowerCase();

        // Search topics
        if (type === 'all' || type === 'topics') {
            const topics = await Topic.findAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${searchTerm}%` } },
                        { nameVi: { [Op.like]: `%${searchTerm}%` } }
                    ]
                },
                include: [{ model: Word, attributes: ['id'] }]
            });

            const topicResults = topics.map(topic => ({
                id: topic.id,
                name: topic.name,
                nameVi: topic.nameVi || topic.name,
                description: `Chủ đề ${topic.description || topic.name}`,
                wordCount: topic.Words?.length || 0,
                type: 'topic'
            }));

            results.push(...topicResults);
        }

        // Search vocabulary
        if (type === 'all' || type === 'vocabulary') {
            const words = await Word.findAll({
                where: {
                    [Op.or]: [
                        { english: { [Op.like]: `%${searchTerm}%` } },
                        { vietnamese: { [Op.like]: `%${searchTerm}%` } }
                    ]
                },
                include: [{ model: Topic, attributes: ['name', 'nameVi'] }],
                limit: 20
            });

            const vocabResults = words.map(word => ({
                id: word.id,
                english: word.english,
                vietnamese: word.vietnamese,
                topic: word.Topic?.nameVi || word.Topic?.name || 'Unknown',
                type: 'vocabulary'
            }));

            results.push(...vocabResults);
        }

        res.json(results.slice(0, 10));
    } catch (err) {
        console.error('Search words error:', err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Thêm word mới (Admin only)
 */
exports.addWord = async (req, res) => {
    try {
        const { english, vietnamese, TopicId } = req.body;

        // Check if topic exists
        const topic = await Topic.findByPk(TopicId);
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }

        // Check if word already exists in this topic
        const exists = await Word.findOne({
            where: { english, TopicId }
        });
        if (exists) {
            return res.status(409).json({ error: 'Word already exists in this topic' });
        }

        const word = await Word.create({ english, vietnamese, TopicId });

        res.status(201).json({
            id: word.id,
            english: word.english,
            vietnamese: word.vietnamese,
            message: 'Word added successfully'
        });
    } catch (err) {
        console.error('Add word error:', err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Xóa word (Admin only)
 */
exports.deleteWord = async (req, res) => {
    try {
        const word = await Word.findByPk(req.params.id);
        if (!word) {
            return res.status(404).json({ error: 'Word not found' });
        }

        await word.destroy();
        res.json({ message: 'Word deleted successfully' });
    } catch (err) {
        console.error('Delete word error:', err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Health check
 */
exports.healthCheck = (req, res) => {
    res.json({
        service: 'topic-service',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
};
