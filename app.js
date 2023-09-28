const express = require('express');

const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
//const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

//////////////////////////////////
const app = express();

// Setting up: Pug in express
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));

//////////////////////////////////
// 1) GLOBAL MIDDLEWARE

// Serving Static Files  public.
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
// app.use(helmet());

// Development logging
// app.use(morgan('dev')); // PATCH /api/v1/tours/1 200 0.777 ms - 66
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Limit requests from same API
// How many requests per IP we are going to allow in a certain amount of time
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour!',
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Parse data coming from a url encoded form
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Parses the data from cookie
app.use(cookieParser());

// Date Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Dare Sanitization against XSS(cross-site scripting attacks)
app.use(xss());

// Preventing parameter pollution
app.use(
  hpp({
    whitelist: [
      'price',
      'duration',
      'difficulty',
      'maxGroupSize',
      'ratingsAverage',
      'ratingsQuantity',
    ],
  }),
);

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requesTime = new Date().toISOString();

  next();
});

//////////////////////////////////
// 2) ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

/////////////////////////
module.exports = app;
