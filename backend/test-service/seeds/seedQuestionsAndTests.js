const path = require('path');
require('dotenv').config({
    path: path.join(__dirname, '../.env.seed')
});

const { sequelize } = require('../models');
const Question = require('../models/Question');
const Test = require('../models/Test');

// Complete data cho 10 topics với nhiều từ hơn để tạo distractors
const topicWordsData = {
    1: { // Animals
        name: 'Animals',
        words: [
            { english: 'Dog', vietnamese: 'Con chó' },
            { english: 'Cat', vietnamese: 'Con mèo' },
            { english: 'Elephant', vietnamese: 'Con voi' },
            { english: 'Tiger', vietnamese: 'Con hổ' },
            { english: 'Lion', vietnamese: 'Con sư tử' },
            { english: 'Bear', vietnamese: 'Con gấu' },
            { english: 'Horse', vietnamese: 'Con ngựa' },
            { english: 'Pig', vietnamese: 'Con lợn' }
        ]
    },
    2: { // Body Parts
        name: 'Body Parts',
        words: [
            { english: 'Head', vietnamese: 'Đầu' },
            { english: 'Eye', vietnamese: 'Mắt' },
            { english: 'Nose', vietnamese: 'Mũi' },
            { english: 'Mouth', vietnamese: 'Miệng' },
            { english: 'Hand', vietnamese: 'Bàn tay' },
            { english: 'Foot', vietnamese: 'Bàn chân' },
            { english: 'Ear', vietnamese: 'Tai' },
            { english: 'Neck', vietnamese: 'Cổ' }
        ]
    },
    3: { // Colors
        name: 'Colors',
        words: [
            { english: 'Red', vietnamese: 'Màu đỏ' },
            { english: 'Blue', vietnamese: 'Màu xanh dương' },
            { english: 'Green', vietnamese: 'Màu xanh lá' },
            { english: 'Yellow', vietnamese: 'Màu vàng' },
            { english: 'Purple', vietnamese: 'Màu tím' },
            { english: 'Orange', vietnamese: 'Màu cam' },
            { english: 'Pink', vietnamese: 'Màu hồng' },
            { english: 'Black', vietnamese: 'Màu đen' }
        ]
    },
    4: { // Family
        name: 'Family',
        words: [
            { english: 'Father', vietnamese: 'Bố' },
            { english: 'Mother', vietnamese: 'Mẹ' },
            { english: 'Brother', vietnamese: 'Anh/Em trai' },
            { english: 'Sister', vietnamese: 'Chị/Em gái' },
            { english: 'Grandmother', vietnamese: 'Bà' },
            { english: 'Grandfather', vietnamese: 'Ông' },
            { english: 'Uncle', vietnamese: 'Chú/Bác' },
            { english: 'Aunt', vietnamese: 'Cô/Dì' }
        ]
    },
    5: { // Food
        name: 'Food',
        words: [
            { english: 'Rice', vietnamese: 'Cơm' },
            { english: 'Bread', vietnamese: 'Bánh mì' },
            { english: 'Noodles', vietnamese: 'Mì' },
            { english: 'Chicken', vietnamese: 'Thịt gà' },
            { english: 'Fish', vietnamese: 'Cá' },
            { english: 'Soup', vietnamese: 'Canh/Súp' },
            { english: 'Egg', vietnamese: 'Trứng' },
            { english: 'Fruit', vietnamese: 'Trái cây' }
        ]
    },
    6: { // Household Items
        name: 'Household Items',
        words: [
            { english: 'Table', vietnamese: 'Bàn' },
            { english: 'Chair', vietnamese: 'Ghế' },
            { english: 'Bed', vietnamese: 'Giường' },
            { english: 'Television', vietnamese: 'Ti vi' },
            { english: 'Refrigerator', vietnamese: 'Tủ lạnh' },
            { english: 'Sofa', vietnamese: 'Ghế sofa' },
            { english: 'Lamp', vietnamese: 'Đèn' },
            { english: 'Mirror', vietnamese: 'Gương' }
        ]
    },
    7: { // Jobs
        name: 'Jobs',
        words: [
            { english: 'Teacher', vietnamese: 'Giáo viên' },
            { english: 'Doctor', vietnamese: 'Bác sĩ' },
            { english: 'Engineer', vietnamese: 'Kỹ sư' },
            { english: 'Police', vietnamese: 'Cảnh sát' },
            { english: 'Nurse', vietnamese: 'Y tá' },
            { english: 'Driver', vietnamese: 'Tài xế' },
            { english: 'Chef', vietnamese: 'Đầu bếp' },
            { english: 'Student', vietnamese: 'Học sinh' }
        ]
    },
    8: { // Pets
        name: 'Pets',
        words: [
            { english: 'Dog', vietnamese: 'Con chó' },
            { english: 'Cat', vietnamese: 'Con mèo' },
            { english: 'Fish', vietnamese: 'Con cá' },
            { english: 'Bird', vietnamese: 'Con chim' },
            { english: 'Rabbit', vietnamese: 'Con thỏ' },
            { english: 'Hamster', vietnamese: 'Con chuột hamster' },
            { english: 'Turtle', vietnamese: 'Con rùa' },
            { english: 'Parrot', vietnamese: 'Con vẹt' }
        ]
    },
    9: { // School Supplies
        name: 'School Supplies',
        words: [
            { english: 'Pen', vietnamese: 'Bút mực' },
            { english: 'Pencil', vietnamese: 'Bút chì' },
            { english: 'Book', vietnamese: 'Sách' },
            { english: 'Eraser', vietnamese: 'Cục tẩy' },
            { english: 'Ruler', vietnamese: 'Thước' },
            { english: 'Notebook', vietnamese: 'Vở' },
            { english: 'Bag', vietnamese: 'Cặp sách' },
            { english: 'Calculator', vietnamese: 'Máy tính' }
        ]
    },
    10: { // Weather
        name: 'Weather',
        words: [
            { english: 'Sunny', vietnamese: 'Nắng' },
            { english: 'Rainy', vietnamese: 'Mưa' },
            { english: 'Cloudy', vietnamese: 'Có mây' },
            { english: 'Windy', vietnamese: 'Có gió' },
            { english: 'Snowy', vietnamese: 'Có tuyết' },
            { english: 'Hot', vietnamese: 'Nóng' },
            { english: 'Cold', vietnamese: 'Lạnh' },
            { english: 'Foggy', vietnamese: 'Có sương mù' }
        ]
    }
};

