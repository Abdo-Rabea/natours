const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

const createReview = catchAsync(async (req, res) => {
  // review, tourId, userId + rating are auto validated and anything else will be ignored thanks to schema validation using mongoose;;
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

const getAllReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

module.exports = {
  createReview,
  getAllReviews,
};
