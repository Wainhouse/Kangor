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
exports.fetchArticlesComments = (articleId, limit, page) => {
  const article_Id = articleId;
  try {
    const offset = (page - 1) * limit;
    return db
      .query(
        `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC
        LIMIT $2 OFFSET $3;`,
        [article_Id, limit, offset]
      )
      .then((data) => {
        return data.rows;
      });
  } catch (err) {
    return err;
  }
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
exports.addArticle = async (article) => {
  try {
    const { title, topic, username, body, article_img_url } = article;
    let topicId;
    const topicQuery = `
      SELECT slug FROM topics WHERE slug = $1;
      `;
    const topicValues = [topic];
    const topicResult = await db.query(topicQuery, topicValues);

    if (topicResult.rows.length > 0) {
      topicId = topicResult.rows[0].id;
    } else {
      const insertTopicQuery = `
      INSERT INTO topics (slug) VALUES ($1) RETURNING slug;
      `;
      const insertTopicValues = [topic];
      const insertTopicResult = await db.query(
        insertTopicQuery,
        insertTopicValues
      );
      topicId = insertTopicResult.rows[0].slug;
    }
    const authorQuery = `
    SELECT * FROM users WHERE username = $1
    ;
    `;
    const authorValues = [username];
    const authorResult = await db.query(authorQuery, authorValues);

    const articleQuery = `
      INSERT INTO articles (title, topic, author, body, article_img_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const articleValues = [title, topicId, username, body, article_img_url];
    const articleResult = await db.query(articleQuery, articleValues);
    return articleResult.rows[0];
  } catch (error) {
    throw error;
  }
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
exports.deleteArticleByID = (articleId) => {
  if (!articleId || isNaN(Number(articleId))) {
    throw { status: 400, msg: "400: Bad Request - Invalid Article ID" };
  }
  const query = `
      DELETE FROM articles WHERE article_id = $1 RETURNING *;
    `;
  const values = [articleId];
  return db.query(query, values).then((data) => {
    if (data.rows.length === 0) {
      throw { status: 404, msg: "404: Not Found - Article does not exist" };
    }
    return data.rows[0];
  });
};
