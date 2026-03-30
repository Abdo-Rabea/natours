// review, rating, createdAt, ref to tour, ref to user

const { default: mongoose } = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// static methods
/**
 * calculate the average rating and the number of ratings for a tour and update the tour document with the new values
 * this points to the current model aka Review
 * @param {string} tourId
 */
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0] ? stats[0].nRating : 0,
    ratingsAverage: stats[0] ? stats[0].avgRating : 4.5,
  });
};

// populate the user and tour data for every review
reviewSchema.pre(/^find/, function () {
  this.populate({
    path: 'user',
    select: 'name  photo',
  });
});

reviewSchema.post('save', async function () {
  await this.constructor.calcAverageRatings(this.tour);
});

// reviewSchema.pre(/^findOneAnd/, async function () {
//   this.tourId = (await this.model.findOne(this.getQuery())).tour;
// });
reviewSchema.post(/^findOneAnd/, async (doc) => {
  if (!doc) return;
  await doc.constructor.calcAverageRatings(doc.tour);
});
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
