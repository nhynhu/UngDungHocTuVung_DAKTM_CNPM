const Test = require('../models/Test');
const Question = require('../models/Question');
const Result = require('../models/Result');
const { sequelize } = require('../models');

/**
 * Get all tests - SỬA LỖI: Thêm trường description vào model
 */
exports.getAllTests = async (req, res) => {
    try {
        console.log('📝 Getting all tests...');

        const tests = await Test.findAll({
            attributes: ['id', 'name', 'topicIds', 'createdAt'],
            include: [{
                model: Question,
                as: 'questions',
                attributes: ['id'],
                required: false
            }],
            order: [['createdAt', 'DESC']]
        });

        const formattedTests = tests.map(test => ({
            id: test.id,
            title: test.name,
            img: 'https://images.pexels.com/photos/45170/kittens-cat-cat-puppy-cute-45170.jpeg',
            text: `Test từ vựng với ${test.questions?.length || 0} câu hỏi`,
            link: `/dotests?testId=${test.id}`,
            questionCount: test.questions?.length || 0,
            topicIds: typeof test.topicIds === 'string' ? JSON.parse(test.topicIds) : test.topicIds,
            createdAt: test.createdAt
        }));

        console.log(`✅ Found ${formattedTests.length} tests`);
        res.json(formattedTests);

    } catch (err) {
        console.error('❌ Get all tests error:', err);
        res.status(500).json({
            error: 'Failed to get tests',
            message: err.message
        });
    }
};

/**
 * Get test questions for a topic - KHÔNG THAY ĐỔI
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
 * Submit test results - KHÔNG THAY ĐỔI
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
 * Health check
 */
exports.healthCheck = (req, res) => {
    res.json({
        service: 'test-controller',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
};