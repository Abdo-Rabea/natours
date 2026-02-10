const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const app = express();
// this app file is usually used to define the app and the middleware functions, and the routes, and then we export the app to be used in server.js to start the server.

// 1. middleware
app.use(express.json()); // this is a middleware function that parses the incoming request body and makes it available on the req.body property. it is used to parse JSON data sent in the request body, which is common in API requests. without this middleware, req.body would be undefined when trying to access the data sent in the request body.
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next(); // to call the next middleware function in the stack, if we don't call next() the request will be stuck and the server will not respond to the client.
});
app.use(morgan('dev'));

// serving static files
app.use(express.static(`${__dirname}/public`)); // this is a middleware function that serves static files from the specified directory. in this case, it serves files from the 'public' directory. when a request is made for a file that exists in the 'public' directory, it will be served directly without going through any other route handlers or middleware functions. this is useful for serving images, CSS files, JavaScript files, and other static assets that are needed for the frontend of the application.

// order of using middleware functions is important, if we use app.use(express.json()) after defining the routes, the req.body will be undefined in the route handlers because the middleware function will not be executed before the route handlers. so we need to use app.use(express.json()) before defining the routes to ensure that the request body is parsed and available in the route handlers.

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// after all of this modification you only have only one single ground of truth for each route

module.exports = app; // we export the app to be used in server.js to start the server, this way we can separate the concerns of creating the app and server, and we can also use the app in other files if needed without starting the server.
