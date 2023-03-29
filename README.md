# Kangor News API

## Initial Setup

### Environment Variables Setup

 Create two .env files for this project: .env.test and .env.development. Into dev, add PGDATABASE=kangor_news, and for .env.test, add add PGDATABASE=kangor_news_test. Add these .env files to the .gitignored file.

 an articles array of article objects, each of which should have the following properties:

comment_count which is the total count of all the comments with this article_id - you should make use of queries to the database in order to achieve this.

the articles should be sorted by date in descending order.

<!-- Responds with:

    an array of comments for the given article_id of which each comment should have the following properties:
        comment_id
        votes
        created_at
        author
        body
        article_id
    comments should be served with the most recent comments first
 -->
