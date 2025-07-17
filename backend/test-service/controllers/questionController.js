const Question = require('../models/Question');

exports.createQuestion = async (req, res) => {
    try {
        const { content, options, answer, topicId } = req.body;
        const question = await Question.create({ content, options, answer, topicId });
        res.json(question);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        await Question.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Question deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getQuestionsByTopic = async (req, res) => {
    try {
        const questions = await Question.findAll({ where: { topicId: req.params.topicId } });
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};