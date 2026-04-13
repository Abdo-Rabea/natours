const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

const getOverview = catchAsync(async (req, res) => {
  // 1) Get tours data
  const tours = await Tour.find();
  // 2) build template
  // 3) render that template using tour data from 1)
  res.status(200).render('overview', { title: 'All tours overview', tours });
});

const getTour = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    select: 'review rating user',
  });
  res.status(200).render('tour', { title: `${tour.name} Tour`, tour });
});

const getLoginForm = catchAsync(async (req, res) => {
  res.status(200).render('login', { title: 'Login to your account' });
});

const getSignupForm = catchAsync(async (req, res) => {
  res.status(200).json({ message: 'not implemented yet' });
});

module.exports = {
  getOverview,
  getTour,
  getLoginForm,
  getSignupForm,
};
