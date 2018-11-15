const routes = require('express').Router();
const peopleController = require('./controllers/people.controller');

let prefix;

/**
 * People
 */
prefix = '/people';
routes.get(`${prefix}/:id`, peopleController.get);
routes.delete(`${prefix}/:id`, peopleController.delete);
routes.get(`${prefix}`, peopleController.list);
routes.post(`${prefix}`, peopleController.post);
routes.put(`${prefix}/:id`, peopleController.put);

module.exports = routes;
