const {
  fetchArticleById,
  fetchAllArticles,
  fetchArticlesComments,
  updateArticle,
} = require("../models/articles.model");

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
  fetchAllArticles().then((data) => res.status(200).send(data));
};

exports.getArticlesComments = (req, res, next) => {
  const articleId = req.params.article_id;
  fetchArticleById(articleId)
    .then((data) => {
      res.status(200).send({ comments: data });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticles = (req, res, next) => {
  const voteNum = req.body.inc_votes;
  const articleId = req.params.article_id;
  fetchArticleById(articleId)
    .then((data) => {
      if (data) {
        return updateArticle(data, voteNum);
      }
    })
    .then((data) => res.status(200).send({ article: data }))
    .catch((err) => {
      next(err);
    });
};
