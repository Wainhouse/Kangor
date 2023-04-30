const { fetchUsers, fetchUsersById } = require("../models/users.model");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => res.status(200).send({ users }))
    .catch((err) => {
      next(err);
    });
};
exports.getUserbyId = (req, res, next) => {
  const username = req.params.username;
  fetchUsersById(username)
    .then((users) => res.status(200).send({ users }))
    .catch((err) => {
      next(err);
    });
};
