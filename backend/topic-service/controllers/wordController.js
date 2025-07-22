const { Topic, Word } = require('../models');
const { Op } = require('sequelize');

/**
 * Lấy từ vựng theo topic (cho Flashcards)
 */
exports.getWordsByTopic = async (req, res) => {
    try {
        const { topicId } = req.params;

        console.log(`🔍 Getting words for topic: ${topicId}`);

        // SỬA LỖI: Không dùng include để tránh alias conflict
        const words = await Word.findAll({
            where: { TopicId: topicId },
            order: [['english', 'ASC']]
        });

        console.log(`📝 Found ${words.length} words for topic ${topicId}`);

        // Format cho frontend
        const formattedWords = words.map(word => ({
            id: word.id,
            english: word.english,
            vietnamese: word.vietnamese,
            front: word.english,
            back: word.vietnamese,
            TopicId: word.TopicId
        }));

        res.json(formattedWords);

    } catch (err) {
        console.error('❌ Get words by topic error:', err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Search API cho SearchBox component
 */
exports.searchWords = async (req, res) => {
    try {
        const searchTerm = req.query.q ? req.query.q.trim() : '';
        const type = req.query.type || 'all';

        if (!searchTerm) {
            return res.json([]);
        }

        let results = [];
        // Search topics
        if (type === 'all' || type === 'topics') {
            const topics = await Topic.findAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${searchTerm}%` } },
                        { nameVi: { [Op.like]: `%${searchTerm}%` } }
                    ]
                },
                include: [{ model: Word, as: 'words', attributes: ['id'] }] // SỬA: Thêm as: 'words'
            });

            const topicResults = topics.map(topic => ({
                id: topic.id,
                name: topic.name,
                nameVi: topic.nameVi || topic.name,
                description: `Chủ đề ${topic.description || topic.name}`,
                wordCount: topic.words?.length || 0,
                type: 'topic',
                link: `/lessons?topicId=${topic.id}` // Thêm link cho FE
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
                include: [{ model: Topic, as: 'topic', attributes: ['name', 'nameVi'] }], // SỬA LỖI: Thêm as: 'topic'
                limit: 20
            });

            const vocabResults = words.map(word => ({
                id: word.id,
                english: word.english,
                vietnamese: word.vietnamese,
                topic: word.topic?.nameVi || word.topic?.name || 'Unknown',
                topicId: word.TopicId, // THÊM DÒNG NÀY
                type: 'vocabulary',
                link: `/flashcard?wordId=${word.id}&topicId=${word.TopicId}` // THÊM topicId vào link
            }));

            results.push(...vocabResults);
        }

        res.json(results);
    } catch (err) {
        console.error('❌ SearchWords error:', err);
        res.status(500).json({ error: 'Internal server error', message: err.message });
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
