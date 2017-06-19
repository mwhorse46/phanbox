const Promise = require('bluebird');

const http = require('http');
const mysql = require('mysql');
const redis = require("redis");
const moment = require('moment');

const ENV = process.env['NODE_ENV'] || 'development';
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

  mySqlConnection
    // Check MySQL
    .then(() => mySqlClient.queryAsync('SELECT 1'))
    // Check MySQL
    .then(() => redisClient.pingAsync())
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
      redisClient.end();
    });
});

server.listen(PORT, (err) => {
  if (err) {
    console.error('Something bad happened: %o', err)
  } else {
    console.info(`Server is listening on %d`, PORT)
  }
});
