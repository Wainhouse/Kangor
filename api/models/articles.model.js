const db = require("../../db/connection");

exports.fetchArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
    .then((data) => {
      if (!data.rows.length) {
        return Promise.reject({
          status: 404,
          msg: `404: Article not found`,
        });
      }
      return data.rows;
    })
    .catch((err) => {
      if (err.code === "22P02") {
        return Promise.reject({
          status: 400,
          msg: "400: Invalid article_id",
        });
      }
      return Promise.reject(err);
    });
};
