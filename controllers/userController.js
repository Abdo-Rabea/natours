const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

// !! Do NOT update passwords with this!
const updateUser = factory.updateOne(User);

const deleteUser = factory.deleteOne(User);

// update the email and name of the user, but not the password
// pre-rquisite: user must be logged in to update his profile
const updateMe = catchAsync(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  if (password || confirmPassword) {
    return next(
      new AppError(
        'You cannot update your password here. Please use the update-password endpoint.',
        400,
      ),
    );
  }
  const user = req.user;
  const userData = req.body;
  const allowed = ['name', 'email'];
  // const filteredBody = filterObj(req.body, 'name', 'email');
  Object.keys(userData)
    .filter((key) => allowed.includes(key))
    .forEach((key) => {
      user[key] = userData[key];
    });
  const updatedUser = await user.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

const deleteMe = catchAsync(async (req, res) => {
  const user = req.user;
  user.active = false;
  await user.save({ validateModifiedOnly: true });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
};
