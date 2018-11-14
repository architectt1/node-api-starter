const http = require('http');
const bodyParser = require('body-parser');
const config = require('config');
const express = require('express');
const methodOverride = require('method-override');
const morgan = require('morgan');
const db = require('./db');
const errorHandler = require('./middleware/error.handler');
const routes = require('./routes');

db()
  .then(() => {
    console.info(`Connected to database`);
    const app = express();
    app.set('port', config.port || 3000);
    app.use(methodOverride());
    app.use(morgan('combined'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(routes);
    app.use(errorHandler);
    return new Promise((resolve) => {
      http.createServer(app).listen(app.get('port'), () => {
        console.info(`Listening on port ${app.get('port')}`);
        resolve();
      });
    });
  })
  .catch((err) => {
    console.error(`Error while booting server: ${err.stack || err}`);
    process.exit(-1);
  });
