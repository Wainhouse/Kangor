const db = require("../../db/connection");
const { topicChecker } = require("../utils/utils");

exports.fetchArticleById = (id) => {
  return db
    .query(
      `SELECT articles.*, CAST(COALESCE(COUNT(comments.article_id),0) AS INT) AS comment_count FROM
    articles
    LEFT JOIN comments on articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
  `,
      [id]
    )
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

exports.fetchAllArticles = async ({
  sort_by = "created_at",
  order = "desc",
  topic,
} = {}) => {
  if (topic) {
    if (!(await topicChecker(topic))) {
      throw {
        status: 400,
        msg: `Invalid topic value: ${topic}`,
      };
    }
  }

  const validSortColumns = [
    "article_id",
    "title",
    "author",
    "created_at",
    "votes",
    "topic",
    "comment_count",
  ];

  if (!validSortColumns.includes(sort_by)) {
    sort_by = "created_at";
  }

  if (order !== "asc" && order !== "desc") {
    order = "desc";
  }

  const query = `
    SELECT articles.*, COALESCE(COUNT(comments.article_id), 0) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    ${topic ? "WHERE articles.topic = $1" : ""}
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order};
  `;

  const values = topic ? [topic] : [];

  try {
    const result = await db.query(query, values);
    return result.rows;
  } catch (error) {
    throw {
      status: 500,
      msg: error.message,
    };
  }
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
exports.updateArticle = (article, voteNum) => {
  const articleNewVotes = (article.votes += voteNum);
  const articleId = article.article_id;
  const query = `
  UPDATE articles
  SET votes = $2
  WHERE article_id = $1
  RETURNING *
;`;
  const values = [articleId, articleNewVotes];
  return db.query(query, values).then((data) => {
    return data.rows[0];
  });
};

exports.addComment = (comment, articleId) => {
  const { body, username } = comment;
  const query = `
      INSERT INTO comments (body, author, article_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
  const values = [body, username, articleId];

  return db.query(query, values).then((data) => data.rows[0]);
};
exports.deleteCommentByID = (commentId) => {
  if (!commentId || isNaN(Number(commentId))) {
    throw { status: 400, msg: "400: Bad Request - Invalid Comment ID" };
  }
  const query = `
      DELETE FROM comments WHERE comment_id = $1 RETURNING *;
    `;
  const values = [commentId];
  return db.query(query, values).then((data) => {
    if (data.rows.length === 0) {
      throw { status: 404, msg: "404: Not Found - Comment does not exist" };
    }
    return data.rows[0];
  });
};
