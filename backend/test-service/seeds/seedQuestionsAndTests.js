require('dotenv').config({ path: require('path').join(__dirname, '../.env.seed') });
const { sequelize } = require('../models');
const Question = require('../models/Question');
const Test = require('../models/Test');

const seedQuestionsAndTests = async () => {
    try {
        console.log('🔗 Connecting to test database...');
        await sequelize.authenticate();
        console.log('✅ Test database connected successfully');

        await sequelize.sync({ force: true });
        console.log('🔄 Test database reset successfully');

        // Tạo 8 bài test với câu hỏi mẫu
        const testConfigs = [
            { name: 'Animals & Body Parts Test', questions: generateQuestions('Animals', 'Body Parts') },
            { name: 'Colors & Family Test', questions: generateQuestions('Colors', 'Family') },
            { name: 'Food & Household Items Test', questions: generateQuestions('Food', 'Household Items') },
            { name: 'Jobs & Pets Test', questions: generateQuestions('Jobs', 'Pets') },
            { name: 'School Supplies & Weather Test', questions: generateQuestions('School Supplies', 'Weather') },
            { name: 'Animals & Colors Test', questions: generateQuestions('Animals', 'Colors') },
            { name: 'Family & Food Test', questions: generateQuestions('Family', 'Food') },
            { name: 'Jobs & Weather Test', questions: generateQuestions('Jobs', 'Weather') }
        ];

        for (let i = 0; i < testConfigs.length; i++) {
            const config = testConfigs[i];

            // Tạo test
            const test = await Test.create({
                name: config.name,
                topicIds: JSON.stringify([i + 1, i + 2]) // Mock topic IDs
            });

            console.log(`✅ Created test: ${config.name}`);

            // Tạo 10 câu hỏi cho mỗi test
            for (let j = 0; j < config.questions.length; j++) {
                await Question.create({
                    ...config.questions[j],
                    topicId: (j < 5) ? i + 1 : i + 2 // 5 câu đầu từ topic 1, 5 câu sau từ topic 2
                });
            }

            console.log(`✅ Created ${config.questions.length} questions for ${config.name}`);
        }

        console.log('🎉 Seed questions and tests completed successfully!');
        console.log('📊 Total: 8 tests với 80 câu hỏi');

    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        console.error('Error details:', err);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
};

// Hàm tạo câu hỏi mẫu
function generateQuestions(topic1, topic2) {
    const questions = [];

    // 5 câu hỏi từ topic 1
    for (let i = 1; i <= 5; i++) {
        questions.push({
            content: `What is the meaning of the word from ${topic1} topic #${i}?`,
            options: JSON.stringify(['Option A', 'Option B', 'Option C', 'Option D']),
            answer: Math.floor(Math.random() * 4) // Random correct answer
        });
    }

    // 5 câu hỏi từ topic 2
    for (let i = 1; i <= 5; i++) {
        questions.push({
            content: `What is the meaning of the word from ${topic2} topic #${i}?`,
            options: JSON.stringify(['Option A', 'Option B', 'Option C', 'Option D']),
            answer: Math.floor(Math.random() * 4) // Random correct answer
        });
    }

    return questions;
}

seedQuestionsAndTests();