const express = require("express");
const router = express.Router();

const { getHistory, getReview, removeReview, editReview } = require("../controllers/historyController");
const { protect } = require("../middleware/authMiddleware");

// Get all user history
router.get("/", protect, getHistory);

// Get single review
router.get("/:id", protect, getReview);


// Delete review
router.delete("/:id", protect, async (req, res) => {
  try {
    const Review = require("../models/Review");

    await Review.deleteOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

// Rename review
router.put("/:id", protect, async (req, res) => {
  try {
    const Review = require("../models/Review");
    const { title } = req.body;

    await Review.updateOne(
      { _id: req.params.id, userId: req.user.userId },
      { $set: { summary: title } }
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;