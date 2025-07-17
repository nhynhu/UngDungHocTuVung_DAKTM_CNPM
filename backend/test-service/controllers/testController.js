const Test = require('../models/Test');
const Question = require('../models/Question');
const Word = require('../../topic-service/models/Word');

exports.createTest = async (req, res) => {
    try {
        const { name, topicIds } = req.body;
        if (!Array.isArray(topicIds) || topicIds.length !== 2)
            return res.status(400).json({ error: 'You must provide exactly 2 topic IDs' });

        const test = await Test.create({ name, topicIds });
        res.json(test);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.generateQuestions = async (req, res) => {
    try {
        const testId = req.params.id;
        const test = await Test.findByPk(testId);
        if (!test) return res.status(404).json({ error: 'Test not found' });

        const [topic1, topic2] = test.topicIds;
        const words1 = await Word.findAll({ where: { TopicId: topic1 }, limit: 5 });
        const words2 = await Word.findAll({ where: { TopicId: topic2 }, limit: 5 });
        const words = [...words1, ...words2];

        const questions = [];

        for (const word of words) {
            const options = new Set([word.vietnamese]);
            while (options.size < 4) {
                const random = words[Math.floor(Math.random() * words.length)].vietnamese;
                options.add(random);
            }
            const shuffledOptions = Array.from(options).sort(() => 0.5 - Math.random());

            const content = `What is the meaning of the word '${word.english}'?`;
            const question = await Question.create({ content, options: shuffledOptions, answer: word.vietnamese, topicId: word.TopicId });
            questions.push(question);
        }

        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
