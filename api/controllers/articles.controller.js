const {
  fetchArticleById,
  fetchAllArticles,
  fetchArticlesComments,
  updateArticle,
  addComment,
  addArticle,
  deleteCommentByID,
  deleteArticleByID,
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
exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  fetchAllArticles({ sort_by, order, topic })
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      next(err);
    });
};
exports.getArticlesComments = (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.p) || 1;
  const articleId = req.params.article_id;
  fetchArticleById(articleId)
    .then((data) => {
      if (data) return fetchArticlesComments(articleId, limit, page);
      else Promise.reject({ status: 404, msg: "Article not found" });
    })
    .then((data) => {
      res.status(200).send({ comments: data });
    })
    .catch((err) => {
      next(err);
    });
};
exports.postComment = (req, res, next) => {
  const comment = req.body;
  const articleId = req.params.article_id;
  if (!comment.body || !comment.username) {
    return res.status(400).send({
      msg: "400: not found, make sure you have included the required fields",
    });
  }

  fetchArticleById(articleId)
    .then((data) => {
      if (data) return addComment(comment, articleId);
    })
    .then((data) => {
      res.status(201).send({ comment: data });
    })
    .catch((err) => {
      next(err);
    });
};
exports.postArticle = (req, res, next) => {
  const article = req.body;
  if (!article.body || !article.username) {
    return res.status(400).send({
      msg: "400: not found, make sure you have included the required fields",
    });
  }

  addArticle(article)
    .then((data) => {
      res.status(201).json({ article: data });
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
exports.deleteComment = (req, res, next) => {
  const { comment_id: id } = req.params;
  deleteCommentByID(id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
exports.deleteArticle = (req, res, next) => {
  const { article_id: id } = req.params;
  deleteArticleByID(id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
