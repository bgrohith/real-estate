import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { sendEmail } from '../services/emailService.js';
import { mockStore } from '../utils/mockStore.js';

// Helper to generate JWT token
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id || user.id, role: user.role },
    process.env.JWT_SECRET || 'sapphireiq_jwt_secret_dev_key_secure_983742',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
    },
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Fallback store if MongoDB Atlas is not connected yet
    if (mongoose.connection.readyState !== 1) {
      const existing = mockStore.findUserByEmail(email);
      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'An account with this email address already exists',
        });
      }
      const newUser = mockStore.createUser({ name, email, password, phone, role });
      return sendTokenResponse(newUser, 201, res);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email address already exists',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'user',
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both email and password',
      });
    }

    // Fallback store if MongoDB Atlas is not connected yet
    if (mongoose.connection.readyState !== 1) {
      const user = mockStore.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials. Please check your email and password.',
        });
      }
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials. Please check your email and password.',
        });
      }
      return sendTokenResponse(user, 200, res);
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials. Please check your email and password.',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials. Please check your email and password.',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/users/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const user = mockStore.findUserById(req.user.id || req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      return res.status(200).json({
        success: true,
        user: {
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
      });
    }

    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      avatar: req.body.avatar,
    };

    // Remove undefined values
    Object.keys(fieldsToUpdate).forEach(
      (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    if (mongoose.connection.readyState !== 1) {
      const updated = mockStore.updateUser(req.user.id || req.user._id, fieldsToUpdate);
      return res.status(200).json({
        success: true,
        user: {
          id: updated._id || updated.id,
          name: updated.name,
          email: updated.email,
          role: updated.role,
          phone: updated.phone,
          avatar: updated.avatar,
        },
      });
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an email address',
      });
    }

    if (mongoose.connection.readyState !== 1) {
      const user = mockStore.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'No user registered with this email address',
        });
      }
      const resetToken = crypto.randomBytes(20).toString('hex');
      user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

      return res.status(200).json({
        success: true,
        message: 'Password reset link sent to your email address.',
        resetTokenPreview: resetToken,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No user registered with this email address',
      });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested a password reset for your SapphireIQ account.\n\nPlease navigate to the following link to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email. This link is valid for 15 minutes.`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0ecff; border-radius: 8px;">
        <h2 style="color: #0f296b;">SapphireIQ Real Estate</h2>
        <p>Hello ${user.name},</p>
        <p>We received a request to reset your password for your SapphireIQ account.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #1b49d4; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #64748b; font-size: 14px;">Or copy and paste this link in your browser:<br/><a href="${resetUrl}">${resetUrl}</a></p>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 30px;">This link will expire in 15 minutes. If you did not request a password reset, please ignore this email.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'SapphireIQ - Password Reset Request',
        message,
        html,
      });

      res.status(200).json({
        success: true,
        message: 'Password reset link sent to your email address.',
        resetTokenPreview: process.env.NODE_ENV !== 'production' ? resetToken : undefined,
      });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        error: 'Email could not be sent. Please try again later.',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using token
// @route   PUT /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long',
      });
    }

    if (mongoose.connection.readyState !== 1) {
      const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
      const user = mockStore.users.find(
        (u) => u.resetPasswordToken === resetPasswordToken && u.resetPasswordExpire > Date.now()
      );
      if (!user) {
        return res.status(400).json({ success: false, error: 'Invalid or expired password reset token' });
      }
      user.password = bcrypt.hashSync(password, 10);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      return sendTokenResponse(user, 200, res);
    }

    // Hash token from url
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired password reset token',
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};
