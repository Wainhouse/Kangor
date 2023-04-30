const express = require("express");
const cors = require("cors");
const articleRouter = require("../routes/article-router");
const topicsRouter = require("../routes/topics-router");
const commentsRouter = require("../routes/comments-router");
const userRouter = require("../routes/users-router");
const apiRouter = require("../routes/api-router");
const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);
app.use("/api/articles", articleRouter);
app.use("/api/topics", topicsRouter);
app.use("/api/comments/:comment_id", commentsRouter);
app.use("/api/users", userRouter);

app.use("*", (req, res, next) => {
  res.status(404).send({ msg: "404: not found" });
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
