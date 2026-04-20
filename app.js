const path = require('path');
const hpp = require('hpp');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('@exortek/express-mongo-sanitize');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const viewRouter = require('./routes/viewRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
// this app file is usually used to define the app and the middleware functions, and the routes, and then we export the app to be used in server.js to start the server.

// *start pug recipe
app.set('view engine', 'pug'); // this is a middleware function that sets the view engine for the application. in this case, we are using pug as the view engine, which allows us to render dynamic HTML pages using pug templates. by setting the view engine, we can use res.render() in our route handlers to render the appropriate template and send it as a response to the client.
app.set('views', path.join(__dirname, 'views')); // this is a middleware function that sets the directory where the view templates are located. in this case, we are setting it to the 'views' directory in the root of the project. by setting the views directory, we can organize our view templates in a specific folder and easily reference them when rendering templates in our route handlers.
// 5) serving static files
app.use(express.static(path.join(__dirname, 'public'))); // this is a middleware function that serves static files from the specified directory. in this case, it serves files from the 'public' directory. when a request is made for a file that exists in the 'public' directory, it will be served directly without going through any other route handlers or middleware functions. this is useful for serving images, CSS files, JavaScript files, and other static assets that are needed for the frontend of the application.
// *end pug recipe (see also app.get before api routes)

// global middleware
// 1) set security HTTP headers
app.use(helmet({ contentSecurityPolicy: false })); // this is a middleware function that sets various HTTP headers to help protect the application from common web vulnerabilities.

app.set('query parser', 'extended'); // this is a middleware function that tells express to use the extended query string parser instead of the default one. the extended query string parser allows for parsing nested objects in the query string, which can be useful for more complex queries. for example, if we have a query string like ?filter[price][gte]=500, the extended query string parser will parse it into an object like { filter: { price: { gte: 500 } } }, which can be easier to work with in our route handlers. without this setting, the default query string parser would not be able to parse nested objects and would return a flat object instead.

// 2) development logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// 3) rate limiter global middleware
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// 4) body parser, reading data from the body into req.body && cookie parser
app.use(express.json({ limit: '10kb' })); // this is a middleware function that parses the incoming request body and makes it available on the req.body property. it is used to parse JSON data sent in the request body, which is common in API requests. without this middleware, req.body would be undefined when trying to access the data sent in the request body.
app.use(cookieParser());

// Sanitize data against NoSQL query injection
app.use(mongoSanitize()); // this is a middleware function that sanitizes the data sent in the request body, query string, and params to prevent NoSQL query injection attacks. it removes any keys that contain $ or ., which are used in MongoDB queries and can be exploited by attackers to manipulate the database. by using this middleware, we can help protect our application from NoSQL query injection attacks.

// Sanitize data against XSS
// app.use(xss()); // this is a middleware function that sanitizes the data sent in the request body, query string, and params to prevent cross-site scripting (XSS) attacks. it removes any HTML tags and JavaScript code from the input data, which can be used by attackers to inject malicious scripts into the application. by using this middleware, we can help protect our application from XSS attacks.

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next(); // to call the next middleware function in the stack, if we don't call next() the request will be stuck and the server will not respond to the client.
});

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// order of using middleware functions is important, if we use app.use(express.json()) after defining the routes, the req.body will be undefined in the route handlers because the middleware function will not be executed before the route handlers. so we need to use app.use(express.json()) before defining the routes to ensure that the request body is parsed and available in the route handlers.

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
// after all of this modification you only have only one single ground of truth for each route

// this to capture the wrong routes and throws error "*"
app.use((req, res, next) => {
  // creating error
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); // we pass the error to the global error handling middleware function, which is defined below, by calling next() with the error object as an argument. this will skip all the remaining middleware functions and route handlers and go directly to the global error handling middleware function, where we can handle the error and send a response to the client.
});

// this to handle the thrown errors
app.use(globalErrorHandler);

module.exports = app; // we export the app to be used in server.js to start the server, this way we can separate the concerns of creating the app and server, and we can also use the app in other files if needed without starting the server.
