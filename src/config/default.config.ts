export default {
    applicationPort: process.env.PORT ?? 3000,
    appSecret: process.env.SECRET ?? 'MF9DrpQws6iKSUN9TZGadrz7uYDxyZDE9GUo5ufY72YxhoG',
    dbName: process.env.DB_NAME ?? 'hacker_news_stories',
    dbUser: process.env.DB_USER ?? 'hacker_news_stories',
    dbHost: process.env.DB_HOST ?? 'localhost',
    dbDriver: process.env.DB_DRIVER ?? 'postgres',
    dbPassword: process.env.DB_PASSWORD ?? 'hacker_news_stories'
}