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
    });
};

exports.fetchAllArticles = () => {
  return db
    .query(
      `
    SELECT articles.*, CAST(COALESCE(COUNT(comments.article_id),0) AS INT) AS comment_count FROM
    articles
    LEFT JOIN comments on articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
  `
    )
    .then((data) => data.rows);
};

exports.fetchArticlesComments = (article_id) => {
  const articleId = article_id;
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
      [articleId]
    )
    .then((data) => {
      return data.rows;
    });
};

exports.addComment = (comment, articleId) => {
  const { body, username } = comment;
  const query = `
      INSERT INTO comments (body, author, article_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `
    const values = [body, username, articleId];

    return db.query(query, values)
      .then(result => result.rows[0])
}
