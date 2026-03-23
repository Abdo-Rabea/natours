const mongoose = require('mongoose');
const slugify = require('slugify');

// define the schema of the tour collection in the application level
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation and not on update; *updating priceDiscount will not work at all
          console.log(this);
          return val < Number(this.price);
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      // select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    // geometry data for geospatial queries
    startLocation: {
      // GeoJSON (mongoose knows it is a GeoJSON because of the type and the coordinates properties)
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number], // longitude, latitude
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number], // longitude, latitude
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// it is same as derived entity in the relation db, but we apply this in the application level
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// document middleware
// on save hook acts only for .save() and .create() only.
tourSchema.pre('save', function (next) {
  // console.log(this); // the current document that will be saved
  this.slug = slugify(this.name, { lower: true }); // next cause error
});

// tourSchema.pre('save', function () {
//   console.log('2', this); // the current document that will be saved
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc); // the document that was just saved to the database
//   next(); // needs next
// });

// query middleware
//* ^find will run for all find queries, including findOne, findMany, findById, etc. it will not run for findOneAndUpdate, findOneAndDelete, etc. because they are not find queries, they are update and delete queries.
tourSchema.pre(/^find/, function () {
  // called query middleware because this refers to the query being executed
  this.start = Date.now();
  this.find({ secretTour: { $ne: true } });
});

// populate tours with guides data
tourSchema.pre(/^find/, function () {
  this.populate({
    path: 'guides',
    select: ['-__v', '-passwordChangedAt'], // exclude version key and passwordChangedAt
  });
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`); // the documents that were found by the query
  next();
});

// aggregation middleware
tourSchema.pre('aggregate', function () {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
});

const Tour = mongoose.model('Tour', tourSchema); // capital T because it is a class, and the name of the collection in the database will be the lowercase plural of the model name, so it will be tours.

module.exports = Tour;
