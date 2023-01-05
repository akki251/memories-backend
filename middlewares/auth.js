import jwt, { decode } from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import admin from '../firebase-config.js';

const auth = catchAsync(async (req, res, next) => {
  let token;

  token = req.headers && req.headers.authorization && req.headers.authorization.split(' ')[1];

  const isCustomAuth = token && token.length < 500;

  let decodedData;

  if (token) {
    if (isCustomAuth) {
      decodedData = jwt.verify(token, 'secretkey');
      req.userId = decodedData?.id;
    } else {
      // const decoded = jwt.decode(token);
      // console.log(decoded);
      decodedData = await admin.auth().verifyIdToken(token);
      req.userId = decodedData.uid;
    }

    return next();
  }
  return next(new AppError('Unauthorized Action Please sign in', 401));
});

export default auth;
