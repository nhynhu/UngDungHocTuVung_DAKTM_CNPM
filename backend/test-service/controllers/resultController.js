const Result = require('../models/Result');
const Question = require('../models/Question');

exports.submitTest = async (req, res) => {
    try {
        const { userId, testId, answers } = req.body;
        const questions = await Question.findAll(); // có thể lọc theo topic nếu cần
        let score = 0;

        for (let q of questions) {
            const userAnswer = answers[q.id];
            if (userAnswer && userAnswer === q.answer) score += 10;
        }

        const result = await Result.create({ userId, testId, score });
        res.json({ score });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};