const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/img/users');
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split('/')[1];
//     const fileName = `user-${req.user.id}-${Date.now()}.${ext}`;
//     cb(null, fileName);
//   },
// });
const storage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
});
const uploadUserPhoto = upload.single('photo');

const resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();
  const filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${filename}`);

  // passing the file name to updateMe controller to save it to the user doc.
  req.file.filename = filename;
  next();
};

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
  // save the new image name to the user doc.
  if (req.file) user.photo = req.file.filename;

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
  uploadUserPhoto,
  resizeUserPhoto,
};