// Function để tạo realistic wrong options
function generateWrongOptions(correctAnswer, currentTopicId, excludeWord) {
    const wrongOptions = [];
    const allTopics = Object.keys(topicWordsData);

    // Lấy 1-2 từ sai từ cùng topic (nếu có đủ từ)
    const currentTopicWords = topicWordsData[currentTopicId].words
        .filter(word => word.vietnamese !== correctAnswer && word.english !== excludeWord)
        .map(word => word.vietnamese);

    if (currentTopicWords.length > 0) {
        const randomSameTopicWords = shuffleArray(currentTopicWords).slice(0, 3);
        wrongOptions.push(...randomSameTopicWords);
    }
    return wrongOptions;
}

// Utility function để shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

const seedQuestionsAndTests = async () => {
    try {
        console.log('🔗 Connecting to test database...');
        console.log(`📍 Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

        await sequelize.authenticate();
        console.log('✅ Test database connected successfully');

        // Reset database với force: true
        console.log('🔄 Resetting database...');
        await sequelize.sync({ force: true });
        console.log('✅ Test database reset successfully');

        // 8 bài test sử dụng đầy đủ 10 topics
        const testConfigs = [
            {
                name: 'Animals & Body Parts Test',
                description: 'Test từ vựng về động vật và bộ phận cơ thể',
                topicIds: [1, 2],
                topic1: 1,
                topic2: 2
            },
            {
                name: 'Colors & Family Test',
                description: 'Test từ vựng về màu sắc và gia đình',
                topicIds: [3, 4],
                topic1: 3,
                topic2: 4
            },
            {
                name: 'Food & Household Items Test',
                description: 'Test từ vựng về thức ăn và đồ gia dụng',
                topicIds: [5, 6],
                topic1: 5,
                topic2: 6
            },
            {
                name: 'Jobs & Pets Test',
                description: 'Test từ vựng về nghề nghiệp và thú cưng',
                topicIds: [7, 8],
                topic1: 7,
                topic2: 8
            },
            {
                name: 'School Supplies & Weather Test',
                description: 'Test từ vựng về đồ dùng học tập và thời tiết',
                topicIds: [9, 10],
                topic1: 9,
                topic2: 10
            },
            {
                name: 'Animals & Colors Test',
                description: 'Test từ vựng về động vật và màu sắc',
                topicIds: [1, 3],
                topic1: 1,
                topic2: 3
            },
            {
                name: 'Family & Food Test',
                description: 'Test từ vựng về gia đình và thức ăn',
                topicIds: [4, 5],
                topic1: 4,
                topic2: 5
            },
            {
                name: 'Jobs & Weather Test',
                description: 'Test từ vựng về nghề nghiệp và thời tiết',
                topicIds: [7, 10],
                topic1: 7,
                topic2: 10
            }
        ];

        let totalTests = 0;
        let totalQuestions = 0;

        for (const config of testConfigs) {
            console.log(`\n🏗️ Creating test: ${config.name}`);

            // Tạo test
            const test = await Test.create({
                name: config.name,
                description: config.description,
                topicIds: JSON.stringify(config.topicIds)
            });

            console.log(`✅ Created test: ${config.name} (ID: ${test.id})`);
            totalTests++;

            // Tạo 10 câu hỏi (5 từ mỗi topic)
            const topic1Data = topicWordsData[config.topic1];
            const topic2Data = topicWordsData[config.topic2];

            if (!topic1Data || !topic2Data) {
                console.warn(`⚠️ Missing topic data for ${config.topic1} or ${config.topic2}`);
                continue;
            }

            // 5 câu từ topic 1
            console.log(`   📝 Creating questions from ${topic1Data.name} (Topic ${config.topic1})...`);
            for (let i = 0; i < 5; i++) {
                const word = topic1Data.words[i];

                // Tạo wrong options realistic
                const wrongOptions = generateWrongOptions(word.vietnamese, config.topic1, word.english);

                // Tạo 4 options và shuffle
                const allOptions = [word.vietnamese, ...wrongOptions];
                const shuffledOptions = shuffleArray(allOptions);
                const correctIndex = shuffledOptions.indexOf(word.vietnamese);

                const question = await Question.create({
                    content: `What is the Vietnamese meaning of "${word.english}"?`,
                    options: JSON.stringify(shuffledOptions),
                    answer: correctIndex,
                    topicId: config.topic1,
                    TestId: test.id
                });
                totalQuestions++;
                console.log(`      ✓ Q${i + 1}: ${word.english} -> ${word.vietnamese} (position ${correctIndex})`);
                console.log(`         Options: ${shuffledOptions.join(', ')}`);
            }

            // 5 câu từ topic 2
            console.log(`   📝 Creating questions from ${topic2Data.name} (Topic ${config.topic2})...`);
            for (let i = 0; i < 5; i++) {
                const word = topic2Data.words[i];

                const wrongOptions = generateWrongOptions(word.vietnamese, config.topic2, word.english);

                const allOptions = [word.vietnamese, ...wrongOptions];
                const shuffledOptions = shuffleArray(allOptions);
                const correctIndex = shuffledOptions.indexOf(word.vietnamese);

                const question = await Question.create({
                    content: `What is the Vietnamese meaning of "${word.english}"?`,
                    options: JSON.stringify(shuffledOptions),
                    answer: correctIndex,
                    topicId: config.topic2,
                    TestId: test.id
                });
                totalQuestions++;
                console.log(`      ✓ Q${i + 6}: ${word.english} -> ${word.vietnamese} (position ${correctIndex})`);
                console.log(`         Options: ${shuffledOptions.join(', ')}`);
            }

            console.log(`✅ Created 10 questions for ${config.name}`);
        }

        console.log('\n🎉 Seed questions and tests completed successfully!');
        console.log(`📊 Summary:`);
        console.log(`   • Tests created: ${totalTests}`);
        console.log(`   • Questions created: ${totalQuestions}`);
        console.log(`   • Topics covered: All 10 topics`);
        console.log(`   • Average questions per test: ${totalQuestions / totalTests}`);

        // Verify data
        const testCount = await Test.count();
        const questionCount = await Question.count();

        console.log(`\n✅ Database verification:`);
        console.log(`   • Tests in DB: ${testCount}`);
        console.log(`   • Questions in DB: ${questionCount}`);

        // Show topic coverage
        console.log(`\n📋 Topic Coverage Summary:`);
        testConfigs.forEach((config, index) => {
            console.log(`   Test ${index + 1}: ${config.name}`);
            console.log(`           Topics: ${config.topicIds.join(' & ')} (${topicWordsData[config.topic1].name} & ${topicWordsData[config.topic2].name})`);
        });

    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        console.error('📍 Error location:', err.stack);
    } finally {
        console.log('\n🔌 Closing database connection...');
        await sequelize.close();
        console.log('✅ Database connection closed');
        process.exit(0);
    }
};

// Run seeding
console.log('🚀 Starting test data seeding...');
seedQuestionsAndTests();