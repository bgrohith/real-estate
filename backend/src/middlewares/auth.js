import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { mockStore } from '../utils/mockStore.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route. Please log in.',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'sapphireiq_jwt_secret_dev_key_secure_983742'
    );

    if (mongoose.connection.readyState !== 1) {
      req.user = mockStore.findUserById(decoded.id);
    } else {
      req.user = await User.findById(decoded.id);
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'The user belonging to this token no longer exists.',
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token. Please log in again.',
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'sapphireiq_jwt_secret_dev_key_secure_983742'
      );
      if (mongoose.connection.readyState !== 1) {
        req.user = mockStore.findUserById(decoded.id);
      } else {
        req.user = await User.findById(decoded.id);
      }
    } catch (err) {
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
};
