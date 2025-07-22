const { Topic, Word } = require('../models');

exports.getAllTopics = async (req, res) => {
    try {
        const topics = await Topic.findAll({
            include: [{
                model: Word,
                as: 'words',
                attributes: ['id']
            }],
            order: [['id', 'ASC']]
        });

        const formattedTopics = topics.map(topic => ({
            id: topic.id,
            name: topic.name,
            nameVi: topic.nameVi,
            description: topic.description,
            image: topic.image,
            wordCount: topic.words ? topic.words.length : 0,
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

exports.healthCheck = (req, res) => {
    res.json({
        service: 'topic-service',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime())
    });
};
