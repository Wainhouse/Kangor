const app = require("../api/app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
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
  if (db.end) db.end()
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
        expect(body.msg).toBe("404: Article not found");
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
        expect(body.msg).toBe("404: Article not found");
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
        expect(body.msg).toBe("404: Article not found");
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

describe("when given a valid article ID returns with comments for correct artice", () => {
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
          expect(comment).toHaveProperty("comment_id");
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
    const newVote = { inc_votes : 1 }
    return request(app)
      .patch('/api/articles/6')
      .send(newVote)
      .expect(200)
      .then(({body}) => {
        expect(typeof body.article).toBe("object");
        expect(body.article).toHaveProperty("article_id");
        expect(body.article).toHaveProperty("created_at");
        expect(body.article).toHaveProperty("title");
        expect(body.article).toHaveProperty("votes");
        expect(body.article).toHaveProperty("created_at");
        expect(body.article.votes).toBe(1);
      })
  });
  it("responds with status 400 bad request datatype", () => {
    const newVote = { inc_votes : 'five' }
    return request(app)
      .patch('/api/articles/6')
      .send(newVote)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("400: Invalid Datatype");
      })
  });
  test("404: responds with a bad request message", () => {
    return request(app)
      .patch("/api/article/1234567890")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Article not found");
      });
  });
});
