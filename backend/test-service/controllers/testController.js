const Test = require('../models/Test');
const Question = require('../models/Question');
const Result = require('../models/Result');
const { sequelize } = require('../models'); // Fix import

/**
 * Get all tests
 */
exports.getAllTests = async (req, res) => {
    try {
        const tests = await Test.findAll({
            attributes: ['id', 'name', 'description', 'topicIds']
        });

        const formattedTests = tests.map(test => ({
            id: test.id,
            title: test.name,
            img: 'https://images.pexels.com/photos/45170/kittens-cat-cat-puppy-cute-45170.jpeg',
            text: test.description || 'Bài test từ vựng',
            link: `/dotests?testId=${test.id}`
        }));

        res.json(formattedTests);
    } catch (err) {
        console.error('❌ Get all tests error:', err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Get test questions for a topic
 */
exports.getTest = async (req, res) => {
    try {
        const { topicId } = req.params;
        const { limit = 10 } = req.query;

        console.log(`📊 Getting test for topic: ${topicId}`);

        if (!topicId || isNaN(topicId)) {
            return res.status(400).json({
                error: 'Invalid topic ID',
                received: topicId
            });
        }

        const questions = await Question.findAll({
            where: { topicId: parseInt(topicId) },
            order: sequelize.random(),
            limit: parseInt(limit),
            attributes: ['id', 'content', 'options']
        });

        if (questions.length === 0) {
            return res.status(404).json({
                error: 'No questions found for this topic',
                topicId: topicId
            });
        }

        res.json({
            topicId: parseInt(topicId),
            questions: questions,
            totalQuestions: questions.length
        });

    } catch (error) {
        console.error('❌ Get test error:', error);
        res.status(500).json({
            error: 'Failed to get test questions',
            message: error.message
        });
    }
};

/**
 * Submit test results
 */
exports.submitTest = async (req, res) => {
    try {
        const { answers, topicId, timeTaken } = req.body;
        const userId = req.user.id;

        console.log(`📊 Submitting test for user ${userId}, topic ${topicId}`);

        if (!topicId || !answers || !Array.isArray(answers)) {
            return res.status(400).json({
                error: 'Missing required fields: topicId, answers'
            });
        }

        // Get correct answers
        const questions = await Question.findAll({
            where: { topicId: parseInt(topicId) },
            attributes: ['id', 'answer']
        });

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
            topicId: parseInt(topicId),
            score,
            totalQuestions,
            timeTaken: timeTaken || 0
        });

        res.json({
            score,
            totalQuestions,
            percentage: Math.round((score / totalQuestions) * 100),
            timeTaken: timeTaken || 0,
            passed: score >= Math.ceil(totalQuestions * 0.7),
            resultId: result.id
        });

    } catch (error) {
        console.error('❌ Submit test error:', error);
        res.status(500).json({
            error: 'Failed to submit test',
            message: error.message
        });
    }
};

/**
 * Get user test history
 */
exports.getUserResults = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 10, offset = 0 } = req.query;

        console.log(`📊 Getting results for user: ${userId}`);

        const results = await Result.findAndCountAll({
            where: { userId: userId },
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'topicId', 'score', 'totalQuestions', 'timeTaken', 'createdAt']
        });

        res.json({
            results: results.rows,
            total: results.count,
            page: Math.floor(offset / limit) + 1,
            totalPages: Math.ceil(results.count / limit)
        });

    } catch (error) {
        console.error('❌ Get user results error:', error);
        res.status(500).json({
            error: 'Failed to get user results',
            message: error.message
        });
    }
};

/**
 * Health check
 */
exports.healthCheck = (req, res) => {
    res.json({
        service: 'test-controller',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
};