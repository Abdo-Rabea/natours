// import data from JSON file and save to database
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '../../config.env' });

const Tour = require(`./../../models/tourModel`);

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);
mongoose.connect(DB).then(() => console.log('DB connection successful!'));
// read JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
// import data into database
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
// delete all data from database
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  // process.exit();
  // yes the process terminates after closing the connection
  // mongoose.connection.close().then(() => {
  //   console.log('connection closed');
  // });
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

// console.log(process.argv);

// why the app continue running after importing or deleting data? because the process is not exited after importing or deleting data, we need to exit the process after importing or deleting data, otherwise the process will continue running and waiting for more commands. we can use process.exit() to exit the process after importing or deleting data.

// but i thaught that there is noting in the queue after importing or deleting data, so the process should exit automatically, but it is not the case, because there are some asynchronous operations that are still running in the background, such as the database connection, and the process will not exit until all the asynchronous operations are completed. so we need to use process.exit() to force the process to exit after importing or deleting data.

// so if i close the db connection here it will exit?
