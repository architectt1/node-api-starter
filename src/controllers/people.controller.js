const validator = require('express-joi-validation')({ passError: true });
const Joi = require('joi');
const { buildActions } = require('../helpers/controller.helper');
const Person = require('../models/person');

const paramsSchema = Joi.object().keys({
  id: Joi.number().integer().positive().required()
});

const personKeys = {
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  birthDate: Joi.date().required()
};

const personPostSchema = Joi.object().keys(personKeys).required();
const personPutSchema = Joi.object().keys(Object.assign({}, personKeys, { id: Joi.number().integer().positive() })).required();

const { get, delete: deleteHandler, list, post, put } = buildActions(['get', 'delete', 'list', 'post', 'put'], Person);

module.exports = {
  get: [
    validator.params(paramsSchema),
    get
  ],
  delete: deleteHandler,
  list,
  post: [
    validator.body(personPostSchema),
    post
  ],
  put: [
    validator.params(paramsSchema),
    validator.body(personPutSchema),
    put
  ]
};
