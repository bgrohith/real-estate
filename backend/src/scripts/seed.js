import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Property from '../models/Property.js';
import Appointment from '../models/Appointment.js';

dotenv.config();

const propertiesData = [
  {
    title: 'Lodha Ciel - 4 BHK Ultra-Luxury Penthouse with Sea View',
    description: 'Perched on the 70th floor of World Towers, this residence offers an unobstructed 270-degree panorama of the Arabian Sea and the Mumbai skyline. Features private elevator access, double-height ceiling living hall, Italian Statuario marble flooring, private temperature-controlled plunge pool, and customized German Poggenpohl kitchen.',
    propertyType: 'Penthouse',
    price: 245000000, // ₹ 24.5 Cr
    area: 4850,
    bedrooms: 4,
    bathrooms: 5,
    furnishing: 'Furnished',
    possession: 'Ready to Move',
    location: {
      address: 'World Towers, Senapati Bapat Marg, Lower Parel',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400013',
      landmark: 'Next to St. Regis Hotel',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_1_1',
        thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_1_2',
        thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_1_3',
        thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_1_4',
        thumbnail: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=400&q=80',
      },
    ],
    amenities: [
      'Arabian Sea View',
      'Private Plunge Pool',
      'Saint Amand Concierge',
      'Helipad Access',
      'Private Elevator',
      'EV Charging Bays',
      'Spa & Wellness Suites',
    ],
    featured: true,
  },
  {
    title: 'Prestige Kingfisher Towers - 4 BHK Regal Residence',
    description: 'Overlooking the lush greenery of Cubbon Park and UB City, this iconic luxury residence in Central Bengaluru combines royal heritage with contemporary grandeur. Sprawling deck balcony, acoustic home theater, master suite with his-and-hers walk-in closets, and 4 dedicated basement car parks.',
    propertyType: 'Apartment',
    price: 320000000, // ₹ 32 Cr
    area: 8320,
    bedrooms: 4,
    bathrooms: 5,
    furnishing: 'Semi-Furnished',
    possession: 'Ready to Move',
    location: {
      address: 'Kasturba Cross Road, Ashok Nagar, UB City Zone',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      landmark: 'Adjacent to UB City',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_2_1',
        thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_2_2',
        thumbnail: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=400&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_2_3',
        thumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_2_4',
        thumbnail: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=400&q=80',
      },
    ],
    amenities: [
      'Cubbon Park Views',
      'Infinity Lap Pool',
      'Championship Squash Court',
      '4 Covered Parking Slots',
      'Smart Home Automation',
      '24/7 Multi-tier Security',
    ],
    featured: true,
  },
  {
    title: 'DLF Magnolias - 4 BHK Championship Golf Course Facing Home',
    description: 'Set within the prestigious DLF Golf and Country Club in Gurugram, DLF Magnolias defines the pinnacle of NCR luxury. Boasting a massive wraps-around balcony with sweeping greens, custom acoustic insulation, high ceilings, separate staff quarters, and club membership.',
    propertyType: 'Apartment',
    price: 195000000, // ₹ 19.5 Cr
    area: 6360,
    bedrooms: 4,
    bathrooms: 5,
    furnishing: 'Furnished',
    possession: 'Ready to Move',
    location: {
      address: 'Golf Course Road, Sector 42',
      city: 'Delhi NCR',
      state: 'Haryana',
      pincode: '122002',
      landmark: 'DLF Golf Course Phase 5',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_3_1',
        thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_3_2',
        thumbnail: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_3_3',
        thumbnail: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=400&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_3_4',
        thumbnail: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
      },
    ],
    amenities: [
      'Golf Course View',
      'Club Magnolias Access',
      'Private Cigar Lounge',
      'Temperature Controlled Pool',
      'High Speed Elevators',
      'Servant Quarters',
    ],
    featured: true,
  },
  {
    title: 'Jayabheri The Peak - 4 BHK Sky Villa',
    description: 'Modern architectural marvel located in Hyderabad financial tech corridor. 11.5 feet clear ceiling height, sunlit open-plan layouts, double-glazed soundproof glass facade, and world-class leisure clubhouse spanning 50,000 sq ft.',
    propertyType: 'Apartment',
    price: 58000000, // ₹ 5.8 Cr
    area: 4400,
    bedrooms: 4,
    bathrooms: 4,
    furnishing: 'Semi-Furnished',
    possession: 'Ready to Move',
    location: {
      address: 'Financial District, Nanakramguda, Gachibowli',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500032',
      landmark: 'Near WaveRock SEZ',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_4_1',
        thumbnail: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=400&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_4_2',
        thumbnail: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=400&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_4_3',
        thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_4_4',
        thumbnail: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=400&q=80',
      },
    ],
    amenities: [
      '50,000 sq ft Clubhouse',
      'Infinity Pool on Terrace',
      'Tennis Courts',
      'Billiards & Bowling',
      '24/7 Security & CCTV',
      '100% DG Power Backup',
    ],
    featured: false,
  },
  {
    title: 'Sol de Goa Portuguese Heritage Luxury Villa',
    description: 'Stunning Indo-Portuguese heritage estate nestled amidst lush coconut groves near Candolim beach. Private infinity swimming pool, sun-drenched courtyards, antique teakwood rafters, landscaped tropical gardens, and dedicated butler quarters.',
    propertyType: 'Villa',
    price: 115000000, // ₹ 11.5 Cr
    area: 5500,
    bedrooms: 5,
    bathrooms: 6,
    furnishing: 'Furnished',
    possession: 'Ready to Move',
    location: {
      address: 'Nerul - Candolim Road',
      city: 'Goa',
      state: 'Goa',
      pincode: '403114',
      landmark: 'Near Nerul River & Candolim Beach',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_5_1',
        thumbnail: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=400&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_5_2',
        thumbnail: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_5_3',
        thumbnail: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=400&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_5_4',
        thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
      },
    ],
    amenities: [
      'Private Swimming Pool',
      'Tropical Garden Pavilion',
      'Gourmet Outdoor Barbecue',
      'Staff Quarters',
      'Solar Power Array',
      'High Perimeter Security',
    ],
    featured: true,
  },
  {
    title: 'Amanora Gateway Towers by Swarovski - 3 BHK Designer Home',
    description: 'Iconic golden curved towers designed by Swarovski in Hadapsar, Pune. Features sparkling Swarovski crystal fixtures, floor-to-ceiling glass balconies, digital keyless locks, infinity sky pool, and private screening room.',
    propertyType: 'Apartment',
    price: 21500000, // ₹ 2.15 Cr
    area: 2150,
    bedrooms: 3,
    bathrooms: 3,
    furnishing: 'Furnished',
    possession: 'Ready to Move',
    location: {
      address: 'Amanora Park Town, Hadapsar',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411028',
      landmark: 'Opposite Magarpatta City Cybercity',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_6_1',
        thumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_6_2',
        thumbnail: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_6_3',
        thumbnail: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_6_4',
        thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
      },
    ],
    amenities: [
      'Swarovski Crystal Accents',
      'Sky Lounge at 45th Floor',
      'Heated Olympic Pool',
      'EV Car Charging Station',
      'Concierge Desk',
      'Clubhouse & Gym',
    ],
    featured: false,
  },
  {
    title: 'Adani Shantigram The Belvedere Golf Villa',
    description: 'Magnificent Mediterranean-style 4 BHK luxury villa situated within Shantigram township. Expansive private lawn, double height living room, Italian designer fittings, private golf putting green, and bespoke clubhouse membership.',
    propertyType: 'Villa',
    price: 78000000, // ₹ 7.8 Cr
    area: 4800,
    bedrooms: 4,
    bathrooms: 5,
    furnishing: 'Semi-Furnished',
    possession: 'Ready to Move',
    location: {
      address: 'Sarkhej - Gandhinagar Highway, Near Vaishno Devi Circle',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '382421',
      landmark: 'Next to Belvedere Golf Club',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_7_1',
        thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_7_2',
        thumbnail: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=400&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_7_3',
        thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_7_4',
        thumbnail: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=400&q=80',
      },
    ],
    amenities: [
      'Private Golf Putting Green',
      'Private Landscaped Lawn',
      'Belvedere Club Access',
      'Full Home Automation',
      'Gated Community with 24/7 Patrol',
    ],
    featured: false,
  },
  {
    title: 'Puravankara Somerset Green - 2 BHK High-Floor Apartment',
    description: 'Chic, premium 2 BHK apartment in prime Electronic City, Bengaluru. High carpet area efficiency, modern modular kitchen with chimney, aesthetic balcony overlooking green boulevards, biometric door entry, and vibrant community living.',
    propertyType: 'Apartment',
    price: 8800000, // ₹ 88 Lakhs
    area: 1240,
    bedrooms: 2,
    bathrooms: 2,
    furnishing: 'Semi-Furnished',
    possession: 'Ready to Move',
    location: {
      address: 'Phase 1, Electronic City',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560100',
      landmark: 'Near Infosys Gate 1',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_8_1',
        thumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_8_2',
        thumbnail: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_8_3',
        thumbnail: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=400&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
        fileId: 'seed_8_4',
        thumbnail: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=400&q=80',
      },
    ],
    amenities: [
      'Swimming Pool',
      'Gym & Yoga Studio',
      'Children Play Area',
      'Covered Parking',
      'CCTV & 24/7 Guards',
    ],
    featured: false,
  },
];

const seedDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sapphireiq';
    console.log(`Connecting to MongoDB at: ${uri}`);
    await mongoose.connect(uri);
    console.log('MongoDB connected for seeding.');

    // Clear existing collections
    await User.deleteMany();
    await Property.deleteMany();
    await Appointment.deleteMany();
    console.log('Cleared existing data.');

    // Create Demo Users
    const user1 = await User.create({
      name: 'Rohit Sharma',
      email: 'rohit.sharma@sapphireiq.in',
      password: 'Password@123',
      phone: '+91 98201 12345',
      role: 'agent',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    });

    const user2 = await User.create({
      name: 'Ananya Deshmukh',
      email: 'ananya.deshmukh@sapphireiq.in',
      password: 'Password@123',
      phone: '+91 99302 67890',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    });

    console.log(`Created demo users:\n 1. ${user1.email} (Password@123)\n 2. ${user2.email} (Password@123)`);

    // Assign owner to properties and insert
    const propertiesWithOwners = propertiesData.map((prop, idx) => ({
      ...prop,
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

    await Appointment.create({
      property: insertedProperties[1]._id,
      owner: user2._id,
      user: user1._id,
      guestInfo: {
        name: user1.name,
        email: user1.email,
        phone: user1.phone,
      },
      preferredDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      timeSlot: 'Afternoon (02:00 PM - 05:00 PM)',
      notes: 'Client looking for immediate move-in ready high-floor residence.',
      status: 'Pending',
    });

    console.log('Seeded sample viewing appointments.');
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding Error:', err.message);
    process.exit(1);
  }
};

seedDB();
