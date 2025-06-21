
export default () => ({
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    dbname: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  },
  mongoDb: {
    host: process.env.MONGO_DB_HOST,
    username: process.env.MONGO_DB_USERNAME,
    password: process.env.MONGO_DB_PASSWORD,
    dbname: process.env.MONGO_DB_NAME,
  },
});
