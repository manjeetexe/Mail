const http = require('http');
const app = require('./app');

const server =http.createServer(app);

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});