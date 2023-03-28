const express = require("express");
const { getArticlesById, getArticles } = require("./controllers/articles.controller");
const { getTopics } = require("./controllers/topics.controller");
const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles", getArticles);


app.use("*", (req, res, next) => {
  res.status(404).send({ msg: "404: Article not found" });
});
app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ msg: err.msg });
  } else if (err.status === 400) {
    res.status(400).send({ msg: err.msg });
  } else {
    console.error(err);
    res.status(500).send({ msg: "500: Internal server error" });
  }
});

module.exports = app;
