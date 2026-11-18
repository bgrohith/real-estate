import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Initial Demo Users
const initialUsers = [
  {
    _id: '65a000000000000000000001',
    id: '65a000000000000000000001',
    name: 'Rohit Sharma',
    email: 'rohit.sharma@sapphireiq.in',
    password: bcrypt.hashSync('Password@123', 10),
    phone: '+91 98201 12345',
    role: 'agent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '65a000000000000000000002',
    id: '65a000000000000000000002',
    name: 'Ananya Deshmukh',
    email: 'ananya.deshmukh@sapphireiq.in',
    password: bcrypt.hashSync('Password@123', 10),
    phone: '+91 99302 67890',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    createdAt: new Date().toISOString(),
  },
];

// Initial Indian Luxury Properties
const initialProperties = [
  {
    _id: '65b000000000000000000001',
    id: '65b000000000000000000001',
    title: 'Lodha Ciel - 4 BHK Ultra-Luxury Penthouse with Sea View',
    description: 'Perched on the 70th floor of World Towers, this residence offers an unobstructed 270-degree panorama of the Arabian Sea and the Mumbai skyline. Features private elevator access, double-height ceiling living hall, Italian Statuario marble flooring, private temperature-controlled plunge pool, and customized German Poggenpohl kitchen.',
    propertyType: 'Penthouse',
    price: 245000000,
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
    status: 'Available',
    featured: true,
    viewsCount: 142,
    owner: initialUsers[0],
    createdAt: new Date().toISOString(),
  },
  {
    _id: '65b000000000000000000002',
    id: '65b000000000000000000002',
    title: 'Prestige Kingfisher Towers - 4 BHK Regal Residence',
    description: 'Overlooking the lush greenery of Cubbon Park and UB City, this iconic luxury residence in Central Bengaluru combines royal heritage with contemporary grandeur. Sprawling deck balcony, acoustic home theater, master suite with his-and-hers walk-in closets, and 4 dedicated basement car parks.',
    propertyType: 'Apartment',
    price: 320000000,
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
    status: 'Available',
    featured: true,
    viewsCount: 98,
    owner: initialUsers[1],
    createdAt: new Date().toISOString(),
  },
  {
    _id: '65b000000000000000000003',
    id: '65b000000000000000000003',
    title: 'DLF Magnolias - 4 BHK Championship Golf Course Facing Home',
    description: 'Set within the prestigious DLF Golf and Country Club in Gurugram, DLF Magnolias defines the pinnacle of NCR luxury. Boasting a massive wraps-around balcony with sweeping greens, custom acoustic insulation, high ceilings, separate staff quarters, and club membership.',
    propertyType: 'Apartment',
    price: 195000000,
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
    status: 'Available',
    featured: true,
    viewsCount: 210,
    owner: initialUsers[0],
    createdAt: new Date().toISOString(),
  },
  {
    _id: '65b000000000000000000004',
    id: '65b000000000000000000004',
    title: 'Jayabheri The Peak - 4 BHK Sky Villa',
    description: 'Modern architectural marvel located in Hyderabad financial tech corridor. 11.5 feet clear ceiling height, sunlit open-plan layouts, double-glazed soundproof glass facade, and world-class leisure clubhouse spanning 50,000 sq ft.',
    propertyType: 'Apartment',
    price: 58000000,
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
    status: 'Available',
    featured: false,
    viewsCount: 88,
    owner: initialUsers[1],
    createdAt: new Date().toISOString(),
  },
  {
    _id: '65b000000000000000000005',
    id: '65b000000000000000000005',
    title: 'Sol de Goa Portuguese Heritage Luxury Villa',
    description: 'Stunning Indo-Portuguese heritage estate nestled amidst lush coconut groves near Candolim beach. Private infinity swimming pool, sun-drenched courtyards, antique teakwood rafters, landscaped tropical gardens, and dedicated butler quarters.',
    propertyType: 'Villa',
    price: 115000000,
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
    status: 'Available',
    featured: true,
    viewsCount: 175,
    owner: initialUsers[0],
    createdAt: new Date().toISOString(),
  },
  {
    _id: '65b000000000000000000006',
    id: '65b000000000000000000006',
    title: 'Amanora Gateway Towers by Swarovski - 3 BHK Designer Home',
    description: 'Iconic golden curved towers designed by Swarovski in Hadapsar, Pune. Features sparkling Swarovski crystal fixtures, floor-to-ceiling glass balconies, digital keyless locks, infinity sky pool, and private screening room.',
    propertyType: 'Apartment',
    price: 21500000,
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
      landmark: 'Opposite Magarpatta Cybercity',
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
    status: 'Available',
    featured: false,
    viewsCount: 114,
    owner: initialUsers[1],
    createdAt: new Date().toISOString(),
  },
];

// Initial Sample Appointments
const initialAppointments = [
  {
    _id: '65c000000000000000000001',
    id: '65c000000000000000000001',
    property: initialProperties[0],
    owner: initialUsers[0],
    user: initialUsers[1],
    guestInfo: {
      name: initialUsers[1].name,
      email: initialUsers[1].email,
      phone: initialUsers[1].phone,
    },
    preferredDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    timeSlot: 'Morning (10:00 AM - 01:00 PM)',
    notes: 'Interested in seeing the sea view and clubhouse amenities on 70th floor.',
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '65c000000000000000000002',
    id: '65c000000000000000000002',
    property: initialProperties[1],
    owner: initialUsers[1],
    user: initialUsers[0],
    guestInfo: {
      name: initialUsers[0].name,
      email: initialUsers[0].email,
      phone: initialUsers[0].phone,
    },
    preferredDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    timeSlot: 'Afternoon (02:00 PM - 05:00 PM)',
    notes: 'Client looking for immediate move-in ready high-floor residence.',
    status: 'Pending',
    createdAt: new Date().toISOString(),
  },
];

