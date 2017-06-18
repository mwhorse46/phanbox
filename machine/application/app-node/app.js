const http = require('http');
const moment = require('moment');

const ENV =  process.env['NODE_ENV'] || 'development';
const PORT = process.env['NODE_PORT'] || 3000;

const server = http.createServer((request, response) => {
  const title = 'Phanbox Node.js App';
  const time = moment().format('MMMM Do YYYY, h:mm:ss a');

  response.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
  });
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
    </body>
    </html>
  `);
  response.end();
});

server.listen(PORT, (error) => {
  if (error) {
    console.log('Something bad happened: %o', error)
  } else {
    console.log(`Server is listening on %d`, PORT)
  }
});
