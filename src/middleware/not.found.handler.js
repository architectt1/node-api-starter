const httpStatus = require('http-status');

module.exports = (req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    message: 'Not found'
  });
};
