const routes = require('express').Router();
const peopleController = require('./controllers/people.controller');

/**
 * People
 */
routes.get('/people/:id', peopleController.get);
routes.get('/people', peopleController.list);
routes.post('/people', peopleController.post);

module.exports = routes;
