const app = require('../api/app');
const request = require('supertest')
const seed = require('../db/seeds/seed')
const {topicData, userData, articleData, commentData} = require('../db/data/test-data/index')
const db = require('../db/connection')

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe("GET /api/topics", () => {
    test("200: returns array of topics objects with correct props", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Array);
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
          expect(body.msg).toBe("404: Not found");
        });
    });

  });