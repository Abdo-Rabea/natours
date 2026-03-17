const express = require('express');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
} = require('../controllers/userController');

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
} = require('../controllers/authController');

const router = express.Router();

// Authentication routes
// only need post route for signup
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.patch('/update-password', protect, updatePassword);
// RESTful API design

router.route('/').get(getAllUsers).post(createUser);
router.route('/update-me').patch(protect, updateMe);
router.route('/delete-me').delete(protect, deleteMe);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

// note: you keep post createUser for the user creation in the admin panel.
module.exports = router;
