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
          expect(body.msg).toBe("404: Not found");
        });
    });

  });

  describe.only("GET /api/articles ID", () => {
    test("200 - responds with correct article Object", () => {
      return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({body}) => {
        expect(body).toEqual({ article:{
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        }}
        )
        expect(body).toBeInstanceOf(Object)
      })
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
          expect(body.msg).toBe("400: Invalid article_id");
        });
    });
    
    
  })  