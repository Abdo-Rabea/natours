class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // this calls the constructor of the parent class (Error) and passes the message argument to it, which sets the message property of the error object.
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // this is a custom property that we can use to distinguish between operational errors (errors that are expected and can be handled gracefully) and programming errors (errors that are unexpected and indicate a bug in the code). we can set this property to true for operational errors and false for programming errors, and then in our global error handling middleware function, we can check this property to determine how to handle the error.

    Error.captureStackTrace(this, this.constructor); // this is a method that creates a stack trace for the error object, which is useful for debugging. it takes two arguments: the first argument is the error object itself (this), and the second argument is the constructor function of the error class (this.constructor). this will create a stack trace that starts from the point where the error was created, and it will exclude the constructor function from the stack trace, which makes it easier to read and understand where the error occurred in the code.
  }
}

module.exports = AppError;
