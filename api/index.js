// Vercel serverless entry: forwards all requests to the Express app
let app;
try {
  app = require('../app');
  console.log('✅ App loaded successfully');
} catch (err) {
  console.error('❌ Failed to load app:', err);
  console.error('Stack:', err.stack);
  module.exports = (req, res) => {
    res.status(500).type('text').send(`Startup error: ${err.message}\n\nCheck Vercel logs for details.`);
  };
  return;
}

// Export the Express app
module.exports = app;
