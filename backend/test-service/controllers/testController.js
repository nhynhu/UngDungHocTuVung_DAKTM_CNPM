const Test = require('../models/Test');
const Question = require('../models/Question');
const Result = require('../models/Result');
const sequelize = require('sequelize');

/**
 * API cho Test page - lấy danh sách tests
 */
exports.getAllTests = async (req, res) => {
    try {
        const tests = await Test.findAll({
            attributes: ['id', 'name', 'description', 'topicIds']
        });

        // Format giống TestCard component expect
        const formattedTests = tests.map(test => ({
            id: test.id,
            title: test.name,
            img: 'https://images.pexels.com/photos/45170/kittens-cat-cat-puppy-cute-45170.jpeg',
            text: test.description || 'Bài test từ vựng',
            link: `/dotests?testId=${test.id}`
        }));

        res.json(formattedTests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Lấy câu hỏi cho TestStart component
 */
exports.getTestQuestions = async (req, res) => {
    try {
        const testId = req.params.id || req.query.testId;

        // Tạo questions ngẫu nhiên từ database hoặc mock data
        const mockQuestions = [
            {
                id: 1,
                question: "What is the meaning of 'Con chó'?",
                options: ["Cat", "Dog", "Cow", "Horse"],
                correctAnswer: 1
            },
            {
                id: 2,
                question: "What is the meaning of 'Con mèo'?",
                options: ["Dog", "Cat", "Bird", "Fish"],
                correctAnswer: 1
            },
            {
                id: 3,
                question: "What is the meaning of 'Con gà'?",
                options: ["Chicken", "Duck", "Goose", "Turkey"],
                correctAnswer: 0
            },
            {
                id: 4,
                question: "What is the meaning of 'Con cá'?",
                options: ["Bird", "Fish", "Frog", "Snake"],
                correctAnswer: 1
            },
            {
                id: 5,
                question: "What is the meaning of 'Quả táo'?",
                options: ["Apple", "Orange", "Banana", "Grape"],
                correctAnswer: 0
            }
        ];

        res.json({
            testId: testId,
            questions: mockQuestions
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Submit test results
 */
exports.submitTest = async (req, res) => {
    try {
        const { testId, answers, userId } = req.body;

        // Mock scoring logic
        const totalQuestions = Object.keys(answers).length;
        let correctCount = 0;

        // Simple scoring based on mock data
        Object.values(answers).forEach(answer => {
            if (Math.random() > 0.3) correctCount++; // 70% chance correct for demo
        });

        const score = Math.round((correctCount / totalQuestions) * 100);
        const passed = score >= 70;

        // Save result (optional)
        if (userId) {
            await Result.create({
                userId,
                testId,
                score,
                answers: JSON.stringify(answers),
                totalQuestions,
                correctAnswers: correctCount
            });
        }

        res.json({
            score: correctCount,
            totalQuestions,
            percentage: score,
            passed,
            message: passed ? 'Congratulations!' : 'Keep practicing!'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.healthCheck = (req, res) => {
    res.json({
        service: 'test-service',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
};

/**
 * Tạo test từ 2 topics với tỉ lệ 5:5
 */
exports.createMixedTest = async (req, res) => {
    try {
        const { topic1Id, topic2Id, testName } = req.body;

        // Lấy 5 câu ngẫu nhiên từ topic 1
        const questions1 = await Question.findAll({
            where: { topicId: topic1Id },
            order: sequelize.literal('RAND()'),
            limit: 5
        });

        // Lấy 5 câu ngẫu nhiên từ topic 2
        const questions2 = await Question.findAll({
            where: { topicId: topic2Id },
            order: sequelize.literal('RAND()'),
            limit: 5
        });

        // Trộn câu hỏi
        const mixedQuestions = [...questions1, ...questions2]
            .sort(() => Math.random() - 0.5);

        res.json({
            testName: testName || `Mixed Test: Topic ${topic1Id} & ${topic2Id}`,
            questions: mixedQuestions,
            total: mixedQuestions.length,
            composition: `5 from topic ${topic1Id}, 5 from topic ${topic2Id}`
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Lấy câu hỏi có thể tái sử dụng
 */
exports.getReusableQuestions = async (req, res) => {
    try {
        const { topicIds, limit = 10 } = req.query;

        let whereClause = {};
        if (topicIds) {
            const topicArray = topicIds.split(',').map(id => parseInt(id));
            whereClause.topicId = topicArray;
        }

        const questions = await Question.findAll({
            where: whereClause,
            order: sequelize.literal('RAND()'),
            limit: parseInt(limit)
        });

        res.json({
            questions,
            total: questions.length,
            reusable: true
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTest = async (req, res) => {
    try {
        const { topicId } = req.params;
        const { limit = 10 } = req.query;

        const questions = await Question.findAll({
            where: { topicId },
            order: sequelize.random(),
            limit: parseInt(limit),
            attributes: ['id', 'content', 'options'] // Không trả về answer
        });

        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.submitTest = async (req, res) => {
    try {
        const { answers, topicId, timeTaken } = req.body;
        const userId = req.user.id;

        let score = 0;
        const totalQuestions = answers.length;

        for (const answer of answers) {
            const question = await Question.findByPk(answer.questionId);
            if (question && question.answer === answer.selectedOption) {
                score++;
            }
        }

        const result = await Result.create({
            userId,
            topicId,
            score,
            totalQuestions,
            timeTaken
        });

        res.json({
            score,
            totalQuestions,
            percentage: Math.round((score / totalQuestions) * 100),
            result
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserResults = async (req, res) => {
    try {
        const userId = req.user.id;

        const results = await Result.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']]
        });

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};