class MemoryStore {
  constructor() {
    this.users = [...initialUsers];
    this.properties = [...initialProperties];
    this.appointments = [...initialAppointments];
  }

  // Users
  findUserByEmail(email) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.users.find((u) => (u._id || u.id).toString() === id.toString());
  }

  createUser(userData) {
    const _id = '65a' + crypto.randomBytes(10).toString('hex').slice(0, 21);
    const user = {
      _id,
      id: _id,
      ...userData,
      password: bcrypt.hashSync(userData.password, 10),
      createdAt: new Date().toISOString(),
    };
    this.users.push(user);
    return user;
  }

  updateUser(id, data) {
    const idx = this.users.findIndex((u) => (u._id || u.id).toString() === id.toString());
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], ...data };
      return this.users[idx];
    }
    return null;
  }

  // Properties
  findProperties(filter = {}, sort = {}, skip = 0, limit = 12) {
    let result = [...this.properties];

    if (filter.keyword) {
      const q = filter.keyword.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.city.toLowerCase().includes(q) ||
          p.location.address.toLowerCase().includes(q)
      );
    }

    if (filter.city && filter.city !== 'All Cities') {
      result = result.filter((p) => p.location.city.toLowerCase() === filter.city.toLowerCase());
    }

    if (filter.propertyType && filter.propertyType !== 'All Types') {
      result = result.filter((p) => p.propertyType === filter.propertyType);
    }

    if (filter.minPrice) {
      result = result.filter((p) => p.price >= Number(filter.minPrice));
    }
    if (filter.maxPrice) {
      result = result.filter((p) => p.price <= Number(filter.maxPrice));
    }

    if (filter.bedrooms) {
      if (filter.bedrooms === '4+') {
        result = result.filter((p) => p.bedrooms >= 4);
      } else {
        result = result.filter((p) => p.bedrooms === Number(filter.bedrooms));
      }
    }

    if (filter.furnishing && filter.furnishing !== 'Any') {
      result = result.filter((p) => p.furnishing === filter.furnishing);
    }

    if (filter.featured) {
      result = result.filter((p) => p.featured === true);
    }

    // Sort
    if (sort === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);
    else if (sort === 'area_desc') result.sort((a, b) => b.area - a.area);
    else if (sort === 'views') result.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
    else result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = result.length;
    const paginated = result.slice(skip, skip + limit);
    return { data: paginated, total };
  }

  findPropertyById(id) {
    const prop = this.properties.find((p) => (p._id || p.id).toString() === id.toString());
    if (prop) {
      prop.viewsCount = (prop.viewsCount || 0) + 1;
    }
    return prop;
  }

  findPropertiesByOwner(ownerId) {
    return this.properties.filter((p) => {
      const pOwnerId = typeof p.owner === 'object' ? (p.owner._id || p.owner.id) : p.owner;
      return pOwnerId.toString() === ownerId.toString();
    });
  }

  createProperty(propData, ownerId) {
    const owner = this.findUserById(ownerId) || { id: ownerId, name: 'SapphireIQ User' };
    const _id = '65b' + crypto.randomBytes(10).toString('hex').slice(0, 21);
    const newProp = {
      _id,
      id: _id,
      ...propData,
      owner,
      status: 'Available',
      viewsCount: 1,
      createdAt: new Date().toISOString(),
    };
    this.properties.unshift(newProp);
    return newProp;
  }

  updateProperty(id, propData) {
    const idx = this.properties.findIndex((p) => (p._id || p.id).toString() === id.toString());
    if (idx !== -1) {
      this.properties[idx] = { ...this.properties[idx], ...propData };
      return this.properties[idx];
    }
    return null;
  }

  deleteProperty(id) {
    const idx = this.properties.findIndex((p) => (p._id || p.id).toString() === id.toString());
    if (idx !== -1) {
      this.properties.splice(idx, 1);
      return true;
    }
    return false;
  }

  // Appointments
  findAppointmentsByUser(userId) {
    return this.appointments.filter((a) => {
      const uId = a.user ? (typeof a.user === 'object' ? (a.user._id || a.user.id) : a.user) : null;
      return uId && uId.toString() === userId.toString();
    });
  }

  findAppointmentsByOwner(ownerId) {
    return this.appointments.filter((a) => {
      const oId = typeof a.owner === 'object' ? (a.owner._id || a.owner.id) : a.owner;
      return oId && oId.toString() === ownerId.toString();
    });
  }

  createAppointment(apptData) {
    const _id = '65c' + crypto.randomBytes(10).toString('hex').slice(0, 21);
    const newAppt = {
      _id,
      id: _id,
      ...apptData,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    this.appointments.unshift(newAppt);
    return newAppt;
  }

  updateAppointmentStatus(id, status, cancellationReason = '') {
    const appt = this.appointments.find((a) => (a._id || a.id).toString() === id.toString());
    if (appt) {
      appt.status = status;
      if (cancellationReason) appt.cancellationReason = cancellationReason;
      return appt;
    }
    return null;
  }
}

export const mockStore = new MemoryStore();
export default mockStore;
