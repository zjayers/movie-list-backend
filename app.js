// IMPORT MODULES
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const xssClean = require('xss-clean');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const movieRouter = require('./routes/movieRoutes');

// INIT EXPRESS FRAMEWORK
const app = express();
app.enable('trust proxy');

//Implement CORS
app.use(cors()); // Access-Control-Allow-Origin *
app.options('*', cors());

//USE HELMET PACKAGE TO SET SECURITY HTTP HEADERS
app.use(helmet());

// *RATE LIMITER
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour.',
});

// ADD RATE LIMITER TO THE API ROUTE
app.use('/api', limiter);

// BODY PARSER - READ DATA FROM BODY INTO REQ.BODY
app.use(express.json({ limit: '10kb' })); //Limit body to 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // Form Parser
app.use(cookieParser());

// DATA SANITIZATION AGAINST NOSQL QUERY INJECTION
app.use(mongoSanitize());

// DATA SANITIZATION AGAINST XSS ATTACKS
app.use(xssClean());

//* COMPRESSION FOR TEXT SENT TO CLIENTS
app.use(compression());

// DEVELOPMENT LOGGING - MORGAN
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));

  app.use((req, res, next) => {
    console.log(req.cookies);
    next();
  });
}

// INIT ROUTERS
app.use('/api/v1/', movieRouter);

// ROUTE HANDLER FOR NON-EXISTENT ROUTES
app.all('*', (req, res, next) => {
  next(new AppError(`Can\'t find ${req.originalUrl} on this server!`, 404));
});

// ADD GLOBAL ERROR HANDLER MIDDLEWARE
app.use(globalErrorHandler);

// EXPORT THIS MODULE
module.exports = app;
