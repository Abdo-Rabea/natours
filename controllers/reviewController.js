const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// preq: tourId and userId are sitted in the request body using setTourUserIds middleware
const createReview = factory.createOne(Review);

/**
 * @returns {Object} all reviews if no tourId is provided, otherwise it returns the reviews for the specific tour
 * matches: GET /api/v1/reviews
 * matches: GET /api/v1/tours/:tourId/reviews
 */
const getAllReviews = catchAsync(async (req, res) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

const updateReview = factory.updateOne(Review);

const deleteReview = factory.deleteOne(Review);

module.exports = {
  setTourUserIds,
  createReview,
  getAllReviews,
  deleteReview,
  updateReview,
};
