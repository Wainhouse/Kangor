# Kangor News API

**Api Built with Node, ExpressJS & PSQL**

**_[Take a look at the API](https://kangor.onrender.com/api/)_**

## Initial Setup

We are creating an API that will allow programmatic access to our application's data. The goal is to simulate the development of a backend service, like those used by real-world applications such as Reddit. This API will enable the front-end architecture to easily retrieve and interact with the application data.

## Stack

**Back-End:** Node, ExpressJS, PSQL

**Development:** Nodemon, Husky, Supertest, Jest, Jest-Sorted

## Installation

Install Kangor

### Requirements

$ node -v
v19.7.0
$ poststgres --version
v14.7 

##### Install **git**!!!

```bash
 $ git clone https://github.com/wainhouse/kangor
```
### Environment Variables Setup

 Create two .env files for this project: .env.test and .env.development. 

 1:

```
$ touch .env.development
```

2:

```
$ touch .env.test
```

 Add PGDATABASE=kangor_news into .env.development. For .env.test, add add PGDATABASE=kangor_news_test. Add these .env files to the .gitignored file.


#### Install dependencies

```
$ npm install
```

#### Seed database

```
$ npm run setup-dbs
$ npm run seed
```

### To Run Tests

```bash
  npm run test
```

# Endpoints

All the available Endpoints are avaiable at - **_[endpoints](https://kangor.onrender.com/api/)_**, and they are avaiable in main dir stored in the endpoints.json.
