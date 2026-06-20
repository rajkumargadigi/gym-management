import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import bcrypt from 'bcryptjs';

// ==========================================
// USER PROFILE FUNCTIONS (FOR REGULAR USERS)
// ==========================================

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;

      if (req.body.password) {
        user.password = req.body.password; // Model pre-save hashes this
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        membership: updatedUser.membership,
      });
    } else {
      res.status(404);
      return next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user transaction history
// @route   GET /api/users/transactions
// @access  Private
export const getUserTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ paymentDate: -1 });
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ADMIN USER MANAGEMENT FUNCTIONS (FOR ADMINS)
// ==========================================

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a user
// @route   POST /api/users
// @access  Private/Admin
export const createUserByAdmin = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      return next(new Error('User already exists'));
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role || 'user',
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update any user details
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUserByAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.role = req.body.role || user.role;
      
      if (req.body.membership) {
        user.membership = {
          ...user.membership,
          ...req.body.membership
        };
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404);
      return next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUserByAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.role === 'admin' && (await User.countDocuments({ role: 'admin' })) <= 1) {
        res.status(400);
        return next(new Error('Cannot delete the last admin account'));
      }
      await user.deleteOne();
      res.json({ message: 'User removed successfully' });
    } else {
      res.status(404);
      return next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};
