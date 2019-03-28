const debug = require('debug')('server:log');
const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
const server = express();

// Middleware
server.use(express.json());
server.use(compression());
server.use(helmet());
server.use((req, res, next) => {
  res.on('finish', () => {
    debug(`${req.method} ${req.originalUrl} - ${res.statusCode} [${res.statusMessage}]`);
  });
  next();
});

// Routes
server.use('/api/cohorts', require('../routes/cohorts'));
server.use('/api/students', require('../routes/students'));

module.exports = server;
