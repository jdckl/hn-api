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

Project is using [dotenv](https://www.npmjs.com/package/dotenv), you can overwrite any environment variables with your own, there is a base set of development variables included in the **config/default.config.ts**. Sample **.env.temp** is included.

## Authorization

API is using stateless JWT authorization via bearer tokens. For any authorized request paths you need to include a authorization header with your current Bearer token.  

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

## Routes

### Users

- #### **POST /users/register**  
    _Register a new user account_  
    Expects a ```{email: string, password: string}``` body payload, on success returns ```{success: boolean, message: string, token: string, expires: timestamp, userId: number}```  

- #### **POST /users/login**  
    _Login with credentials_  
    Expects a ```{email: string, password: string}``` body payload, on success returns ```{success: boolean, token: string, expires: timestamp, userId: number}```

### Collections

- #### **POST /collections/add**  
    _Add a new collection_  
    Expects a ```{name: string}``` body payload, on success returns ```{success: boolean, collectionId: number}```
- #### **DELETE /collections/remove/:collectionId**  
    _Remove an existing collection_  
    Expects a ```collectionId``` url parameter, on success returns ```{success: boolean, message: string}```
- #### **GET /collections/get-all**  
    _Get all collections for the authorized user_  
    On success returns ```{success: boolean, collections: array}```
- #### **GET /collections/get/:collectionId**  
    _Get a single collection based on its pg ID, verifies ownership_  
    Expects a ```collectionId``` url parameter, on success returns ```{success: boolean, collection: object, stories: array}```

### Stories

- #### **POST /stories/add**  
    _Add a new story to a collection, must be collection owner, supply the itemId from HN_  
    Expects a ```{collectionId: number, itemId: number (HN ID)}``` body payload, on success returns ```{success: boolean, message: string, storyId: number}```
- #### **DELETE /stories/remove/:collectionId/:storyId**  
    _Remove a story from a collection and its related comments, both IDs are postgres record ids_  
    Expects a ```collectionId, storyId``` url parameters, on success returns ```{success: boolean, message: string}```
- #### **GET /stories/get-all/:collectionId**  
    _Get all stories belonging to a owned collection_  
    On success returns ```{success: boolean, stories: array}```
- #### **GET /stories/get/:storyId**
    _Get a singular story with its respective comments, must own the story in their collection_  
    Expects a ```storyId``` url parameter, on success returns ```{success: boolean, story: object, comments: array}```
 
## Tests

Testing is setup with [Jest](https://jestjs.io/) and [Supertest](https://www.npmjs.com/package/supertest), and are located in **src/__tests__**, you can run them with:

```sh
npm test
```
Make sure your Postgres docker is running, or any other PG instance you are going to connnect to.

## Linter

ESlint configuration (.eslintrc.js) and the module are included. You can run the linter by running:
```sh
npm run lint
```

## App structure (src)

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

_Custom type declarations are included in ./types_
