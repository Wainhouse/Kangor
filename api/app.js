const express = require("express");
const { handleInvalidErrors } = require("./controllers/error.controller");
const { getTopics } = require("./controllers/topics.controller");
const app = express();


app.use(express.json());

app.get("/api/topics", getTopics);

app.use("*", handleInvalidErrors);

app.use((err, req, res, next) => {
    if (err.status) res.status(err.status).send(err);
  });


module.exports = app;




