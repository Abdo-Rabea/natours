const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env', override: true });
// set the config before importing the app, because the app file is using the config variables, if we set the config after importing the app, the config variables will not be available in the app.

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch((err) => {
    console.log('DB connection error:', err);
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
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
