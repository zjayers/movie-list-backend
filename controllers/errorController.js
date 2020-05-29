const AppError = require('./../utils/appError');

/**
 * Send Error Information When In Development
 *
 * @param {*} err
 * @param {*} res
 */
const sendErrorDev = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // RENDERED WEBSITE
  console.error('ERROR', err);
  return res
    .status(err.statusCode)
    .render('error', { title: 'Something went wrong', msg: err.message });
};

/**
 * Send Error Information When In Production
 *
 * @param {*} err
 * @param {*} res
 */
const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    //Operational, trusted error: Send Message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      // Programming or other unknown error: don't leak details to client - send generic message instead
    }

    //Log error to the console
    console.error('ERROR', err);
    return res
      .status(500)
      .json({ status: 'error', message: 'Something went wrong' });
  }

  // RENDERED WEBSITE
  if (err.isOperational) {
    return res
      .status(err.statusCode)
      .render('error', { title: 'Something went wrong', msg: err.message });
    // Programming or other unknown error: don't leak details to client - send generic message instead
  }

  //Log error to the console
  console.error('ERROR', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later.',
  });
};

/**
 ** HANDLE ID CAST ERRORS
 *
 * @param {*} err
 * @returns AppError
 */
const handleCastErrorDB = (err) => {
  const msg = `Invalid ${err.path}: ${err.value}`;
  return new AppError(msg, 400);
};

/**
 ** HANDLE DUPLICATE FIELD ERRORS
 *
 * @param {*} err
 * @returns AppError
 */
const handleDuplicateFieldsDB = (err) => {
  // Get the duplicate name from between the quotes in the err.errmsg
  const value = err.errmsg.match(/(["'])(\?.)*?\1/)[0];
  const msg = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(msg, 400);
};

/**
 ** HANDLE VALIDATION ERRORS
 *
 * @param {*} err
 * @returns AppError
 */
const handleValidationErrorDB = (err) => {
  const errArr = Object.values(err.errors).map((el) => el.message);
  const msg = `Invalid input data. ${errArr.join('. ')}`;
  return new AppError(msg, 400);
};

/**
 ** HANDLE JSON WEB TOKEN ERROR
 *
 * @param {*} err
 * @returns AppError
 */
const handleJsonWebTokenErrorDB = () =>
  new AppError('Invalid token. Please log in again.', 401);

/**
 ** HANDLE JSON WEB TOKEN EXPIRED ERROR
 *
 * @param {*} err
 * @returns AppError
 */
const handleTokenExpiredErrorDB = () =>
  new AppError('Your token has expired! Please log in again.', 401);

// !GLOBAL ERROR HANDLING MIDDLEWARE
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; //500 = InternalServerError
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // make a hard copy of the function variable
    let error = { ...err };
    error.message = err.message;

    // handle misc operational errors
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJsonWebTokenErrorDB();
    if (error.name === 'TokenExpiredError') error = handleTokenExpiredErrorDB();

    sendErrorProd(error, req, res);
  }

  next();
};
