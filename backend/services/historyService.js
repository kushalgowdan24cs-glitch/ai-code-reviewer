const Review = require("../models/Review");

const getAllReviews = async (userId) => {
  return await Review.find({ userId })
    .sort({ createdAt: -1 })
    .select("language score grade summary createdAt")
    .limit(20);
};
const getReviewById = async (id) => {
  return await Review.findById(id);
};

module.exports = { getAllReviews, getReviewById };