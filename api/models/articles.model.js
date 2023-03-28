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


exports.fetchAllArticles = () => {
  return db
  .query(
    `
    SELECT articles.*, COUNT(articles.article_id) AS comment_count FROM
    articles
    LEFT JOIN comments on articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.article_id ASC;
  `
  )
  .then((res) => res.rows);
 }

