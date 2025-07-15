// backend/routes/judgeRoutes.js
const express = require('express');
const router = express.Router();
const runCode = require('../utils/judge0');

// backend/routes/judgeRoutes.js
router.post('/', async (req, res) => {
  try {
    const result = await runCode(req.body);
    res.json(result);
  } catch (err) {
    console.error("Judge error:", err); // 🔍 Log full error
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

module.exports = router;
