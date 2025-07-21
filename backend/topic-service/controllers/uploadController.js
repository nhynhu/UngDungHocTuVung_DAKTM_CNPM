const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cấu hình multer để upload vào uploads folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Đặt tên file theo topic name
        const { topicName } = req.body;
        const ext = path.extname(file.originalname);
        const fileName = topicName ? `${topicName.toLowerCase()}.jpg` : `topic-${Date.now()}${ext}`;
        cb(null, fileName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

/**
 * Upload image cho topic
 */
exports.uploadTopicImage = [
    upload.single('image'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No image file provided' });
            }

            const imagePath = `/uploads/${req.file.filename}`;

            res.json({
                message: 'Image uploaded successfully',
                imagePath,
                fileName: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size
            });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
];

/**
 * Lấy danh sách images có sẵn
 */
exports.getAvailableImages = async (req, res) => {
    try {
        const uploadsDir = path.join(__dirname, '../../uploads');

        if (!fs.existsSync(uploadsDir)) {
            return res.json({ images: [] });
        }

        const files = fs.readdirSync(uploadsDir);
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
        });

        const images = imageFiles.map(file => ({
            name: file,
            path: `/uploads/${file}`,
            size: fs.statSync(path.join(uploadsDir, file)).size
        }));

        res.json({ images });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};