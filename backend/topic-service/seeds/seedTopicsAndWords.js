require('dotenv').config({ path: require('path').join(__dirname, '../.env.seed') });
const { sequelize } = require('../models');
const Topic = require('../models/Topic');
const Word = require('../models/Word');

const seedTopicsAndWords = async () => {
    try {
        console.log('🔗 Connecting to database...');
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');

        // Drop và tạo lại tables
        await sequelize.sync({ force: true });
        console.log('🔄 Database reset successfully');

        // Dữ liệu từ vựng cho từng topic
        const topicsData = {
            'Animals': {
                nameVi: 'Động vật',
                image: 'animals.jpg',
                description: 'Các loài động vật phổ biến',
                words: [
                    { english: 'Dog', vietnamese: 'Con chó' },
                    { english: 'Cat', vietnamese: 'Con mèo' },
                    { english: 'Elephant', vietnamese: 'Con voi' },
                    { english: 'Tiger', vietnamese: 'Con hổ' },
                    { english: 'Lion', vietnamese: 'Con sư tử' },
                    { english: 'Horse', vietnamese: 'Con ngựa' },
                    { english: 'Cow', vietnamese: 'Con bò' },
                    { english: 'Pig', vietnamese: 'Con lợn' },
                    { english: 'Sheep', vietnamese: 'Con cừu' },
                    { english: 'Goat', vietnamese: 'Con dê' },
                    { english: 'Chicken', vietnamese: 'Con gà' },
                    { english: 'Duck', vietnamese: 'Con vịt' },
                    { english: 'Fish', vietnamese: 'Con cá' },
                    { english: 'Bird', vietnamese: 'Con chim' },
                    { english: 'Snake', vietnamese: 'Con rắn' },
                    { english: 'Frog', vietnamese: 'Con ếch' },
                    { english: 'Rabbit', vietnamese: 'Con thỏ' },
                    { english: 'Bear', vietnamese: 'Con gấu' },
                    { english: 'Monkey', vietnamese: 'Con khỉ' },
                    { english: 'Deer', vietnamese: 'Con hươu' }
                ]
            },
            'Body Parts': {
                nameVi: 'Bộ phận cơ thể',
                image: 'body-parts.png',
                description: 'Các bộ phận trên cơ thể người',
                words: [
                    { english: 'Head', vietnamese: 'Đầu' },
                    { english: 'Eye', vietnamese: 'Mắt' },
                    { english: 'Nose', vietnamese: 'Mũi' },
                    { english: 'Mouth', vietnamese: 'Miệng' },
                    { english: 'Ear', vietnamese: 'Tai' },
                    { english: 'Hair', vietnamese: 'Tóc' },
                    { english: 'Neck', vietnamese: 'Cổ' },
                    { english: 'Shoulder', vietnamese: 'Vai' },
                    { english: 'Arm', vietnamese: 'Cánh tay' },
                    { english: 'Hand', vietnamese: 'Bàn tay' },
                    { english: 'Finger', vietnamese: 'Ngón tay' },
                    { english: 'Chest', vietnamese: 'Ngực' },
                    { english: 'Back', vietnamese: 'Lưng' },
                    { english: 'Leg', vietnamese: 'Chân' },
                    { english: 'Knee', vietnamese: 'Đầu gối' },
                    { english: 'Foot', vietnamese: 'Bàn chân' },
                    { english: 'Toe', vietnamese: 'Ngón chân' },
                    { english: 'Elbow', vietnamese: 'Khuỷu tay' },
                    { english: 'Wrist', vietnamese: 'Cổ tay' },
                    { english: 'Hip', vietnamese: 'Hông' }
                ]
            },
            'Colors': {
                nameVi: 'Màu sắc',
                image: 'colors.jpg',
                description: 'Các màu sắc cơ bản',
                words: [
                    { english: 'Red', vietnamese: 'Màu đỏ' },
                    { english: 'Blue', vietnamese: 'Màu xanh dương' },
                    { english: 'Green', vietnamese: 'Màu xanh lá' },
                    { english: 'Yellow', vietnamese: 'Màu vàng' },
                    { english: 'Orange', vietnamese: 'Màu cam' },
                    { english: 'Purple', vietnamese: 'Màu tím' },
                    { english: 'Pink', vietnamese: 'Màu hồng' },
                    { english: 'Black', vietnamese: 'Màu đen' },
                    { english: 'White', vietnamese: 'Màu trắng' },
                    { english: 'Gray', vietnamese: 'Màu xám' },
                    { english: 'Brown', vietnamese: 'Màu nâu' },
                    { english: 'Gold', vietnamese: 'Màu vàng kim' },
                    { english: 'Silver', vietnamese: 'Màu bạc' },
                    { english: 'Cyan', vietnamese: 'Màu xanh lơ' },
                    { english: 'Magenta', vietnamese: 'Màu đỏ tía' },
                    { english: 'Lime', vietnamese: 'Màu vàng chanh' },
                    { english: 'Navy', vietnamese: 'Màu xanh navy' },
                    { english: 'Teal', vietnamese: 'Màu xanh mòng két' },
                    { english: 'Maroon', vietnamese: 'Màu nâu đỏ' },
                    { english: 'Olive', vietnamese: 'Màu ô liu' }
                ]
            },
            'Family': {
                nameVi: 'Gia đình',
                image: 'family.jpg',
                description: 'Các thành viên trong gia đình',
                words: [
                    { english: 'Father', vietnamese: 'Bố' },
                    { english: 'Mother', vietnamese: 'Mẹ' },
                    { english: 'Son', vietnamese: 'Con trai' },
                    { english: 'Daughter', vietnamese: 'Con gái' },
                    { english: 'Brother', vietnamese: 'Anh/Em trai' },
                    { english: 'Sister', vietnamese: 'Chị/Em gái' },
                    { english: 'Grandfather', vietnamese: 'Ông' },
                    { english: 'Grandmother', vietnamese: 'Bà' },
                    { english: 'Uncle', vietnamese: 'Chú/Bác' },
                    { english: 'Aunt', vietnamese: 'Cô/Dì' },
                    { english: 'Cousin', vietnamese: 'Anh/Chị/Em họ' },
                    { english: 'Nephew', vietnamese: 'Cháu trai' },
                    { english: 'Niece', vietnamese: 'Cháu gái' },
                    { english: 'Husband', vietnamese: 'Chồng' },
                    { english: 'Wife', vietnamese: 'Vợ' },
                    { english: 'Parent', vietnamese: 'Bố mẹ' },
                    { english: 'Child', vietnamese: 'Con' },
                    { english: 'Sibling', vietnamese: 'Anh chị em' },
                    { english: 'Relative', vietnamese: 'Họ hàng' },
                    { english: 'Baby', vietnamese: 'Em bé' }
                ]
            },
            'Food': {
                nameVi: 'Thực phẩm',
                image: 'food.png',
                description: 'Các loại thực phẩm và đồ uống',
                words: [
                    { english: 'Rice', vietnamese: 'Cơm' },
                    { english: 'Bread', vietnamese: 'Bánh mì' },
                    { english: 'Noodles', vietnamese: 'Mì' },
                    { english: 'Pizza', vietnamese: 'Bánh pizza' },
                    { english: 'Burger', vietnamese: 'Bánh hamburger' },
                    { english: 'Chicken', vietnamese: 'Thịt gà' },
                    { english: 'Fish', vietnamese: 'Cá' },
                    { english: 'Beef', vietnamese: 'Thịt bò' },
                    { english: 'Pork', vietnamese: 'Thịt lợn' },
                    { english: 'Egg', vietnamese: 'Trứng' },
                    { english: 'Milk', vietnamese: 'Sữa' },
                    { english: 'Cheese', vietnamese: 'Phô mai' },
                    { english: 'Apple', vietnamese: 'Táo' },
                    { english: 'Orange', vietnamese: 'Cam' },
                    { english: 'Banana', vietnamese: 'Chuối' },
                    { english: 'Potato', vietnamese: 'Khoai tây' },
                    { english: 'Tomato', vietnamese: 'Cà chua' },
                    { english: 'Carrot', vietnamese: 'Cà rốt' },
                    { english: 'Soup', vietnamese: 'Súp' },
                    { english: 'Salad', vietnamese: 'Salad' }
                ]
            },
            'Household Items': {
                nameVi: 'Đồ dùng gia đình',
                image: 'household-items.jpg',
                description: 'Các đồ dùng trong gia đình',
                words: [
                    { english: 'Table', vietnamese: 'Bàn' },
                    { english: 'Chair', vietnamese: 'Ghế' },
                    { english: 'Bed', vietnamese: 'Giường' },
                    { english: 'Sofa', vietnamese: 'Ghế sofa' },
                    { english: 'Television', vietnamese: 'Ti vi' },
                    { english: 'Refrigerator', vietnamese: 'Tủ lạnh' },
                    { english: 'Washing machine', vietnamese: 'Máy giặt' },
                    { english: 'Microwave', vietnamese: 'Lò vi sóng' },
                    { english: 'Stove', vietnamese: 'Bếp' },
                    { english: 'Oven', vietnamese: 'Lò nướng' },
                    { english: 'Clock', vietnamese: 'Đồng hồ' },
                    { english: 'Lamp', vietnamese: 'Đèn' },
                    { english: 'Mirror', vietnamese: 'Gương' },
                    { english: 'Curtain', vietnamese: 'Rèm cửa' },
                    { english: 'Carpet', vietnamese: 'Thảm' },
                    { english: 'Pillow', vietnamese: 'Gối' },
                    { english: 'Blanket', vietnamese: 'Chăn' },
                    { english: 'Towel', vietnamese: 'Khăn tắm' },
                    { english: 'Plate', vietnamese: 'Đĩa' },
                    { english: 'Cup', vietnamese: 'Cốc' }
                ]
            },
            'Jobs': {
                nameVi: 'Nghề nghiệp',
                image: 'jobs.png',
                description: 'Các nghề nghiệp phổ biến',
                words: [
                    { english: 'Teacher', vietnamese: 'Giáo viên' },
                    { english: 'Doctor', vietnamese: 'Bác sĩ' },
                    { english: 'Nurse', vietnamese: 'Y tá' },
                    { english: 'Engineer', vietnamese: 'Kỹ sư' },
                    { english: 'Lawyer', vietnamese: 'Luật sư' },
                    { english: 'Police officer', vietnamese: 'Cảnh sát' },
                    { english: 'Firefighter', vietnamese: 'Lính cứu hỏa' },
                    { english: 'Pilot', vietnamese: 'Phi công' },
                    { english: 'Chef', vietnamese: 'Đầu bếp' },
                    { english: 'Farmer', vietnamese: 'Nông dân' },
                    { english: 'Driver', vietnamese: 'Tài xế' },
                    { english: 'Mechanic', vietnamese: 'Thợ máy' },
                    { english: 'Artist', vietnamese: 'Nghệ sĩ' },
                    { english: 'Writer', vietnamese: 'Nhà văn' },
                    { english: 'Musician', vietnamese: 'Nhạc sĩ' },
                    { english: 'Scientist', vietnamese: 'Nhà khoa học' },
                    { english: 'Architect', vietnamese: 'Kiến trúc sư' },
                    { english: 'Accountant', vietnamese: 'Kế toán' },
                    { english: 'Dentist', vietnamese: 'Nha sĩ' },
                    { english: 'Soldier', vietnamese: 'Quân nhân' }
                ]
            },
            'Pets': {
                nameVi: 'Thú cưng',
                image: 'pets.jpg',
                description: 'Các loài thú cưng phổ biến',
                words: [
                    { english: 'Dog', vietnamese: 'Chó' },
                    { english: 'Cat', vietnamese: 'Mèo' },
                    { english: 'Fish', vietnamese: 'Cá' },
                    { english: 'Bird', vietnamese: 'Chim' },
                    { english: 'Rabbit', vietnamese: 'Thỏ' },
                    { english: 'Hamster', vietnamese: 'Chuột hamster' },
                    { english: 'Guinea pig', vietnamese: 'Chuột lang' },
                    { english: 'Turtle', vietnamese: 'Rùa' },
                    { english: 'Snake', vietnamese: 'Rắn' },
                    { english: 'Lizard', vietnamese: 'Thằn lằn' },
                    { english: 'Parrot', vietnamese: 'Vẹt' },
                    { english: 'Canary', vietnamese: 'Chim hoàng yến' },
                    { english: 'Goldfish', vietnamese: 'Cá vàng' },
                    { english: 'Tropical fish', vietnamese: 'Cá nhiệt đới' },
                    { english: 'Ferret', vietnamese: 'Chồn' },
                    { english: 'Hedgehog', vietnamese: 'Nhím' },
                    { english: 'Mouse', vietnamese: 'Chuột' },
                    { english: 'Rat', vietnamese: 'Chuột cống' },
                    { english: 'Chinchilla', vietnamese: 'Sóc Nam Mỹ' },
                    { english: 'Frog', vietnamese: 'Ếch' }
                ]
            },
            'School Supplies': {
                nameVi: 'Dụng cụ học tập',
                image: 'schoolsupplies.jpg',
                description: 'Các dụng cụ học tập cần thiết',
                words: [
                    { english: 'Pen', vietnamese: 'Bút mực' },
                    { english: 'Pencil', vietnamese: 'Bút chì' },
                    { english: 'Eraser', vietnamese: 'Tẩy' },
                    { english: 'Ruler', vietnamese: 'Thước kẻ' },
                    { english: 'Notebook', vietnamese: 'Vở' },
                    { english: 'Book', vietnamese: 'Sách' },
                    { english: 'Backpack', vietnamese: 'Ba lô' },
                    { english: 'Scissors', vietnamese: 'Kéo' },
                    { english: 'Glue', vietnamese: 'Keo dán' },
                    { english: 'Marker', vietnamese: 'Bút dạ' },
                    { english: 'Highlighter', vietnamese: 'Bút tô màu' },
                    { english: 'Calculator', vietnamese: 'Máy tính' },
                    { english: 'Paper', vietnamese: 'Giấy' },
                    { english: 'Folder', vietnamese: 'Bìa hồ sơ' },
                    { english: 'Stapler', vietnamese: 'Máy bấm kim' },
                    { english: 'Sharpener', vietnamese: 'Gọt bút chì' },
                    { english: 'Compass', vietnamese: 'Compa' },
                    { english: 'Protractor', vietnamese: 'Thước đo góc' },
                    { english: 'Crayon', vietnamese: 'Bút sáp' },
                    { english: 'Chalk', vietnamese: 'Phấn' }
                ]
            },
            'Weather': {
                nameVi: 'Thời tiết',
                image: 'weather.jpg',
                description: 'Các hiện tượng thời tiết',
                words: [
                    { english: 'Sunny', vietnamese: 'Nắng' },
                    { english: 'Rainy', vietnamese: 'Mưa' },
                    { english: 'Cloudy', vietnamese: 'Có mây' },
                    { english: 'Windy', vietnamese: 'Có gió' },
                    { english: 'Snowy', vietnamese: 'Có tuyết' },
                    { english: 'Stormy', vietnamese: 'Bão' },
                    { english: 'Foggy', vietnamese: 'Có sương mù' },
                    { english: 'Hot', vietnamese: 'Nóng' },
                    { english: 'Cold', vietnamese: 'Lạnh' },
                    { english: 'Warm', vietnamese: 'Ấm' },
                    { english: 'Cool', vietnamese: 'Mát' },
                    { english: 'Humid', vietnamese: 'Ẩm ướt' },
                    { english: 'Dry', vietnamese: 'Khô' },
                    { english: 'Thunder', vietnamese: 'Sấm' },
                    { english: 'Lightning', vietnamese: 'Chớp' },
                    { english: 'Hail', vietnamese: 'Mưa đá' },
                    { english: 'Drizzle', vietnamese: 'Mưa phùn' },
                    { english: 'Hurricane', vietnamese: 'Bão lớn' },
                    { english: 'Tornado', vietnamese: 'Lốc xoáy' },
                    { english: 'Rainbow', vietnamese: 'Cầu vồng' }
                ]
            }
        };

        // Tạo topics và words
        for (const [topicName, topicData] of Object.entries(topicsData)) {
            const topic = await Topic.create({
                name: topicName,
                nameVi: topicData.nameVi,
                image: `/uploads/${topicData.image}`,
                description: topicData.description
            });

            console.log(`✅ Created topic: ${topicName}`);

            // Tạo 20 từ cho mỗi topic
            for (const wordData of topicData.words) {
                await Word.create({
                    english: wordData.english,
                    vietnamese: wordData.vietnamese,
                    TopicId: topic.id
                });
            }

            console.log(`✅ Created ${topicData.words.length} words for ${topicName}`);
        }

        console.log('🎉 Seed topics and words completed successfully!');
        console.log(`📊 Total: ${Object.keys(topicsData).length} topics with ${Object.values(topicsData).reduce((sum, topic) => sum + topic.words.length, 0)} words`);

    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        console.error('Error details:', err);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
};

seedTopicsAndWords();