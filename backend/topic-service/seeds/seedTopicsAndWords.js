require('dotenv').config({ path: require('path').join(__dirname, '../.env.seed') });
const fs = require('fs');
const path = require('path');

const createPlaceholderImages = () => {
    const uploadsDir = path.join(__dirname, '../uploads');

    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log('📁 Created uploads directory');
    }

    // SỬA LỖI: Tạo ảnh SVG thực sự thay vì text
    const createSVGImage = (emoji, text, color) => {
        return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="200" fill="${color}"/>
  <text x="150" y="80" font-family="Arial, sans-serif" font-size="40" text-anchor="middle" fill="white">${emoji}</text>
  <text x="150" y="130" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="white" font-weight="bold">${text}</text>
</svg>`;
    };

    const imageFiles = [
        { name: 'animals.jpg', content: createSVGImage('🐕', 'Animals', '#e74c3c') },
        { name: 'body-parts.png', content: createSVGImage('👤', 'Body Parts', '#3498db') },
        { name: 'colors.jpg', content: createSVGImage('🎨', 'Colors', '#9b59b6') },
        { name: 'family.jpg', content: createSVGImage('👨‍👩‍👧‍👦', 'Family', '#e67e22') },
        { name: 'food.png', content: createSVGImage('🍎', 'Food', '#27ae60') },
        { name: 'household-items.jpg', content: createSVGImage('🏠', 'Household', '#34495e') },
        { name: 'jobs.png', content: createSVGImage('👨‍💼', 'Jobs', '#f39c12') },
        { name: 'pets.jpg', content: createSVGImage('🐈', 'Pets', '#e91e63') },
        { name: 'schoolsupplies.jpg', content: createSVGImage('✏️', 'School', '#2196f3') },
        { name: 'weather.jpg', content: createSVGImage('☀️', 'Weather', '#ff9800') },
        { name: 'default-topic.jpg', content: createSVGImage('📚', 'Topic', '#607d8b') }
    ];

    imageFiles.forEach(({ name, content }) => {
        const filePath = path.join(uploadsDir, name);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`📷 Created SVG image: ${name}`);
    });
};

const { sequelize } = require('../models');
const { Topic, Word } = require('../models');

const seedTopicsAndWords = async () => {
    try {
        console.log('🌱 Starting topics and words seeding...');

        // SỬA LỖI: Tạo ảnh TRƯỚC khi seed data
        createPlaceholderImages();

        // Clear existing data
        await Word.destroy({ where: {} });
        await Topic.destroy({ where: {} });

        const topicsData = {
            'Animals': {
                nameVi: 'Động vật',
                description: 'Các loài động vật phổ biến',
                image: 'animals.jpg',
                words: [
                    { english: 'cat', vietnamese: 'con mèo' },
                    { english: 'dog', vietnamese: 'con chó' },
                    { english: 'bird', vietnamese: 'con chim' },
                    { english: 'fish', vietnamese: 'con cá' },
                    { english: 'horse', vietnamese: 'con ngựa' },
                    { english: 'cow', vietnamese: 'con bò' },
                    { english: 'pig', vietnamese: 'con heo' },
                    { english: 'chicken', vietnamese: 'con gà' },
                    { english: 'duck', vietnamese: 'con vịt' },
                    { english: 'rabbit', vietnamese: 'con thỏ' },
                    { english: 'elephant', vietnamese: 'con voi' },
                    { english: 'lion', vietnamese: 'con sư tử' },
                    { english: 'tiger', vietnamese: 'con hổ' },
                    { english: 'bear', vietnamese: 'con gấu' },
                    { english: 'monkey', vietnamese: 'con khỉ' },
                    { english: 'snake', vietnamese: 'con rắn' },
                    { english: 'mouse', vietnamese: 'con chuột' },
                    { english: 'sheep', vietnamese: 'con cừu' },
                    { english: 'goat', vietnamese: 'con dê' },
                    { english: 'frog', vietnamese: 'con ếch' }
                ]
            },
            'Body Parts': {
                nameVi: 'Bộ phận cơ thể',
                description: 'Các bộ phận trên cơ thể người',
                image: 'body-parts.png',
                words: [
                    { english: 'head', vietnamese: 'đầu' },
                    { english: 'eye', vietnamese: 'mắt' },
                    { english: 'nose', vietnamese: 'mũi' },
                    { english: 'mouth', vietnamese: 'miệng' },
                    { english: 'ear', vietnamese: 'tai' },
                    { english: 'hand', vietnamese: 'tay' },
                    { english: 'foot', vietnamese: 'chân' },
                    { english: 'arm', vietnamese: 'cánh tay' },
                    { english: 'leg', vietnamese: 'chân' },
                    { english: 'finger', vietnamese: 'ngón tay' },
                    { english: 'toe', vietnamese: 'ngón chân' },
                    { english: 'hair', vietnamese: 'tóc' },
                    { english: 'face', vietnamese: 'mặt' },
                    { english: 'neck', vietnamese: 'cổ' },
                    { english: 'shoulder', vietnamese: 'vai' },
                    { english: 'back', vietnamese: 'lưng' },
                    { english: 'chest', vietnamese: 'ngực' },
                    { english: 'stomach', vietnamese: 'bụng' },
                    { english: 'knee', vietnamese: 'đầu gối' },
                    { english: 'elbow', vietnamese: 'khuỷu tay' }
                ]
            },
            'Colors': {
                nameVi: 'Màu sắc',
                description: 'Các màu sắc cơ bản',
                image: 'colors.jpg',
                words: [
                    { english: 'red', vietnamese: 'màu đỏ' },
                    { english: 'blue', vietnamese: 'màu xanh dương' },
                    { english: 'green', vietnamese: 'màu xanh lá' },
                    { english: 'yellow', vietnamese: 'màu vàng' },
                    { english: 'orange', vietnamese: 'màu cam' },
                    { english: 'purple', vietnamese: 'màu tím' },
                    { english: 'pink', vietnamese: 'màu hồng' },
                    { english: 'brown', vietnamese: 'màu nâu' },
                    { english: 'black', vietnamese: 'màu đen' },
                    { english: 'white', vietnamese: 'màu trắng' },
                    { english: 'gray', vietnamese: 'màu xám' },
                    { english: 'silver', vietnamese: 'màu bạc' },
                    { english: 'gold', vietnamese: 'màu vàng kim' },
                    { english: 'violet', vietnamese: 'màu tím violet' },
                    { english: 'indigo', vietnamese: 'màu chàm' },
                    { english: 'turquoise', vietnamese: 'màu lam ngọc' },
                    { english: 'maroon', vietnamese: 'màu nâu đỏ' },
                    { english: 'navy', vietnamese: 'màu xanh đậm' },
                    { english: 'olive', vietnamese: 'màu ô liu' },
                    { english: 'lime', vietnamese: 'màu xanh chanh' }
                ]
            },
            'Family': {
                nameVi: 'Gia đình',
                image: 'family.jpg',
                description: 'Các thành viên trong gia đình',
                words: [
                    { english: 'Father', vietnamese: 'Bố' },
                    { english: 'Mother', vietnamese: 'Mẹ' },
                    { english: 'Brother', vietnamese: 'Anh/Em trai' },
                    { english: 'Sister', vietnamese: 'Chị/Em gái' },
                    { english: 'Son', vietnamese: 'Con trai' },
                    { english: 'Daughter', vietnamese: 'Con gái' },
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
                    { english: 'Chicken', vietnamese: 'Thịt gà' },
                    { english: 'Fish', vietnamese: 'Cá' },
                    { english: 'Soup', vietnamese: 'Canh/Súp' },
                    { english: 'Egg', vietnamese: 'Trứng' },
                    { english: 'Pizza', vietnamese: 'Bánh pizza' },
                    { english: 'Burger', vietnamese: 'Bánh hamburger' },
                    { english: 'Beef', vietnamese: 'Thịt bò' },
                    { english: 'Pork', vietnamese: 'Thịt lợn' },
                    { english: 'Milk', vietnamese: 'Sữa' },
                    { english: 'Cheese', vietnamese: 'Phô mai' },
                    { english: 'Apple', vietnamese: 'Táo' },
                    { english: 'Orange', vietnamese: 'Cam' },
                    { english: 'Banana', vietnamese: 'Chuối' },
                    { english: 'Potato', vietnamese: 'Khoai tây' },
                    { english: 'Tomato', vietnamese: 'Cà chua' },
                    { english: 'Carrot', vietnamese: 'Cà rốt' },
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
                    { english: 'Television', vietnamese: 'Ti vi' },
                    { english: 'Refrigerator', vietnamese: 'Tủ lạnh' },
                    { english: 'Sofa', vietnamese: 'Ghế sofa' },
                    { english: 'Lamp', vietnamese: 'Đèn' },
                    { english: 'Mirror', vietnamese: 'Gương' },
                    { english: 'Washing machine', vietnamese: 'Máy giặt' },
                    { english: 'Microwave', vietnamese: 'Lò vi sóng' },
                    { english: 'Stove', vietnamese: 'Bếp' },
                    { english: 'Oven', vietnamese: 'Lò nướng' },
                    { english: 'Clock', vietnamese: 'Đồng hồ' },
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
                    { english: 'Engineer', vietnamese: 'Kỹ sư' },
                    { english: 'Police', vietnamese: 'Cảnh sát' },
                    { english: 'Nurse', vietnamese: 'Y tá' },
                    { english: 'Driver', vietnamese: 'Tài xế' },
                    { english: 'Chef', vietnamese: 'Đầu bếp' },
                    { english: 'Student', vietnamese: 'Học sinh' },
                    { english: 'Lawyer', vietnamese: 'Luật sư' },
                    { english: 'Firefighter', vietnamese: 'Lính cứu hỏa' },
                    { english: 'Pilot', vietnamese: 'Phi công' },
                    { english: 'Farmer', vietnamese: 'Nông dân' },
                    { english: 'Mechanic', vietnamese: 'Thợ máy' },
                    { english: 'Artist', vietnamese: 'Nghệ sĩ' },
                    { english: 'Writer', vietnamese: 'Nhà văn' },
                    { english: 'Musician', vietnamese: 'Nhạc sĩ' },
                    { english: 'Scientist', vietnamese: 'Nhà khoa học' },
                    { english: 'Architect', vietnamese: 'Kiến trúc sư' },
                    { english: 'Accountant', vietnamese: 'Kế toán' },
                    { english: 'Dentist', vietnamese: 'Nha sĩ' }
                ]
            },
            'Pets': {
                nameVi: 'Thú cưng',
                image: 'pets.jpg',
                description: 'Các loài thú cưng phổ biến',
                words: [
                    { english: 'Dog', vietnamese: 'Con chó' },
                    { english: 'Cat', vietnamese: 'Con mèo' },
                    { english: 'Fish', vietnamese: 'Con cá' },
                    { english: 'Bird', vietnamese: 'Con chim' },
                    { english: 'Rabbit', vietnamese: 'Con thỏ' },
                    { english: 'Hamster', vietnamese: 'Con chuột hamster' },
                    { english: 'Turtle', vietnamese: 'Con rùa' },
                    { english: 'Parrot', vietnamese: 'Con vẹt' },
                    { english: 'Guinea pig', vietnamese: 'Chuột lang' },
                    { english: 'Snake', vietnamese: 'Rắn' },
                    { english: 'Lizard', vietnamese: 'Thằn lằn' },
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
                    { english: 'Book', vietnamese: 'Sách' },
                    { english: 'Eraser', vietnamese: 'Cục tẩy' },
                    { english: 'Ruler', vietnamese: 'Thước' },
                    { english: 'Notebook', vietnamese: 'Vở' },
                    { english: 'Bag', vietnamese: 'Cặp sách' },
                    { english: 'Calculator', vietnamese: 'Máy tính' },
                    { english: 'Backpack', vietnamese: 'Ba lô' },
                    { english: 'Scissors', vietnamese: 'Kéo' },
                    { english: 'Glue', vietnamese: 'Keo dán' },
                    { english: 'Marker', vietnamese: 'Bút dạ' },
                    { english: 'Highlighter', vietnamese: 'Bút tô màu' },
                    { english: 'Paper', vietnamese: 'Giấy' },
                    { english: 'Folder', vietnamese: 'Bìa hồ sơ' },
                    { english: 'Stapler', vietnamese: 'Máy bấm kim' },
                    { english: 'Sharpener', vietnamese: 'Gọt bút chì' },
                    { english: 'Compass', vietnamese: 'Compa' },
                    { english: 'Protractor', vietnamese: 'Thước đo góc' },
                    { english: 'Crayon', vietnamese: 'Bút sáp' }
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
                    { english: 'Hot', vietnamese: 'Nóng' },
                    { english: 'Cold', vietnamese: 'Lạnh' },
                    { english: 'Foggy', vietnamese: 'Có sương mù' },
                    { english: 'Stormy', vietnamese: 'Bão' },
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

        for (const [topicName, topicInfo] of Object.entries(topicsData)) {
            const topic = await Topic.create({
                name: topicName,
                nameVi: topicInfo.nameVi,
                description: topicInfo.description,
                image: `/uploads/${topicInfo.image}`
            });

            console.log(`✅ Created topic: ${topicName} with image: ${topic.image}`);

            // Tạo từ vựng
            for (const wordData of topicInfo.words) {
                await Word.create({
                    english: wordData.english,
                    vietnamese: wordData.vietnamese,
                    TopicId: topic.id
                });
            }
        }

        console.log('🎉 Seed completed successfully!');

    } catch (err) {
        console.error('❌ Seed error:', err);
        throw err;
    } finally {
        await sequelize.close();
    }
};

if (require.main === module) {
    seedTopicsAndWords()
        .then(() => {
            console.log('✅ Seeding finished');
            process.exit(0);
        })
        .catch(err => {
            console.error('❌ Seeding failed:', err);
            process.exit(1);
        });
}

module.exports = seedTopicsAndWords;