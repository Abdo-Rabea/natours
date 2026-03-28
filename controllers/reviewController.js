const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const createReview = catchAsync(async (req, res) => {
  // review, tourId, userId + rating are auto validated and anything else will be ignored thanks to schema validation using mongoose;;
  console.log(req.params.tourId);
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

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
  createReview,
  getAllReviews,
  deleteReview,
  updateReview,
};
