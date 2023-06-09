const app = require("../api/app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const endpoints = require("../endpoints.json");
const {
  topicData,
  userData,
  articleData,
  commentData,
} = require("../db/data/test-data/index");
const db = require("../db/connection");

require("jest-sorted");

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => {
  if (db.end) db.end();
});
describe("GET /api/topics", () => {
  test("200: returns array of topics objects with correct props", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBeGreaterThan(0);
        body.forEach((topic) => {
          expect(typeof topic).toBe("object");
          expect(topic).toHaveProperty("description");
          expect(topic).toHaveProperty("slug");
        });
      });
  });
  test("400: responds with a bad request message", () => {
    return request(app)
      .get("/api/topppes")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: not found");
      });
  });
});
describe("GET /api/articles", () => {
  test("200: returns array of topics objects with correct props", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body).toBeSortedBy("created_at", { descending: true });
        expect(body.length).toBeGreaterThan(0);
        body.forEach((article) => {
          expect(typeof article).toBe("object");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("body");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
  test("404: responds with a bad request message", () => {
    return request(app)
      .get("/api/topppes")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: not found");
      });
  });
});
describe("GET /api/articles ID", () => {
  test("200 - responds with correct article Object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          article: {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            comment_count: 11,
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
        });
        expect(body).toBeInstanceOf(Object);
      });
  });
  test("404: responds with a bad request message", () => {
    return request(app)
      .get("/api/article/1234567890")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: not found");
      });
  });
  test("400: responds with an Internal server error", () => {
    return request(app)
      .get("/api/articles/dfgdfgd")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Invalid Datatype");
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  it("returns an array of comments objects with correct properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments).toBeSorted({ descending: true });
        expect(body.comments.length).toBeGreaterThan(0);
        body.comments.forEach((comment) => {
          expect(typeof comment).toBe("object");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("created_at");
        });
      });
  });
  it("404: responds with a bad request, no article exists", () => {
    return request(app)
      .get("/api/articles/205345345/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Article not found");
      });
  });
  it("400: Invalid article_id", () => {
    return request(app)
      .get("/api/articles/sdfsdfsdf/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Invalid Datatype");
      });
  });
  it("returns an empty array of comments when article has no comments", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Object);
        expect(body.comments.length).toBe(0);
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  it("responds with status 200 and updated article object", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/6")
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.article).toBe("object");
        expect(body.article).toHaveProperty("article_id");
        expect(body.article).toHaveProperty("created_at");
        expect(body.article).toHaveProperty("title");
        expect(body.article).toHaveProperty("votes");
        expect(body.article).toHaveProperty("created_at");
        expect(body.article.votes).toBe(1);
      });
  });
  it("responds with status 400 bad request datatype", () => {
    const newVote = { inc_votes: "five" };
    return request(app)
      .patch("/api/articles/6")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Invalid Datatype");
      });
  });
  test("404: responds with a bad request message", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/article/1234567890")
      .send(newVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: not found");
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  it("201 - responds with a newly created comment ", () => {
    const newComment = {
      body: "Yo wadup man!",
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment.body).toBe("Yo wadup man!");
        expect(body.comment.author).toBe("butter_bridge");
        expect(body.comment.votes).toBe(0);
        expect(typeof body.comment).toBe("object");
        expect(body.comment).toHaveProperty("comment_id");
        expect(body.comment).toHaveProperty("votes");
        expect(body.comment).toHaveProperty("created_at");
        expect(body.comment.comment_id).toBeGreaterThan(0);
      });
  });
  it("201 - POST should  also ignore unnecessary properties", () => {
    const inputComment = {
      body: "Yo wadup man!",
      username: "butter_bridge",
      test: "test",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(inputComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment.votes).toBe(0);
        expect(body.comment.body).toBe("Yo wadup man!");
        expect(body.comment.author).toBe("butter_bridge");
        expect(body.comment.article_id).toBe(3);
        // expect(body.comment.comment_id).toBe(19)
      });
  });
  it("404 - POST request  that doesnt exist", () => {
    const inputComment = {
      body: "Yo wadup man!",
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/34534/comments")
      .send(inputComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Article not found");
      });
  });
  it("404 - POST request for an article for a username that doesnt exist", () => {
    const inputComment = {
      body: "Yo wadup man!",
      username: "wayne",
    };
    return request(app)
      .post("/api/articles/7/comments")
      .send(inputComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`404: User not found`);
      });
  });
  it("400 - POST missing required fields of username or body", () => {
    const inputComment = {
      username: "butter_bridge",
    };

    return request(app)
      .post("/api/articles/7/comments")
      .send(inputComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "400: not found, make sure you have included the required fields"
        );
      });
  });
  test("200: returns an array of comments objects with correct properties", () => {
    const articleId = 1;
    const limit = 10;
    const page = 2;
    return request(app)
      .get(`/api/articles/${articleId}/comments?limit=${limit}&p=${page}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        body.comments.forEach((comment) => {
          expect(typeof comment).toBe("object");
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("article_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("body");
        });
      });
  });
  test("404: responds with an error message when article is not found", () => {
    const articleId = 1000;
    const limit = 10;
    const page = 1;
    return request(app)
      .get(`/api/articles/${articleId}/comments?limit=${limit}&p=${page}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Article not found");
      });
  });
});
describe("POST /api/articles/:article_id", () => {
  it("201 - responds with a newly created article ", () => {
    const newArticle = {
      title: "What the hell is up man",
      topic: "football",
      username: "butter_bridge",
      body: "It's all over hellllll.",
      article_img_url:
        "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?w=700&h=700",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.article.title).toBe("What the hell is up man");
        expect(body.article.author).toBe("butter_bridge");
        expect(body.article.votes).toBe(0);
        expect(body.article.article_img_url).toBe(
          "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?w=700&h=700"
        );
        expect(typeof body.article).toBe("object");
        expect(body.article.article_id).toBeGreaterThan(0);
      });
  });
  it("201 - POST should  also ignore unnecessary properties", () => {
    const newArticle = {
      title: "What the hell is up man",
      topic: "football",
      username: "butter_bridge",
      body: "It's all over hellllll.",
      votes: 0,
      test: "test",
      article_img_url:
        "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?w=700&h=700",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.article.votes).toBe(0);
        expect(body.article.body).toBe("It's all over hellllll.");
        expect(body.article.author).toBe("butter_bridge");
      });
  });
  it("404 - POST request where url doesnt exist", () => {
    const newArticle = {
      title: "What the hell is up man",
      topic: "coding",
      username: "tickle122",
      body: "It's all over hellllll.",
      votes: 0,
      test: "test",
      article_img_url:
        "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?w=700&h=700",
    };
    return request(app)
      .post("/api/articl")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: not found");
      });
  });
  it("404 - POST request for an article for a username that doesnt exist", () => {
    const newArticle = {
      title: "What the hell is up man",
      topic: "coding",
      username: "wayne",
      body: "It's all over hellllll.",
      votes: 0,
      article_img_url:
        "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?w=700&h=700",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: User not found");
      });
  });
  it("400 - POST missing required fields of username or body", () => {
    const newArticle = {
      title: "What the hell is up man",
      topic: "coding",
      votes: 0,
      article_img_url:
        "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?w=700&h=700",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "400: not found, make sure you have included the required fields"
        );
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  it('Status 204 "No Content" - Delete Comment', () => {
    return request(app).delete("/api/comments/5").expect(204);
  });
  it('Status 404 "Not Found" - Comment id does not exists', () => {
    return request(app).delete("/api/comments/1123423").expect(404);
  });
  it('Status 400 "Bad Request" - Incorrect comment id', () => {
    return request(app).delete("/api/comments/ada3q3e").expect(400);
  });
});
describe("DELETE /api/article/:article_id", () => {
  it('Status 204 "No Content" - Delete article', () => {
    return request(app).delete("/api/articles/2").expect(204);
  });
  it('Status 404 "Not Found" - article id does not exists', () => {
    return request(app).delete("/api/articles/1123423").expect(404);
  });
  it('Status 400 "Bad Request" - Incorrect article id', () => {
    return request(app).delete("/api/articles/ada3q3e").expect(400);
  });
});
describe("GET /api/users", () => {
  test("200: returns array of users objects with correct props", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toBeInstanceOf(Object);
        expect(body.users.length).toBeGreaterThan(0);
        body.users.forEach((article) => {
          expect(article).toHaveProperty("username", expect.any(String));
          expect(article).toHaveProperty("name", expect.any(String));
          expect(article).toHaveProperty("avatar_url"), expect.any(String);
        });
      });
  });
  test("404: responds with a bad request message", () => {
    return request(app)
      .get("/api/userz")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: not found");
      });
  });
});
describe("GET /api/articles queries", () => {
  test("200: returns array of articles objects with correct topic, and abides by defaults", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body).toBeSortedBy("created_at", { descending: true });
        expect(body.length).toBeGreaterThan(0);
        const article = body[0];
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
      });
  });
  test("200: returns array of articles objects with correct topic, and abides by defaults", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body).toBeSortedBy("created_at", { descending: true });
        expect(body.length).toBeGreaterThan(0);
        const article = body[0];
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
      });
  });
  test("200: returns array of articles objects with correct props sorted desc article_id", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=article_id&order=desc")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body).toBeSortedBy("article_id", { descending: true });
        expect(body.length).toBeGreaterThan(0);
        const article = body[0];
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
      });
  });
  test("200: returns array of articles objects with correct props sorted asc votes", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body).toBeSortedBy("votes", { descending: false });
        expect(body.length).toBeGreaterThan(0);

        const article = body[0];
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
      });
  });
  test("400: responds with a bad request message when an invalid topic value is provided", () => {
    return request(app)
      .get("/api/articles?topic=invalid&sort_by=article_id&order=asc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid topic value: invalid");
      });
  });
  test("404: responds with a bad request message when an invalid article ID is provided", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Article not found");
      });
  });
  test("404: responds with a bad request message", () => {
    return request(app)
      .get("/api/arti?topic=mitch&sort_by=votes&order=asc")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: not found");
      });
  });
});
describe("getAPI()", () => {
  it("200 - should return a full obj of possible endpoints for api endpoint ", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpoints);
        expect(body).toBeDefined();
      });
  });
  test("404: responds with a bad request message", () => {
    return request(app)
      .get("/apu")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: not found");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("responds with correct user object and status 200", async () => {
    return await request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        expect(body.users[0]).toEqual({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });

  test("responds with a 404 status and error message when username does not exist", () => {
    return request(app)
      .get("/api/users/wayne")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: not found");
      });
  });
});
