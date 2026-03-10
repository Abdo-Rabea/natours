const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valid email'],
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'please provide a password'],
    minlength: [8, 'password must be at least 8 characters long'],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'please confirm your password'],
    validate: {
      // this only works on CREATE and SAVE!!! not on UPDATE
      validator: function (value) {
        return value === this.password;
      },
      message: 'passwords are not the same',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
});

// now this correctPassword method will be available on all user documents, and we can use it in our authController to check if the password is correct or not. // * (instance method)
userSchema.methods.correctPassword = function (
  candidatePassword,
  userPassword,
) {
  // this.password is not available here because we set select: false in the schema, so we need to pass the userPassword as an argument
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
