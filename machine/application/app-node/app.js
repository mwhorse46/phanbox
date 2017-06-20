const Promise = require('bluebird');

const http = require('http');
const mysql = require('mysql');
const redis = require("redis");
const mongo = require("mongodb");
const moment = require('moment');

const ENV = process.env['NODE_ENV'] || 'unknown';
const PORT = process.env['NODE_PORT'] || 3000;

const server = http.createServer((request, response) => {
  response.setHeader('Content-Type', 'text/html; charset=utf-8');

  const mySqlClient = Promise.promisifyAll(mysql.createConnection({
    host: '127.0.0.1',
    user: 'app',
    password: 'app',
    database: 'app',
  }));

  const redisClient = Promise.promisifyAll(redis.createClient({
    host: '127.0.0.1',
  }));

  const mongoClient = mongo.MongoClient;
  let mongoDb = null;

  // Check MySQL
  mySqlClient.queryAsync('SELECT 1')
    // Check Redis
    .then(() => redisClient.pingAsync())
    // Check Mongo
    .then(() => mongoClient.connect('mongodb://app:app@127.0.0.1:27017/app'))
    .then(db => (mongoDb = db).executeDbAdminCommand({ping: 1}))
    // Render Success page when all health checks passed
    .then(() => {
      const title = 'Phanbox Node.js App';
      const time = moment().format('MMMM Do YYYY, h:mm:ss a');

      response.writeHead(200);
      response.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
        </head>
        <body>
            <em>It works!</em>
            <h1>${title}</h1>
            <h2>${time}</h2>
            <h3>Environment: ${ENV}</h3>
            <h3>MySQL connection established</h3>
            <h3>Redis connection established</h3>
            <h3>Mongo connection established</h3>
        </body>
        </html>
      `);
    })
    .catch(err => {
      response.writeHead(500);
      response.write(`<pre>${err}</pre>`);
    })
    .finally(() => {
      response.end();
      mySqlClient.end();
      redisClient.end(true);
      mongoDb.close();
    });
});

server.listen(PORT, (err) => {
  if (err) {
    console.error('Something bad happened: %o', err)
  } else {
    console.info(`Server is listening on %d`, PORT)
  }
});
