import Razorpay from 'razorpay';
import crypto from 'crypto';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import Plan from '../models/Plan.js';

// @desc    Create Razorpay Order
// @route   POST /api/payments/order
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { planId } = req.body;

    if (!planId) {
      res.status(400);
      return next(new Error('Plan ID is required'));
    }

    // Try to find the plan in MongoDB
    let plan = await Plan.findById(planId);
    
    // Fallback static plan details in case DB isn't seeded yet
    if (!plan) {
      const defaultPlans = {
        'default-basic': { name: 'Basic', price: 29, durationInMonths: 1 },
        'default-standard': { name: 'Standard', price: 49, durationInMonths: 1 },
        'default-premium': { name: 'Premium', price: 79, durationInMonths: 1 },
      };
      plan = defaultPlans[planId];
    }

    if (!plan) {
      res.status(404);
      return next(new Error('Membership plan not found'));
    }

    const isPlaceholderKey = process.env.RAZORPAY_KEY_ID === 'rzp_test_placeholder_key_id';

    if (isPlaceholderKey) {
      // Return simulated order details
      return res.status(201).json({
        id: `order_sim_${crypto.randomBytes(6).toString('hex')}`,
        amount: plan.price * 100,
        currency: 'INR',
        notes: {
          userId: req.user.id,
          planName: plan.name,
          durationInMonths: plan.durationInMonths || 1,
        },
        simulated: true,
      });
    }

    // Initialize Razorpay SDK
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: plan.price * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user.id,
        planName: plan.name,
        durationInMonths: plan.durationInMonths || 1,
      },
    };

    const order = await razorpay.orders.create(options);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay Payment Signature & Activate Membership
// @route   POST /api/payments/verify
// @access  Private
export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      planName,
      amount,
      durationInMonths,
    } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id) {
      res.status(400);
      return next(new Error('Payment verify details missing'));
    }

    const isPlaceholderKey = process.env.RAZORPAY_KEY_ID === 'rzp_test_placeholder_key_id';
    let verified = false;

    if (isPlaceholderKey) {
      // Simulate successful signature verification for testing
      verified = true;
    } else {
      // Verify signature using crypto
      const text = `${razorpay_order_id}|${razorpay_payment_id}`;
      const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');

      verified = generated_signature === razorpay_signature;
    }

    if (verified) {
      // Find the user
      const user = await User.findById(req.user.id);
      if (!user) {
        res.status(404);
        return next(new Error('User not found'));
      }

      // Calculate new membership dates
      const monthsToAdd = parseInt(durationInMonths || 1);
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + monthsToAdd);

      // Update user membership status
      user.membership = {
        plan: planName,
        status: 'active',
        startDate,
        endDate,
      };
      await user.save();

      // Log Transaction details
      const transaction = await Transaction.create({
        transactionId: razorpay_payment_id,
        orderId: razorpay_order_id,
        user: req.user.id,
        planName,
        amount: parseFloat(amount) / 100, // convert paise back to rupee/dollar
        paymentStatus: 'success',
        paymentDate: new Date(),
      });

      res.status(200).json({
        success: true,
        message: 'Membership activated successfully',
        membership: user.membership,
        transaction,
      });
    } else {
      // Log Failed Transaction
      await Transaction.create({
        transactionId: razorpay_payment_id || 'failed_trx',
        orderId: razorpay_order_id,
        user: req.user.id,
        planName,
        amount: parseFloat(amount) / 100,
        paymentStatus: 'failed',
        paymentDate: new Date(),
      });

      res.status(400);
      return next(new Error('Invalid payment signature, verification failed'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all transactions (Admin only)
// @route   GET /api/payments
// @access  Private/Admin
export const getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({})
      .populate('user', 'name email')
      .sort({ paymentDate: -1 });
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};
