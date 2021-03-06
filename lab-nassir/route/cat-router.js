'use strict';

const Router = require('express').Router;
const debug = require('debug')('cat:cat-router');
const createError = require('http-errors');
const jsonParser = require('body-parser').json();

const Cafe = require('../model/cafe');
const Cat = require('../model/cat');

const catRouter = module.exports = new Router();

catRouter.post('/api/cafe/:cafeId/cat', jsonParser, function(req, res, next){
  debug('Hit POST router');
  Cafe.findByIdAndAddCat(req.params.cafeId, req.body)
  .then(cat => res.json(cat))
  .catch(next);
});

catRouter.get('/api/cafe/:cafeId/cat/:catId', function(req, res, next){
  debug('Hit GET router');
  Cafe.findById(req.params.cafeId)
  .then(cafe => {
    if (cafe.cats.indexOf(req.params.catId) === -1) {
      Promise.reject();
    }
    return Cat.findById(req.params.catId);
  })
  .then(cat => {
    console.log('cat', cat);
    res.json(cat);
  })
  .catch(err => next(createError(404, err.message)));
});

catRouter.get('/api/cafe/:cafeId/cat/', function(req, res, next){
  debug('Hit GET router WITH NO CAT ID');
  Cafe.findById(req.params.cafeId)
  .then(cafe => {
    console.log('DHBHDBGHDBGHD', cafe.cats);
    res.json(cafe.cats);
  })
  .catch(err => next(createError(404, err.message)));
});


catRouter.delete('/api/cafe/:cafeId/cat/:catId', function(req, res, next){
  debug('Hit DELETE route');
  Cafe.findByIdAndRemoveCat(req.params.cafeId, req.params.catId)
  .then(() => res.sendStatus(204))
  .catch(err => next(createError(404, err.message)));
});

catRouter.put('/api/cafe/:cafeId/cat/:catId', jsonParser, function(req, res, next) {
  debug('Hit PUT route');
  Cafe.findById(req.params.cafeId)
  .then(cafe => {
    if (cafe.cats.indexOf(req.params.catId) === -1) {
      debug('Cafe and cat IDs do not match!');
      Promise.reject();
    }
    return Cat.findByIdAndUpdate(req.params.catId, req.body, {new: true});
  })
  .then(cat => {
    console.log('cat', cat);
    res.json(cat);
  })
  .catch(err => next(createError(404, err.message)));
});
