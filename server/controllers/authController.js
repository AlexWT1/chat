const filterObj = require('../utils/filterObj');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const crypto = require('crypto');
const otp = require('../templates/mail/otp');
const resetPassword = require('../templates/mail/resetPassword');

const mailService = require('../services/mailer');

const User = require('../models/user');

const signToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET);
const { promisify } = require('util');

exports.register = async (req, res, next) => {
  const { firsName, lastName, email, password } = req.body;
  const filterBody = filterObj(req.body, 'firstName', 'lastName', 'password', 'email');
  const existing_user = await User.findOne({ email: email });

  if (existing_user && existing_user.verified) {
    return res.status(400).json({
      status: 'error',
      message: 'Email already in use, Please login.',
    });
  } else if (existing_user) {
    await User.findOneAndUpdate({ email: email }, filterBody, {
      new: true,
      validateModifiedOnly: true,
    });

    req.userId = existing_user._id;
    next();
  } else {
    const new_user = await User.create(filterBody);

    req.userId = new_user._id;
    next();
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      status: 'error',
      message: 'Both email and password are required',
    });
    return;
  }

  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !user.password) {
    res.status(400).json({
      status: 'error',
      message: 'Incorrect password',
    });

    return;
  }

  if (!user || !(await user.correctPassword(password, user.password))) {
    res.status(400).json({
      status: 'error',
      message: 'Email or password is incorrect',
    });

    return;
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    message: 'Logged in successfully!',
    token,
    user_id: user._id,
  });
};

exports.sendOTP = async (req, res, next) => {
  const { userId } = req;
  const new_otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  const otp_expiry_time = Date.now() + 10 * 60 * 1000;
  const user = await User.findByIdAndUpdate(userId, {
    otp_expiry_time: otp_expiry_time,
  });

  user.otp = new_otp.toString();

  await user.save({ new: true, validateModifiedOnly: true });
  console.log(new_otp);

  mailService.sendEmail({
    from: 'darkspecter4100@gmail.com',
    to: user.email,
    subject: 'Verification OTP',
    html: otp(user.firstName, new_otp),
    attachments: [],
  });

  res.status(200).json({
    status: 'success',
    message: 'OTP sent successfully!',
  });
};

exports.verifyOTP = async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await User.findOne({
    email,
    otp_expiry_time: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400).json({
      status: 'error',
      message: 'Email is Invalid or OTP exired',
    });
  }

  if (!(await user.correctOTP(otp, user.otp))) {
    res.staus(400).json({
      status: 'error',
      message: 'OTP is incorrect',
    });
  }

  user.verified = true;
  user.otp = undefined;

  await user.save({ new: true, validateModifiedOnly: true });

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    message: 'OTP verified successfully!',
    token,
    user_id: user._id,
  });
};

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else {
    res.status(400).json({
      status: 'error',
      message: 'You are not logged In! Please log in to get access',
    });
    return;
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const this_user = await User.findById(decoded.userId);

  if (!this_user) {
    res.status(400).json({
      status: 'error',
      message: "The user dosen't exist",
    });
  }

  if (this_user.changedPasswordAfter(decoded.iat)) {
    res.status(400).json({
      status: 'error',
      message: 'User recently updated password ! Please log in again',
    });
  }

  req.user = this_user;
  next();
};

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      staus: 'error',
      message: 'There is no user with  email address',
    });
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `http://localhost:3000/auth/new-password?token=${resetToken}`;
    console.log(resetToken);
    mailService.sendEmail({
      from: 'darkspecter4100@gmail.com',
      to: user.email,
      subject: 'Reset Password',
      html: resetPassword(user.firstName, resetURL),
      attachments: [],
    });
    res.status(200).json({
      status: 'success',
      message: 'Token send to email !',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });
    res.status(500).json({
      status: 'error',
      message: 'There was an error sending the email, Please try again later',
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.body.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      status: 'error',
      message: 'Token is Invalid or Expired',
    });
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    message: 'Password reseted successfully',
    token,
  });
};
