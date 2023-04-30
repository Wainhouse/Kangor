const db = require("../../db/connection");

exports.fetchUsers = () => {
  return db
    .query(
      `
      SELECT * FROM users;
    `
    )
    .then((data) => data.rows);
};

exports.fetchUsersById = async (username) => {
  try {
    const query = {
      text: "SELECT * FROM users WHERE username = $1",
      values: [username],
    };
    const { rows } = await db.query(query);
    console.log(rows);
    if (rows.length === 0) {
      throw {
        status: 404,
        msg: `404: not found`,
      };
    }
    return rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
