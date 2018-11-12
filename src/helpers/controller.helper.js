const httpStatus = require('http-status');

const controllerHelper = module.exports;

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
