const { fetchUsers } = require("../models/users.model");


exports.getUsers = (req, res, next) => {
    fetchUsers().then((data) => res.status(200).send(data));
  }