const Interview = require("../models/Interview");

exports.saveInterview = async (req, res) => {
  try {
    const interview = new Interview(req.body);
    await interview.save();
    res.status(201).json({ message: "Interview data saved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save interview" });
  }
};
