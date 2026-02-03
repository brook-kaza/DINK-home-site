// Vercel serverless entry: forwards all requests to the Express app
let app;
try {
  app = require('../app');
} catch (err) {
  console.error('Failed to load app:', err);
  module.exports = (req, res) => {
    res.status(500).type('text').send(`Startup error: ${err.message}`);
  };
  return;
}
module.exports = app;
