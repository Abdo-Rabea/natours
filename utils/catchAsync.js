// eslint-disable-next-line arrow-body-style
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err)); // this will catch any error that occurs in the async function and pass it to the next middleware function, which is the global error handling middleware function defined in app.js. this way we can handle all the errors in one place and send a response to the client with the error message and status code.
  };
};
