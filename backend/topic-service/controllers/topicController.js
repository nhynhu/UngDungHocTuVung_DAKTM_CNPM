const Topic = require('../models/Topic');

exports.createTopic = async (req, res) => {
    try {
        const { name, image } = req.body;
        const exists = await Topic.findOne({ where: { name } });
        if (exists) return res.status(409).json({ error: 'Topic name already exists' });
        const topic = await Topic.create({ name, image });
        res.json(topic);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteTopic = async (req, res) => {
    try {
        await Topic.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Topic deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllTopics = async (req, res) => {
    try {
        const topics = await Topic.findAll();
        res.json(topics);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};