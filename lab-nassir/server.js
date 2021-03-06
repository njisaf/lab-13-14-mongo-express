'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const debug = require('debug')('cat:server');

const errorMiddleware = require('./lib/error-middleware');
const pageMiddleware = require('./lib/page-middleware');
const cafeRouter = require('./route/cafe-router');
const catRouter = require('./route/cat-router');
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/catdev';

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

const app = express();
app.use(morgan('dev'));
app.use(cors());

app.use(cafeRouter);
app.use(catRouter);
app.use(pageMiddleware);
app.use(errorMiddleware);

const server = module.exports = app.listen(PORT, function(){
  debug('The server awaits your command on PORT ' + PORT + ' esteemed Master.\nI beg you to command me.');
});

server.isRunning = true;
