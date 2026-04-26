const express = require('express');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router
  .route('/checkout-session/:tourId')
  .get(authController.protect, bookingController.getCheckoutSession);

// router.use(authController.protect);

module.exports = router;
