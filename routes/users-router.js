const express = require("express");
const { getUsers } = require("../api/controllers/users.controller");
const userRouter = express.Router();

userRouter.get("/", getUsers);

module.exports = getUsers;
