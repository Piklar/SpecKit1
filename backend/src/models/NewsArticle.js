const mongoose = require('mongoose');
const newsArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  datePublished: { type: Date, default: Date.now },
  source: String
});
module.exports = mongoose.model('NewsArticle', newsArticleSchema);
