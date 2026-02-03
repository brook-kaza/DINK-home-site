// Vercel serverless entry: forward all requests to the Express app.
// Keep this file minimal; most "serverless crashes" come from app startup errors.
try {
  // Express app is a (req, res) function; exporting it directly is the most compatible.
  module.exports = require('../app');
} catch (err) {
  console.error('Failed to load app:', err);
  module.exports = (req, res) => {
    res.status(500).type('text').send('Startup error. Check Vercel logs.');
  };
}
