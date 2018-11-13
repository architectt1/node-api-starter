const httpStatus = require('http-status');

/**
 * Error subclass that handles a response's status and a isPublic flag.
 */
class ApiError extends Error {

  constructor(message, status, isPublic = false) {
    super(message);
    this.status = status || httpStatus.INTERNAL_SERVER_ERROR;
    this.isPublic = isPublic;
  }

}

module.exports = ApiError;
