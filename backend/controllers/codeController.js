const { runJudge0 } = require("../utils/judge0");

exports.executeCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin } = req.body;
    const result = await runJudge0(source_code, language_id, stdin);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Code execution failed" });
  }
};
