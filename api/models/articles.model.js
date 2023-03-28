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
      return data.rows[0];
    })
    
};
