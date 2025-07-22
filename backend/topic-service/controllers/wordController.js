const { Topic, Word } = require('../models');
const { Op } = require('sequelize');

exports.getWordsByTopic = async (req, res) => {
    try {
        const { topicId } = req.params;

        console.log(` Getting words for topic: ${topicId}`);

        const words = await Word.findAll({
            where: { TopicId: topicId },
            order: [['english', 'ASC']]
        });

        console.log(` Found ${words.length} words for topic ${topicId}`);

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
        console.error(' Get words by topic error:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.searchWords = async (req, res) => {
    try {
        const searchTerm = req.query.q ? req.query.q.trim() : '';
        const type = req.query.type || 'all';

        if (!searchTerm) {
            return res.json([]);
        }

        let results = [];

        if (type === 'all' || type === 'topics') {
            const topics = await Topic.findAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${searchTerm}%` } },
                        { nameVi: { [Op.like]: `%${searchTerm}%` } }
                    ]
                },
                include: [{ model: Word, as: 'words', attributes: ['id'] }]
            });

            const topicResults = topics.map(topic => ({
                id: topic.id,
                name: topic.name,
                nameVi: topic.nameVi || topic.name,
                description: `Chủ đề ${topic.description || topic.name}`,
                wordCount: topic.words?.length || 0,
                type: 'topic',
                link: `/lessons?topicId=${topic.id}`
            }));

            results.push(...topicResults);
        }

        if (type === 'all' || type === 'vocabulary') {
            const words = await Word.findAll({
                where: {
                    [Op.or]: [
                        { english: { [Op.like]: `%${searchTerm}%` } },
                        { vietnamese: { [Op.like]: `%${searchTerm}%` } }
                    ]
                },
                include: [{ model: Topic, as: 'topic', attributes: ['name', 'nameVi'] }],
                limit: 20
            });

            const vocabResults = words.map(word => ({
                id: word.id,
                english: word.english,
                vietnamese: word.vietnamese,
                topic: word.topic?.nameVi || word.topic?.name || 'Unknown',
                topicId: word.TopicId,
                type: 'vocabulary',
                link: `/flashcard?wordId=${word.id}&topicId=${word.TopicId}`
            }));

            results.push(...vocabResults);
        }

        res.json(results);
    } catch (err) {
        console.error(' SearchWords error:', err);
        res.status(500).json({ error: 'Internal server error', message: err.message });
    }
};

exports.healthCheck = (req, res) => {
    res.json({
        service: 'topic-service',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
};
