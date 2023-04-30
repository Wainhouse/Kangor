const express = require("express");
const { deleteComment } = require("../api/controllers/articles.controller");
const commentsRouter = express.Router();

commentsRouter.delete("/:comment_id", deleteComment);

module.exports = deleteComment;
