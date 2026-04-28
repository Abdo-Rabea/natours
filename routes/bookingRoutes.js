const express = require('express');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router
  .route('/checkout-session/:tourId')
  .get(authController.protect, bookingController.getCheckoutSession);

router.use(
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
);
router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBookingApi);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

// router.use(authController.protect);

module.exports = router;
