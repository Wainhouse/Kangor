const express = require("express");

const {
  getArticlesById,
  getArticles,
  postComment,
  getArticlesComments,
  patchArticles,
  deleteComment
} = require("./controllers/articles.controller");
const { getTopics } = require("./controllers/topics.controller");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticlesComments);
app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/articles/:article_id", patchArticles);
app.delete("/api/comments/:comment_id", deleteComment);

app.use("*", (req, res, next) => {
  res.status(404).send({ msg: "404: Article not found" });
});
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "400: Invalid Datatype" });
  }
  if (err.code === "23503") {
    res.status(404).send({ msg: "404: User not found" });
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});
module.exports = app;
