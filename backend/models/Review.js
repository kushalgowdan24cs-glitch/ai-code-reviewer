// Review.js — Database schema for storing code reviews
const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  type:    { type: String },
  line:    { type: String },
  message: { type: String },
});

const reviewSchema = new mongoose.Schema({
  language:     { type: String, required: true },
  code:         { type: String, required: true },
  issues:       [issueSchema],
  suggestions:  [String],
  improved_code:{ type: String },
  score:        { type: Number },
  grade:        { type: String },
  summary:      { type: String },
  createdAt:    { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", reviewSchema);