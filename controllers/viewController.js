const Tour = require('../models/tourModel');

const getOverview = async (req, res) => {
  // 1) Get tours data
  const tours = await Tour.find();
  // 2) build template
  // 3) render that template using tour data from 1)
  res.status(200).render('overview', { title: 'All tours overview', tours });
};

const getTour = (req, res) => {
  res.status(200).render('tour', { title: 'The Forest Hiker' });
};

module.exports = {
  getOverview,
  getTour,
};
