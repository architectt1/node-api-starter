const validator = require('express-joi-validation')({ passError: true });
const httpStatus = require('http-status');
const Joi = require('joi');
const ApiError = require('../errors/api.error');
const { wrapAsync } = require('../helpers/controller.helper');
const Person = require('../models/person');

const paramsSchema = Joi.object().keys({
  id: Joi.objectId().required()
});

const personSchema = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  birthDate: Joi.date().required()
}).required();

module.exports = {
  get: [
    validator.params(paramsSchema),
    wrapAsync(async (req, res, next) => {
      const person = await Person.findOne({ _id: req.params.id });
      if (!person) {
        throw new ApiError('Person not found', httpStatus.NOT_FOUND, true);
      }
      res.json(person.toObject());
    })
  ],
  list: [
    wrapAsync(async (req, res, next) => {
      res.json((await Person.find()).map(person => person.toObject()));
    })
  ],
  post: [
    validator.body(personSchema),
    wrapAsync(async (req, res, next) => {
      const person = await new Person(req.body).save();
      res.status(httpStatus.CREATED).json(person);
    })
  ]
};
