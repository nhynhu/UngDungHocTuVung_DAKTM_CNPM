const Topic = require('../models/Topic');
const Word = require('../models/Word');
const path = require('path');
const fs = require('fs');

// Sửa imageMapping theo files thực tế trong uploads
const getTopicImageFromUploads = (topicName) => {
    const imageMapping = {
        'Animals': 'animals.jpg',
        'Body Parts': 'body-parts.png',
        'Colors': 'colors.jpg',  // SỬA: 'Color' thành 'Colors'
        'Family': 'family.jpg',
        'Food': 'food.png',
        'Household Items': 'household-items.jpg',
        'Jobs': 'jobs.png',
        'Pets': 'pets.jpg',
        'School Supplies': 'schoolsupplies.jpg',
        'Weather': 'weather.jpg'
    };

    const imageName = imageMapping[topicName];
    if (imageName) {
        // SỬA LỖI: Đường dẫn đúng từ topic-service root
        const imagePath = path.join(__dirname, '../uploads', imageName);
        if (fs.existsSync(imagePath)) {
            return `/uploads/${imageName}`;
        }
    }
    return '/uploads/default-topic.jpg';  // Fallback image
};

/**
 * Tạo topic mới - CẬP NHẬT LOGIC IMAGE
 */
exports.createTopic = async (req, res) => {
    try {
        const { name, nameVi, description } = req.body;

        // Check if topic exists
        const exists = await Topic.findOne({ where: { name } });
        if (exists) {
            return res.status(409).json({ error: 'Topic already exists' });
        }

        // TỰ ĐỘNG SET IMAGE theo name
        const autoImage = getTopicImageFromUploads(name);
        const finalImage = autoImage || '/uploads/default-topic.jpg';

        // Tạo topic với image tự động
        const topic = await Topic.create({
            name,
            nameVi,
            image: finalImage, // AUTO SET
            description
        });

        res.status(201).json({
            id: topic.id,
            name: topic.name,
            nameVi: topic.nameVi,
            image: finalImage, // Trả về image đã set
            description: topic.description,
            message: `Topic created with auto image: ${finalImage}`
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Update topic - THÊM KHẢ NĂNG UPDATE IMAGE
 */
exports.updateTopic = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, nameVi, description } = req.body;

        const topic = await Topic.findByPk(id);
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }

        // Nếu đổi name, tự động update image
        let finalImage = topic.image;
        if (name && name !== topic.name) {
            const autoImage = getTopicImageFromUploads(name);
            finalImage = autoImage || topic.image || '/uploads/default-topic.jpg';
        }

        // Update topic
        await topic.update({
            name: name || topic.name,
            nameVi: nameVi || topic.nameVi,
            image: finalImage,
            description: description || topic.description
        });

        res.json({
            id: topic.id,
            name: topic.name,
            nameVi: topic.nameVi,
            image: finalImage,
            description: topic.description,
            message: 'Topic updated successfully'
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * API chính cho Learn page - CHỈ SỬA LOGIC TRẢ VỀ
 */
exports.getAllTopics = async (req, res) => {
    try {
        const topics = await Topic.findAll({
            include: [{
                model: Word,
                as: 'words',
                attributes: ['id'] // Chỉ lấy id để đếm
            }],
            order: [['id', 'ASC']]
        });

        // Format theo yêu cầu của frontend
        const formattedTopics = topics.map(topic => ({
            id: topic.id,
            name: topic.name,
            nameVi: topic.nameVi,
            description: topic.description,
            image: topic.image, // Đã có format /uploads/...
            wordCount: topic.words ? topic.words.length : 0,
            // SỬA LỖI: Thêm các field cần thiết cho TopicCard
            title: topic.nameVi || topic.name,
            text: topic.description || `Học từ vựng về ${topic.nameVi || topic.name}`,
            link: `/lessons?topicId=${topic.id}`
        }));

        console.log(`✅ Found ${formattedTopics.length} topics`);
        res.json(formattedTopics);

    } catch (err) {
        console.error('Get all topics error:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.getTopicById = async (req, res) => {
    try {
        const topic = await Topic.findByPk(req.params.id, {
            include: [{
                model: Word,
                as: 'words'
            }]
        });

        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }

        res.json(topic);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTopic = async (req, res) => {
    try {
        const topic = await Topic.findByPk(req.params.id);

        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }

        await topic.destroy();
        res.json({ message: 'Topic deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.healthCheck = (req, res) => {
    res.json({
        service: 'topic-service',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime())
    });
};