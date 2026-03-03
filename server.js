const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('Exception💥: ', err.name, '-', err.message);
  process.exit(1); // you should always exit the process
});

dotenv.config({ path: './config.env' });

// set the config before importing the app, because the app file is using the config variables, if we set the config after importing the app, the config variables will not be available in the app.

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB, { serverSelectionTimeoutMS: 5000 }).then(() => {
  console.log('DB connection successful!');
});

const app = require('./app');

// testing env
// console.log(app.get('env')); // development. // set by express, it is set to development by default, but we can change it to production by setting the NODE_ENV environment variable to production when starting the server, for example: NODE_ENV=production node server.js. this is useful for running different code in development and production environments, for example, we can use a different database in development and production, or we can enable debugging in development and disable it in production.

// $env:NODE_ENV="production"; node server.js
// console.log(app.get('env'));
// console.log(process.env.NODE_ENV);
// $env:NODE_ENV="production"; node server.js
// instead of setting the environment variable in the command line, use npm package dotenv to set the environment variable in a .env file.

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('Exception💥: ', err.name, '-', err.message);
  server.close(() => {
    process.exit(1);
  });
});
