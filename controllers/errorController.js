const AppError = require('../utils/appError');

function renderErrorPage(res, statusCode, message) {
  res.status(statusCode).render('error', {
    title: 'Something went wrong!',
    msg: message,
  });
}

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else {
    renderErrorPage(res, err.statusCode, err.message);
  }
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // log the error
    console.error('ERROR 💥', err);
    // send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
  // Render Error page
  console.error('ERROR 💥', err);
  if (err.isOperational) {
    return renderErrorPage(res, err.statusCode, err.message);
  }
  // log the error
  // send generic message
  return renderErrorPage(res, 500, 'Please try again later.');
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsErrorDB = (err) => {
  const message = `can't have duplicate tour with the same name: ${err.keyValue.name}, please use another name!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const { message } = err;
  return new AppError(message, 400);
};

const handleJsonWebTokenErrorDB = () => {
  const message = 'Invalid token, please log in again!';
  return new AppError(message, 401);
};

const handleTokenExpiredErrorDB = () => {
  const message = 'Your token has expired! Please log in again.';
  return new AppError(message, 401);
};

// the big idea -> get all errors here and handle specific cases if you want
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    else if (error.code === 11000) error = handleDuplicateFieldsErrorDB(error);
    else if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    else if (error.name === 'JsonWebTokenError')
      error = handleJsonWebTokenErrorDB(error);
    else if (error.name === 'TokenExpiredError')
      error = handleTokenExpiredErrorDB(error);

    sendErrorProd(error, req, res);
  }
};
