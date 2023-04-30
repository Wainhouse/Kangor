const express = require("express");
const apiRouter = express.Router();
const endpoints = require("../endpoints.json");

apiRouter.get("/", (req, res, next) => {
  try {
    res.status(200).json(endpoints);
  } catch (err) {
    next(err);
  }
});

module.exports = apiRouter;
