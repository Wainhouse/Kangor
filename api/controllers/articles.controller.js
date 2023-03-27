const { fetchArticleById } = require("../models/articles.model");

exports.getArticlesById = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleById(article_id)
      .then((article) => {
        res.status(200).send({ article });
      })
      .catch((err) => {
        next(err);
      });
  };
  