const express = require("express");
const articleRouter = express.Router();

const {
  getArticlesById,
  getArticles,
  getArticlesComments,
  patchArticles,
  postComment,
  postArticle,
  deleteArticle,
} = require("../api/controllers/articles.controller");

articleRouter.get("/", getArticles);
articleRouter.get("/:article_id/comments", getArticlesComments);
articleRouter.get("/:article_id", getArticlesById);
articleRouter.patch("/:article_id", patchArticles);
articleRouter.post("/:article_id/comments", postComment);
articleRouter.post("/", postArticle);
articleRouter.delete("/:article_id", deleteArticle);

module.exports = articleRouter;
