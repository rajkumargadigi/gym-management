import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Plan from './models/Plan.js';
import Transaction from './models/Transaction.js';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    // Wait for DB connection
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Plan.deleteMany();
    await Transaction.deleteMany();

    console.log('Database cleared...');

    // 1. Seed Default Plans
    const plans = [
      {
        name: 'Basic',
        price: 999,
        durationInMonths: 1,
        features: ['Gym access', 'Locker access'],
      },
      {
        name: 'Standard',
        price: 1299,
        durationInMonths: 1,
        features: ['Gym access', 'Group classes', 'Locker access'],
      },
      {
        name: 'Premium',
        price: 1599,
        durationInMonths: 1,
        features: ['Gym access', 'Personal trainer', 'Diet consultation'],
      },
    ];

    const createdPlans = await Plan.insertMany(plans);
    console.log(`${createdPlans.length} Membership plans seeded!`);

    // 2. Seed Default Accounts
    // Seed Administrator
    await User.create({
      name: 'System Admin',
      email: 'admin96@gmail.com',
      phone: '9966969696',
      password: 'adminpassword', // Model will hash this before save
      role: 'admin',
    });
    console.log('Administrator account seeded (admin96@gmail.com/ adminpassword)');

    // Seed Regular Member
    await User.create({
      name: 'John Fit',
      email: 'user@gym.com',
      phone: '555-0200',
      password: 'userpassword', // Model will hash this before save
      role: 'user',
      membership: {
        plan: 'None',
        status: 'inactive',
      },
    });
    console.log('Member account seeded (user@gym.com / userpassword)');

    console.log('Database Seeding Completed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();
