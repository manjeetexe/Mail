const multer = require('multer');

const storage = multer.memoryStorage(); // Stores files in memory
const upload = multer({ storage });

module.exports = upload;