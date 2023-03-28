const app = require("../api/app");
const toBeSorted = require('jest-sorted');
const request = require("supertest");
const seed = require("../db/seeds/seed");
const {
  topicData,
  userData,
  articleData,
  commentData,
} = require("../db/data/test-data/index");
const db = require("../db/connection");

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

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
  it("should return a list of articles", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBeGreaterThan(0);
        body.forEach((article) => {
          expect(typeof article).toBe("object");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
        });
      });
  });
  it("should fetchAllArticles sorts articles by name in ascending order", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBeGreaterThan(0);
        expect(body).toBeSorted()
      });
  });
  it("should included the comment_count property along with the correct values", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBeGreaterThan(0);
        expect(body[0].comment_count).toBe("11");
        body.forEach((article) => {
          expect(article).toHaveProperty('comment_count')
        });
      });
  });
  
});
