const NewsArticle = require('../models/NewsArticle');
const getNews = async (req, res, next) => {
  try {
    const news = await NewsArticle.find().sort({ datePublished: -1 });
    res.json(news);
  } catch (error) { next(error); }
};
module.exports = { getNews };
