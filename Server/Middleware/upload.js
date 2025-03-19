const multer = require('multer');

const storage = multer.memoryStorage(); // Store files in memory (no disk storage)
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file limit
});

module.exports = upload;