import catchAsync from '../utils/catchAsync.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/appError.js';

export const signInController = catchAsync(async (req, res, next) => {
  const { email, password } = req.body.formData;

  const user = await User.findOne({ email: email });

  if (!user) {
    return next(new AppError('User does not  exists', 404));
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return next(new AppError('Incorrect Password', 400));
  }

  const token = jwt.sign({ email: user.email, id: user._id }, 'secretkey', {
    expiresIn: '1h',
  });

  res.status(200).json({
    result: 'success',
    message: 'signined successfully',
    data: {
      user,
      token,
    },
  });
});

export const signUpController = catchAsync(async (req, res, next) => {
  const { email, firstName, lastName, confirmPassword, password } = req.body.formData;

  // console.log(req.body);
  const user = await User.findOne({ email });

  if (user) {
    return next(new AppError('User exists, Please SignIn', 401));
  }

  if (password !== confirmPassword) {
    return next(new AppError('confirm password and password must be same', 401));
  }

  // console.log(password + 'BACKEND');

  const salt = await bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    email,
    password: hashedPassword,
    name: `${firstName} ${lastName}`,
  });

  const token = jwt.sign({ email: newUser.email, id: newUser._id }, 'secretkey', {
    expiresIn: '1h',
  });

  res.status(200).json({
    result: 'success',
    message: 'signedup successfully',
    data: {
      newUser,
      token,
    },
  });
});
