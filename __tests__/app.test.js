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
  test("400: responds with a bad request message", () => {
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
        expect(body.msg).toBe("400: Invalid article_id");
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
        expect(body.msg).toBe("400: Invalid article_id");
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
      });
  });
  it('404 - POST request  that doesnt exist', () => {
    const inputComment = {
      body: "Yo wadup man!",
      username: "butter_bridge"
    }
    return request(app)
        .post("/api/articles/34534/comments")
        .send(inputComment)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("404: Article not found")
        })
})
it('404 - POST request for an article for a username that doesnt exist', () => {
  const inputComment = {
    body: "Yo wadup man!",
    username: "wayne"
  }
  return request(app)
      .post("/api/articles/7/comments")
      .send(inputComment)
      .expect(404)
      .then(({ body }) => {
          expect(body.msg).toBe(`404: User not found`)
      })
})
it('400 - POST missing required fields of username or body', () => {
  const inputComment = {
    username: "butter_bridge",
  };

  return request(app)
    .post("/api/articles/7/comments")
    .send(inputComment)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("400: not found, make sure you have included a username and a comment");
    });
});
it.only('400 - POST missing required fields of username or body', () => {
  const inputComment = {
    username: "banana",
    body: "hellos everyone"
  };

  return request(app)
    .post("/api/articles/7/comments")
    .send(inputComment)
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("404: User not found");
    });
});

});
