const express = require('express');
const {
  aliasTop5Tours,
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getToursStats,
  getMonthlyPlan,
} = require('../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// calling review router
router.use('/:tourId/reviews', reviewRouter);

// router.param('id', checkID); // will run this function checkID every time there is a route with :id parameter, it is a middleware function that will be executed before the route handler, it is used to check if the id parameter is valid or not, if it is not valid we can send a response with an error message, if it is valid we can call next() to pass the control (add it in the middle of pipeline).
router.route('/top-5-cheap').get(aliasTop5Tours, getAllTours);
router.route('/tours-stats').get(getToursStats);
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide'), getMonthlyPlan);
router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
