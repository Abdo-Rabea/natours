const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');
// const catchAsync = require('../utils/catchAsync');

const setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// preq: tourId and userId are sitted in the request body using setTourUserIds middleware

/**
 * @returns {Object} all reviews if no tourId is provided, otherwise it returns the reviews for the specific tour
 * matches: GET /api/v1/reviews
 * matches: GET /api/v1/tours/:tourId/reviews
 */
const getAllReviews = factory.getAll(Review);
const createReview = factory.createOne(Review);
const getReview = factory.getOne(Review);
const updateReview = factory.updateOne(Review);
const deleteReview = factory.deleteOne(Review);

module.exports = {
  setTourUserIds,
  createReview,
  getAllReviews,
  deleteReview,
  updateReview,
  getReview,
};
