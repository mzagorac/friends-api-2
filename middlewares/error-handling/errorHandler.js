const errorMessages = require('./errorConstants');
const environments = require('../../config/environments');

module.exports = (err, req, res, next) => {
  const error = {};

  switch (err.message) {
    case errorMessages.NOT_FOUND:
      error.message = 'Not Found';
      error.status = 404;
      error.errroCode = 4;
      break;

    default:
      error.status = 500;
      error.message = 'Oops, an error occurred';
      error.errorCode = 0;
  }

  if (environments.NODE_ENV === 'development') {
    error.stack = err.stack;
  }

  return res.status(error.status).send(error);
};
