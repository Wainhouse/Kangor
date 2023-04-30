const express = require("express");
const {
  getUsers,
  getUserbyId,
} = require("../api/controllers/users.controller");
const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.get("/:username", getUserbyId);

module.exports = userRouter;
