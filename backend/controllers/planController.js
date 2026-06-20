import Plan from '../models/Plan.js';

// @desc    Get all membership plans
// @route   GET /api/plans
// @access  Public
export const getPlans = async (req, res, next) => {
  try {
    const plans = await Plan.find({});
    res.json(plans);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a membership plan
// @route   POST /api/plans
// @access  Private/Admin
export const createPlan = async (req, res, next) => {
  try {
    const { name, price, durationInMonths, features } = req.body;

    if (!name || !price || !features) {
      res.status(400);
      return next(new Error('Please fill in all required fields'));
    }

    const planExists = await Plan.findOne({ name });
    if (planExists) {
      res.status(400);
      return next(new Error('Plan with this name already exists'));
    }

    const plan = await Plan.create({
      name,
      price,
      durationInMonths: durationInMonths || 1,
      features,
    });

    res.status(201).json(plan);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a membership plan
// @route   PUT /api/plans/:id
// @access  Private/Admin
export const updatePlan = async (req, res, next) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (plan) {
      plan.name = req.body.name || plan.name;
      plan.price = req.body.price !== undefined ? req.body.price : plan.price;
      plan.durationInMonths = req.body.durationInMonths !== undefined ? req.body.durationInMonths : plan.durationInMonths;
      plan.features = req.body.features || plan.features;

      const updatedPlan = await plan.save();
      res.json(updatedPlan);
    } else {
      res.status(404);
      return next(new Error('Membership plan not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a membership plan
// @route   DELETE /api/plans/:id
// @access  Private/Admin
export const deletePlan = async (req, res, next) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (plan) {
      await plan.deleteOne();
      res.json({ message: 'Plan removed successfully' });
    } else {
      res.status(404);
      return next(new Error('Membership plan not found'));
    }
  } catch (error) {
    next(error);
  }
};
