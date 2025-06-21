export default () => ({
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    dbname: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  },
});
