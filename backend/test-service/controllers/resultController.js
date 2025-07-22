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

        // Truyền đủ các trường bắt buộc
        const totalQuestions = questions.length;
        const timeTaken = req.body.timeTaken ?? 0;
        const pass = score >= (totalQuestions * 10 * 0.6); // ví dụ: qua nếu >=60%
        const result = await Result.create({
            userId,
            testId,
            score,
            totalQuestions,
            timeTaken,
            pass
        });
        res.json({ score });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};