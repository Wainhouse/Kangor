const { fetchArticleById, fetchAllArticles, fetchArticlesComments } = require("../models/articles.model");

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

exports.getArticles = (req, res) => {
    fetchAllArticles().then((data) => res.status(200).send(data))
}

exports.getArticlesComments = (req, res, next) => {
  const articleId = req.params.article_id;
  fetchArticleById(articleId)
    .then((data) => {
      if (data) return fetchArticlesComments(articleId);
      else Promise.reject({status: 404, msg:'Article not found'});
    })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      next(err);
    });
}
