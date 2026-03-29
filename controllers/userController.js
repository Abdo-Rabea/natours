const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined!// Please use /signup instead',
  });
};

// facke that user id was sent as parameter.
const getMe = (req, _, next) => {
  req.params.id = req.user.id;
  next();
};
const getUser = factory.getOne(User);
const getAllUsers = factory.getAll(User);

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
  const { user } = req;
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
  const { user } = req;
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
  getMe,
};
