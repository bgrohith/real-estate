import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Property from '../models/Property.js';
import Appointment from '../models/Appointment.js';
import { mockStore } from '../utils/mockStore.js';

dotenv.config();

const seedDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/buyyourproperty';
    console.log(`Connecting to MongoDB at: ${uri}`);
    await mongoose.connect(uri);
    console.log('MongoDB connected for seeding BuyYourProperty.');

    await User.deleteMany();
    await Property.deleteMany();
    await Appointment.deleteMany();
    console.log('Cleared existing data.');

    // Create Demo Users
    const user1 = await User.create({
      name: 'Rohit Sharma',
      email: 'rohit.sharma@buyyourproperty.in',
      password: 'Password@123',
      phone: '+91 98201 12345',
      role: 'agent',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    });

    const user2 = await User.create({
      name: 'Ananya Deshmukh',
      email: 'ananya.deshmukh@buyyourproperty.in',
      password: 'Password@123',
      phone: '+91 99302 67890',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    });

    console.log(`Created demo users:\n 1. ${user1.email} (Password@123)\n 2. ${user2.email} (Password@123)`);

    // Assign owner to properties and insert
    const propertiesWithOwners = mockStore.properties.map((prop, idx) => ({
      ...prop,
      _id: undefined,
      id: undefined,
      owner: idx % 2 === 0 ? user1._id : user2._id,
    }));

    const insertedProperties = await Property.insertMany(propertiesWithOwners);
    console.log(`Inserted ${insertedProperties.length} Indian luxury properties.`);

    // Create sample viewing appointments
    await Appointment.create({
      property: insertedProperties[0]._id,
      owner: user1._id,
      user: user2._id,
      guestInfo: {
        name: user2.name,
        email: user2.email,
        phone: user2.phone,
      },
      preferredDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      timeSlot: 'Morning (10:00 AM - 01:00 PM)',
      notes: 'Interested in seeing the sea view and clubhouse amenities on 70th floor.',
      status: 'Confirmed',
    });

    console.log('Seeded sample viewing appointments.');
    console.log('Seeding completed successfully for BuyYourProperty!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding Error:', err.message);
    process.exit(1);
  }
};

seedDB();
