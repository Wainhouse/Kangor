const db = require("../../db/connection");

exports.topicChecker = async (topic) => {
  const articleTopic = topic;
  const topicsPropQuery = `SELECT * FROM topics
  WHERE slug = $1;`;
  const topicsPropValues = [articleTopic];
  return await db.query(topicsPropQuery, topicsPropValues).then((data) => {
    if (data.rows.length > 0) {
      const slugValue = data.rows[0].slug;
      if (slugValue === topic) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  });
};

exports.voteCounter = (voteObj) => {
  const voteObjCopy = { ...voteObj };
  return +voteObjCopy.inc_votes;
};
