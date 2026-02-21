const mongoose = require('mongoose');

// define the schema of the tour collection in the application level
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], // validator, it will show the error message if the name is not provided
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema); // capital T because it is a class, and the name of the collection in the database will be the lowercase plural of the model name, so it will be tours.

module.exports = Tour;
