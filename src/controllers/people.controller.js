const validator = require('express-joi-validation')({ passError: true });
const httpStatus = require('http-status');
const Joi = require('joi');
const ApiError = require('../errors/api.error');
const { wrapAsync } = require('../helpers/controller.helper');
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

module.exports = {
  get: [
    validator.params(paramsSchema),
    wrapAsync(async (req, res, next) => {
      const person = await Person.findOne({ _id: req.params.id });
      if (!person) {
        throw new ApiError('Person not found', httpStatus.NOT_FOUND, true);
      }
      res.json(person.toJSON());
    })
  ],
  list: [
    wrapAsync(async (req, res, next) => {
      res.json((await Person.find()).map(person => person.toJSON()));
    })
  ],
  post: [
    validator.body(personPostSchema),
    wrapAsync(async (req, res, next) => {
      const person = await new Person(req.body).save();
      res.status(httpStatus.CREATED).json(person);
    })
  ],
  put: [
    validator.params(paramsSchema),
    validator.body(personPutSchema),
    wrapAsync(async (req, res, next) => {
      if (req.body.id && req.params.id !== req.body.id) {
        throw new ApiError(`Invalid param id ${req.params.id} and payload id ${req.body.id}. They should match.`, httpStatus.BAD_REQUEST, true);
      }
      delete req.body.id;
      const updatedPerson = await Person.findByIdAndUpdate(req.params.id, {
        $set: req.body
      }, { new: true });
      if (!updatedPerson) {
        throw new ApiError('Person not found', httpStatus.NOT_FOUND, true);
      }
      res.json(updatedPerson.toJSON());
    })
  ]
};
