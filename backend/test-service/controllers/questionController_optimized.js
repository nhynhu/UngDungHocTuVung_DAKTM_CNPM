const Question = require('../models/Question');

exports.getQuestionsByTopic = async (req, res) => {
    try {
        const questions = await Question.findAll({
            where: { topicId: req.params.topicId }
        });
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
