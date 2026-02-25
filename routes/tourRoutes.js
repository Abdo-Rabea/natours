const express = require('express');
const {
  aliasTop5Tours,
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
} = require('../controllers/tourController');

const router = express.Router();
// router.param('id', checkID); // will run this function checkID every time there is a route with :id parameter, it is a middleware function that will be executed before the route handler, it is used to check if the id parameter is valid or not, if it is not valid we can send a response with an error message, if it is valid we can call next() to pass the control (add it in the middle of pipeline).
router.route('/top-5-cheap').get(aliasTop5Tours, getAllTours);
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
