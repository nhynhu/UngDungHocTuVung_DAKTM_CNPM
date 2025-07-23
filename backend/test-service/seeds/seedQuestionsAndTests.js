const path = require('path');
require('dotenv').config({
    path: path.join(__dirname, '../.env.seed')
});

const { sequelize } = require('../models');
const Question = require('../models/Question');
const Test = require('../models/Test');

// Dữ liệu từ vựng KHỚP VỚI TOPIC-SERVICE (cùng thứ tự và cùng ID)
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
            { english: 'Cow', vietnamese: 'Con bò' },
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
            { english: 'Son', vietnamese: 'Con trai' },
            { english: 'Daughter', vietnamese: 'Con gái' },
            { english: 'Grandfather', vietnamese: 'Ông' },
            { english: 'Grandmother', vietnamese: 'Bà' }
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
            { english: 'Pizza', vietnamese: 'Bánh pizza' }
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

const seedQuestionsAndTests = async () => {
    try {
        console.log('🔗 Connecting to test database...');
        console.log(`📍 Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

        await sequelize.authenticate();
        console.log('✅ Test database connected successfully');

        // SỬA LỖI: Reset database với foreign key constraints được disable
        console.log('🔄 Resetting database...');

        // Disable foreign key checks
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

        // Force sync để drop và tạo lại tables
        await sequelize.sync({ force: true });

        // Re-enable foreign key checks
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

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

            const test = await Test.create({
                name: config.name,
                description: config.description,
                topicIds: JSON.stringify(config.topicIds)
            });

            console.log(`✅ Created test: ${config.name} (ID: ${test.id})`);
            totalTests++;

            const topic1Data = topicWordsData[config.topic1];
            const topic2Data = topicWordsData[config.topic2];

            if (!topic1Data || !topic2Data) {
                console.warn(`⚠️ Missing topic data for ${config.topic1} or ${config.topic2}`);
                continue;
            }

            console.log(`   📝 Creating questions from ${topic1Data.name} (Topic ${config.topic1})...`);
            for (let i = 0; i < 5; i++) {
                const word = topic1Data.words[i];


                const wrongOptions = generateWrongOptions(word.vietnamese, config.topic1, word.english);


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
                console.log(`      ✓ Q${i + 1}: ${word.english} -> ${word.vietnamese} (position ${correctIndex})`);
                console.log(`         Options: ${shuffledOptions.join(', ')}`);
            }

            console.log(`✅ Test "${config.name}" completed with 10 questions`);
        }

        console.log(`\n🎉 Seed questions and tests completed successfully!`);
        console.log(`📊 Summary:`);
        console.log(`   • Tests created: ${totalTests}`);
        console.log(`   • Questions created: ${totalQuestions}`);
        console.log(`   • Topics covered: ${Object.keys(topicWordsData).length}`);

    } catch (err) {
        console.error('❌ Seed error:', err);
        throw err;
    } finally {
        await sequelize.close();
    }
};

// Function để tạo realistic wrong options
function generateWrongOptions(correctAnswer, currentTopicId, excludeWord) {
    const wrongOptions = [];
    const allTopics = Object.keys(topicWordsData);

    // Lấy từ sai từ cùng topic (nếu có đủ từ)
    const currentTopicWords = topicWordsData[currentTopicId].words
        .filter(word => word.vietnamese !== correctAnswer && word.english !== excludeWord)
        .map(word => word.vietnamese);

    if (currentTopicWords.length > 0) {
        const randomSameTopicWords = shuffleArray(currentTopicWords).slice(0, 2);
        wrongOptions.push(...randomSameTopicWords);
    }

    // Nếu chưa đủ 3 wrong options, lấy từ các topic khác
    while (wrongOptions.length < 3) {
        const randomTopicId = allTopics[Math.floor(Math.random() * allTopics.length)];
        const otherTopicWords = topicWordsData[randomTopicId].words
            .filter(word => word.vietnamese !== correctAnswer && !wrongOptions.includes(word.vietnamese))
            .map(word => word.vietnamese);

        if (otherTopicWords.length > 0) {
            const randomWord = otherTopicWords[Math.floor(Math.random() * otherTopicWords.length)];
            wrongOptions.push(randomWord);
        }
    }

    return wrongOptions.slice(0, 3);
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

// Chạy seeder nếu file được gọi trực tiếp
if (require.main === module) {
    seedQuestionsAndTests()
        .then(() => {
            console.log('✅ Test seeding completed successfully');
            process.exit(0);
        })
        .catch(err => {
            console.error('❌ Test seeding failed:', err);
            process.exit(1);
        });
}

module.exports = seedQuestionsAndTests;