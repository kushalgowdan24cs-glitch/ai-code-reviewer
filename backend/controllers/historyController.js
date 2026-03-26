const { getAllReviews, getReviewById } = require("../services/historyService");

const getHistory = async (req, res) => {
  try {
    const reviews = await getAllReviews();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history." });
  }
};

const getReview = async (req, res) => {
  try {
    const review = await getReviewById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found." });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch review." });
  }
};

module.exports = { getHistory, getReview };