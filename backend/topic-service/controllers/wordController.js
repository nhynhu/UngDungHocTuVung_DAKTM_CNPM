const Word = require('../models/Word');

exports.addWord = async (req, res) => {
    try {
        const { english, vietnamese, TopicId } = req.body;
        const exists = await Word.findOne({ where: { english, TopicId } });
        if (exists) return res.status(409).json({ error: 'Word already exists in this topic' });
        const word = await Word.create({ english, vietnamese, TopicId });
        res.json(word);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteWord = async (req, res) => {
    try {
        await Word.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Word deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getWordsByTopic = async (req, res) => {
    try {
        const words = await Word.findAll({ where: { TopicId: req.params.topicId } });
        res.json(words);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
