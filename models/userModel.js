const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
  forgotPasswordToken: String,
  forgotPasswordExpiresAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// hash the password if modified before saving to the user document
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
});

// set passwordChangedAt field if the password is modified
userSchema.pre('save', function () {
  if (!this.isModified('password') || this.isNew) return;
  this.passwordChangedAt = Date.now() - 1000; // subtract 1 second to ensure that the token is created after the password has been changed, because sometimes there is a delay in saving the document to the database, and the token might be created before the passwordChangedAt field is updated, so we subtract 1 second to ensure that the token is always created after the password has been changed.
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
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

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex'); // this is the token that we will send to the user, it is a random string of 32 bytes converted to hexadecimal format, it is not hashed because we need to send it to the user in the email, and we will hash it before saving it to the database for security reasons.
  const hashedResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.forgotPasswordToken = hashedResetToken;
  this.forgotPasswordExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
