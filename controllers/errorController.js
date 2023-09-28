const AppError = require('../utils/AppError');

const handleCastErrorDB = function ({ path, value }) {
  const message = `👎Invalid ${path}: ${value}`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = function (err) {
  const message = `🙅Duplicate field value: "${err.keyValue.name}" , Please use another value.`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = function (err) {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `⛔ Invalid input data. ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const handleJWTError = function () {
  return new AppError('💥 Invalid Token. 🔄 Please login again', 401);
};

const handleJWTExpiredError = function () {
  return new AppError('🙈 Your Token Has Expired! 🔄 Please login again', 401);
};

////////////////////////////////////////

const sendErrorDev = function (err, req, res) {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // B) Rendered Website
  return res
    .status(err.statusCode)
    .render('error', { title: '💥Something went wrong!', msg: err.message });
};

const sendErrorProd = function (err, req, res) {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // B)  Programming or other unknown error: don't leak error details
    // 1) Log Error
    console.error('💥 ERROR 💥', err);

    // 2) Send generic message
    return res.status(500).json({
      status: 'Error',
      message: `🔥Something went very wrong! 🔥`,
    });
  }

  //////////////////////////////////////////
  // B) Rendered Website
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    // Operational, trusted error: send message to client
    return res.status(err.statusCode).render('error', {
      title: '🔥Something went very wrong!🔥',
      msg: err.message,
    });
  }

  //  B) Programming or other unknown error: don't leak error details
  // 1) Log Error
  console.error('💥 ERROR 💥', err);

  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: '🔥Something went very wrong!🔥',
    msg: 'Please try again later.',
  });
};

// Implementing A Global Error Handling Middleware
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // 500 -> Internal Server Error
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') sendErrorDev(err, req, res);
  else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    const { name, code } = err;

    if (name === 'CastError') error = handleCastErrorDB(err);
    if (code === 11000) error = handleDuplicateFieldsDB(err);
    if (name === 'ValidationError') error = handleValidationErrorDB(err);
    if (name === 'JsonWebTokenError') error = handleJWTError();
    if (name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }

  next();
};
