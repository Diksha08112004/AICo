const router = require('express').Router();
const aiService = require('../services/aiService');

router.post('/chat', async (req, res) => {
  try {
    const { messages, context } = req.body || {};
    const reply = await aiService.chat(messages || [], context || {});
    res.json({ reply });
  } catch (e) {
    res.status(500).json({ error: 'AI_ERROR', detail: e?.message || 'Unknown error' });
  }
});

module.exports = router;
