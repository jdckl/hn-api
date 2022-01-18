# HN-API

Simple Hacker News API wrap extending the functionality with collections, written in Typescript and using Node-Express and a PostgreSQL database.  

## Init

To initialize the project for development, perform the following:

```sh
git clone http://git.gut/hn-api
cd hn-api
docker-compose up
npm install
npm run migrate up
npm run start:dev
```

__Make sure you have an .env file in the root of your project with at least the DB_URL env variable defined, containing the entire Postgres URL with authentication string.__

## Tests

Testing is setup with [Jest](https://jestjs.io/) and [Supertest](https://www.npmjs.com/package/supertest), and are located in **src/__tests__**, you can run them with:

```sh
npm test
```

## App structure

```
- __tests__
- config / simple declared global config directory
- controllers / business logic and database operations
- hn-api / HackerNews API connector
- logs / generated and populated with logger
- middlewares / middleware or general server functions
- models / database logic and modeling
- routes / express routing
- app.ts / app definition and init
- index.ts / server definition and init
```