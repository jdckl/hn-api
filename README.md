# HN-API

Simple Hacker News API wrap extending the functionality with collections, written in Typescript and using Node-Express and a PostgreSQL database.  

## Init

To initialize the project for development, perform the following:

```sh
git clone http://git.gut/hn-api
cd hn-api
docker-compose up
npm run migrate up
```

Results in 2 docker containers running for PostgreSQL and the API, and migrates your PGDB with the base structure migration.  

__Make sure you have an .env file in the root of your project with at least the DB_URL env variable defined, containing the entire Postgres URL with authentication string, if you want to run migrations!__

## Config

Project is using [dotenv](https://www.npmjs.com/package/dotenv), you can overwrite any environment variables with your own, there is a base set of development variables included in the **config/default.config.ts**.

## API Definitions

You can generate simple definitions by running:
```sh
npm run docs
```
and then visiting the ./docs/index.html

The API is following a nested structure with three base paths:
- /users
- /collections
- /stories

The usual responses include 200, 400, 401, 404 and 500.
Succesful syntax follow a JSON pattern of
```json
{ success: true, ...args }
```
Failure syntax follow a JSON pattern of
```json
{ error: true, message: 'Something went terribly wrong'}
```
 
## Tests

Testing is setup with [Jest](https://jestjs.io/) and [Supertest](https://www.npmjs.com/package/supertest), and are located in **src/__tests__**, you can run them with:

```sh
npm test
```

## App structure

```
- __tests__
- config / simple declared global config directory
- controllers / business logic and database operations, hn-api connector
- logs / generated and populated with logger
- middlewares / middleware or general server functions
- models / database logic and modeling
- routes / express routing
- app.ts / app definition and init
- index.ts / server definition and init
```