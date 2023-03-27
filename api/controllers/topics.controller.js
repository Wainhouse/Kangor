const { fetchAllTopics } = require("../models/topics.model");

exports.getTopics = (req, res) => {
    fetchAllTopics().then((data) => res.status(200).send(data))
}