const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, viewController.getMyTours);

router.get('/', authController.isLoggedIn, viewController.getOverview);

router.use(authController.isLoggedIn);
router.get('/tour/:slug', viewController.getTour);

router.get('/login', viewController.getLoginForm);
router.get('/signup', viewController.getSignupForm);

module.exports = router;
