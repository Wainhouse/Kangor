const express = require("express");
const { handleInvalidPaths } = require("./controllers/error.controller");
const { getTopics } = require("./controllers/topics.controller");
const app = express();

app.get("/api/topics", getTopics);

app.use("*", handleInvalidPaths);

app.use((err, req, res, next) => {
    if (err.status) res.status(err.status).send(err);
  });


module.exports = app;

