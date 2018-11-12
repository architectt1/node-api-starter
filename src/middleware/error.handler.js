const httpStatus = require('http-status');
const ApiError = require('../errors/api.error');

module.exports = (err, req, res, next) => {
  if (err.error && err.error.isJoi) {
    return res.status(err.status || httpStatus.BAD_REQUEST).json({
      errors: Object.assign({}, ...err.error.details.map(detail => ({ [detail.context.key]: detail.message })))
    });
  }
  let showStack = process.env.NODE_ENV !== 'production' && err.stack;
  if (err instanceof ApiError) {
    // don't show the stack for public errors, as they follow an expected outcome
    showStack = showStack && !err.isPublic;
  }
  res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json({
    error: err.message || err.name || httpStatus[500],
    ...showStack && { stack: err.stack }
  });
};
