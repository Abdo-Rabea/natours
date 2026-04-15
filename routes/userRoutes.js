const express = require('express');

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
  uploadUserPhoto,
  resizeUserPhoto,
} = require('../controllers/userController');

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  restrictTo,
  logout,
} = require('../controllers/authController');

const router = express.Router();

// Authentication routes
// only need post route for signup
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

router.use(protect); // all routes after this middleware will be protected
router.patch('/update-password', updatePassword);
// RESTful API design

router.route('/update-me').patch(uploadUserPhoto, resizeUserPhoto, updateMe);
router.route('/delete-me').delete(deleteMe);
router.route('/me').get(getMe, getUser);

router.use(restrictTo('admin')); // all routes after this middleware will be restricted to admin only
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

// note: you keep post createUser for the user creation in the admin panel.
module.exports = router;
