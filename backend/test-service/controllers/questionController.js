const Question = require('../models/Question');
const { sequelize } = require('../models');  // <-- phải import instance chứ không phải thư viện

/**
 * Lấy câu hỏi theo topicId
 */
exports.getQuestionsByTopic = async (req, res) => {
    try {
        const { topicId } = req.params;
        const questions = await Question.findAll({
            where: { topicId }
        });

        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Tạo test ngẫu nhiên từ 2 topics (5:5)
 */
exports.generateMixedTest = async (req, res) => {
    try {
        const { topic1Id, topic2Id } = req.body;

        // Lấy 5 câu từ topic 1
        const questions1 = await Question.findAll({
            where: { topicId: topic1Id },
            order: sequelize.literal('RAND()'),
            limit: 5
        });

        // Lấy 5 câu từ topic 2  
        const questions2 = await Question.findAll({
            where: { topicId: topic2Id },
            order: sequelize.literal('RAND()'),
            limit: 5
        });

        // Trộn lại thứ tự
        const allQuestions = [...questions1, ...questions2]
            .sort(() => Math.random() - 0.5);

        res.json({
            questions: allQuestions,
            total: allQuestions.length,
            topics: [topic1Id, topic2Id]
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Tái sử dụng câu hỏi cho test mới
 */
exports.reuseQuestionsForNewTest = async (req, res) => {
    try {
        const { questionIds, testName } = req.body;

        // Lấy các câu hỏi đã có
        const questions = await Question.findAll({
            where: {
                id: questionIds
            }
        });

        res.json({
            testName,
            questions,
            message: `Reused ${questions.length} questions for new test`
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = exports;