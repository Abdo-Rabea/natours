const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const getOverview = catchAsync(async (req, res) => {
  // 1) Get tours data
  const tours = await Tour.find();
  // 2) build template
  // 3) render that template using tour data from 1)
  res.status(200).render('overview', { title: 'All tours overview', tours });
});

// you have user
// get all of its tour
const getMyTours = catchAsync(async (req, res, next) => {
  // 1) find all bookings with user id
  const bookings = await Booking.find({ user: req.user.id });

  // 2) find tours
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  res.status(200).render('overview', { title: 'My Tours', tours });
});

const getTour = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    select: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  res.status(200).render('tour', { title: `${tour.name} Tour`, tour });
});

const setAlert = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking-success') {
    res.locals.alert =
      "Your booking was successful! Please check your email for confirmation. If your booking doesn't show up here immediately, please come back later.";
  }
  next();
};

const getLoginForm = catchAsync(async (req, res) => {
  res.status(200).render('login', { title: 'Login to your account' });
});

const getSignupForm = catchAsync(async (req, res) => {
  res.status(200).json({ message: 'not implemented yet' });
});

const getAccount = catchAsync(async (req, res) => {
  res.status(200).render('account', { title: 'Your account', user: req.user });
});

module.exports = {
  getOverview,
  getTour,
  getLoginForm,
  getSignupForm,
  getAccount,
  getMyTours,
  setAlert,
};
