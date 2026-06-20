import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a plan name'],
      unique: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide a plan price'],
    },
    durationInMonths: {
      type: Number,
      default: 1, // default 1 month
    },
    features: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Plan = mongoose.model('Plan', planSchema);
export default Plan;
