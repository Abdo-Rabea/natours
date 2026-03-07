const express = require('express');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const { signup, login } = require('../controllers/authController');

const router = express.Router();

// Authentication routes
// only need post route for signup
router.post('/signup', signup);
router.post('/login', login);

// RESTful API design
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

// note: you keep post createUser for the user creation in the admin panel.
module.exports = router;
