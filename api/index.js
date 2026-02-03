// Vercel serverless entry: forwards all requests to the Express app
let app;
try {
  app = require('../app');
  console.log('✅ App loaded successfully');
} catch (err) {
  console.error('❌ Failed to load app:', err);
  console.error('Stack:', err.stack);
  // Return a handler that shows the error
  module.exports = (req, res) => {
    console.error('Startup error on request:', err.message);
    res.status(500).type('text').send(`Startup error: ${err.message}\n\nCheck Vercel logs for details.`);
  };
  return;
}

// Wrap app to catch any unhandled errors
const handler = (req, res) => {
  try {
    app(req, res);
  } catch (err) {
    console.error('Unhandled error in handler:', err);
    if (!res.headersSent) {
      res.status(500).send('Internal server error. Please try again.');
    }
  }
};

module.exports = handler;
