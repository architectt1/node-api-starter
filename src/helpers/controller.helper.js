const httpStatus = require('http-status');
const ApiError = require('../errors/api.error');

const controllerHelper = module.exports;

/**
 * Wraps a handler to catch any thrown errors in a standard way.
 * @param fn
 * @returns {Function}
 */
controllerHelper.wrapAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await Promise.resolve(fn(req, res, next));
    } catch (err) {
      console.error(err.stack || err);
      err.status = err.status || httpStatus.INTERNAL_SERVER_ERROR;
      next(err);
    }
  }
};

const abstractActions = {
  get: (model) => controllerHelper.wrapAsync(async (req, res, next) => {
    const entity = await model.findOne({ _id: req.params.id });
    if (!entity) {
      throw new ApiError(`${model.modelName} not found`, httpStatus.NOT_FOUND, true);
    }
    res.json(entity.toJSON());
  }),
  delete: (model) => controllerHelper.wrapAsync(async (req, res, next) => {
    const result = await model.deleteOne({ _id: req.params.id });
    if (!result || result.n !== 1) {
      throw new ApiError(`${model.modelName} not found`, httpStatus.NOT_FOUND, true);
    }
    res.end();
  }),
  list: (model) => controllerHelper.wrapAsync(async (req, res, next) => {
    res.json((await model.find()).map(entity => entity.toJSON()));
  }),
  post: (model) => controllerHelper.wrapAsync(async (req, res, next) => {
    const entity = await new model(req.body).save();
    res.status(httpStatus.CREATED).json(entity);
  }),
  put: (model) => controllerHelper.wrapAsync(async (req, res, next) => {
    if (req.body.id && req.params.id !== req.body.id) {
      throw new ApiError(`Invalid param id ${req.params.id} and payload id ${req.body.id}. They should match.`, httpStatus.BAD_REQUEST, true);
    }
    delete req.body.id;
    const updatedEntity = await model.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, { new: true });
    if (!updatedEntity) {
      throw new ApiError(`${model.modelName} not found`, httpStatus.NOT_FOUND, true);
    }
    res.json(updatedEntity.toJSON());
  })
};

/**
 * Builds the requested controller actions, using the given model. Doesn't include any validations.
 * @param requestedActions
 * @param model
 * @returns {{}}
 */
controllerHelper.buildActions = (requestedActions, model) => Object.assign(
  {},
  ...Object.keys(abstractActions)
    .filter(action => requestedActions.indexOf(action) !== -1)
    .map(requestedAction => ({ [requestedAction]: abstractActions[requestedAction](model) }))
);
