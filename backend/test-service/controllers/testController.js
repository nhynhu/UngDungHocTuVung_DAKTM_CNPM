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
        // Ưu tiên testId, nếu không có thì dùng topicId

        let testId = req.params.testId;
        let topicId = req.params.topicId;
        const { limit = 10 } = req.query;

        // Nếu testId có dạng '2:1' thì tách ra
        if (testId && typeof testId === 'string' && testId.includes(':')) {
            const parts = testId.split(':');
            testId = parts[0];
            topicId = parts[1];
        }

        if (testId) {
            const questions = await Question.findAll({
                where: { TestId: parseInt(testId) },
                order: sequelize.random(),
                limit: parseInt(limit),
                attributes: ['id', 'content', 'options']
            });

            // Nếu có topicId, lọc tiếp theo topicId
            let filteredQuestions = questions;
            if (topicId) {
                filteredQuestions = questions.filter(q => q.topicId === parseInt(topicId));
            }

            // Luôn trả về mảng, không trả về lỗi 404 cho frontend
            return res.json({
                testId: parseInt(testId),
                topicId: topicId ? parseInt(topicId) : undefined,
                questions: Array.isArray(filteredQuestions) ? filteredQuestions : [],
                totalQuestions: Array.isArray(filteredQuestions) ? filteredQuestions.length : 0
            });
        }

        if (topicId) {
            if (isNaN(topicId)) {
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

            // Luôn trả về mảng, không trả về lỗi 404 cho frontend
            return res.json({
                topicId: parseInt(topicId),
                questions: Array.isArray(questions) ? questions : [],
                totalQuestions: Array.isArray(questions) ? questions.length : 0
            });
        }

        return res.status(400).json({ error: 'Missing testId or topicId' });

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
        const { answers, testId, timeTaken } = req.body;
        // Nếu dùng xác thực thì lấy userId từ req.user, nếu không thì lấy từ req.body
        const userId = req.user?.id || req.body.userId;

        console.log(`📊 Submitting test for user ${userId}, testId ${testId}`);


        if (!testId || !answers || !Array.isArray(answers)) {
            return res.status(400).json({
                error: 'Missing required fields: testId, answers'
            });
        }

        // Lấy tất cả câu hỏi của test, lấy cả options để so sánh index
        const questions = await Question.findAll({
            where: { TestId: parseInt(testId) },
            attributes: ['id', 'answer', 'options']
        });

        let score = 0;
        const totalQuestions = questions.length;

        // Chuẩn hóa answers thành mảng object [{questionId, selectedOption}]
        let normalizedAnswers = [];
        if (answers.length > 0 && typeof answers[0] === 'object' && answers[0].questionId !== undefined) {
            normalizedAnswers = answers;
        } else if (answers.length === questions.length) {
            // Nếu answers là mảng số, ánh xạ theo thứ tự câu hỏi
            normalizedAnswers = questions.map((q, idx) => ({
                questionId: q.id,
                selectedOption: answers[idx]
            }));
        }

        for (const answer of normalizedAnswers) {
            const question = questions.find(q => q.id === answer.questionId);
            if (question) {
                let optionsArr = Array.isArray(question.options) ? question.options : JSON.parse(question.options);
                const correctValue = optionsArr[question.answer];
                let userValue = null;
                if (typeof answer.selectedOption === 'number') {
                    userValue = optionsArr[answer.selectedOption];
                } else if (typeof answer.selectedOption === 'string') {
                    userValue = answer.selectedOption;
                }
                // Log chi tiết cho từng câu hỏi
                console.log(`QID: ${question.id}`);
                console.log(`Options:`, optionsArr);
                console.log(`Answer index: ${question.answer}`);
                console.log(`Correct value: ${correctValue}`);
                console.log(`User selected index: ${answer.selectedOption}`);
                console.log(`User value: ${userValue}`);
                // Chấm điểm
                if (userValue === correctValue) {
                    score++;
                }
            }
        }

        // Lưu kết quả vào model Result, luôn có timeTaken và pass
        const passed = score >= Math.ceil(totalQuestions * 0.7);
        const result = await Result.create({
            userId,
            TestId: parseInt(testId),
            score,
            totalQuestions,
            timeTaken: typeof timeTaken === 'number' ? timeTaken : 0,
            pass: passed
        });

        res.json({
            score,
            totalQuestions,
            percentage: Math.round((score / totalQuestions) * 100),
            timeTaken: result.timeTaken,
            passed: result.pass,
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