const httpStatus = require('http-status');

class ApiError extends Error {

  constructor(message, status, isPublic = false) {
    super(message);
    this.status = status || httpStatus.INTERNAL_SERVER_ERROR;
    this.isPublic = isPublic;
  }

}

module.exports = ApiError;
