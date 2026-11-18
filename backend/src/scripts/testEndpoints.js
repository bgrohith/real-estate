import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

const runTests = async () => {
  console.log('================================================================');
  console.log('🧪 STARTING SAPPHIREIQ COMPREHENSIVE END-TO-END TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}:`, err.response?.data?.error || err.message);
      failed++;
    }
  };

  // Test 1: Healthcheck
  await test('GET /api/health - Health check endpoint', async () => {
    const res = await axios.get(`${BASE_URL}/api/health`);
    if (res.data.status !== 'healthy') throw new Error('Status not healthy');
  });

  // Test 2: Explore Properties (Search & Filter)
  await test('GET /api/properties - Fetch all listings & check filters', async () => {
    const res = await axios.get(`${BASE_URL}/api/properties?city=Mumbai`);
    if (!res.data.success) throw new Error('Failed to fetch properties');
    if (res.data.count < 1) throw new Error('No Mumbai properties returned');
  });

  // Test 3: User Authentication - Login Demo User
  let authToken = '';
  let loggedInUser = null;
  await test('POST /api/auth/login - Login demo agent user', async () => {
    const res = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'rohit.sharma@sapphireiq.in',
      password: 'Password@123',
    });
    if (!res.data.success || !res.data.token) throw new Error('Token not received');
    authToken = res.data.token;
    loggedInUser = res.data.user;
  });

  // Test 4: Current User Information
  await test('GET /api/users/me - Get current user profile', async () => {
    const res = await axios.get(`${BASE_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!res.data.success || res.data.user.email !== 'rohit.sharma@sapphireiq.in') {
      throw new Error('User data mismatch');
    }
  });

  // Test 5: Register New User
  const testEmail = `test.investor.${Date.now()}@sapphireiq.in`;
  let newInvestorToken = '';
  await test('POST /api/auth/register - Register new HNI investor', async () => {
    const res = await axios.post(`${BASE_URL}/api/auth/register`, {
      name: 'Aditya Birla',
      email: testEmail,
      password: 'Password@123',
      phone: '+91 98200 99999',
      role: 'user',
    });
    if (!res.data.success || !res.data.token) throw new Error('Registration failed');
    newInvestorToken = res.data.token;
  });

  // Test 6: Create New Property Listing (Module 2)
  let createdPropId = '';
  await test('POST /api/properties - Create new luxury listing', async () => {
    const res = await axios.post(
      `${BASE_URL}/api/properties`,
      {
        title: 'Oberoi Sky Heights - 3 BHK Sea-Breeze Luxury Residence',
        description: 'Spectacular west-facing apartment with sea views and bespoke Italian marble flooring.',
        propertyType: 'Apartment',
        price: 36000000,
        area: 2450,
        bedrooms: 3,
        bathrooms: 3,
        furnishing: 'Furnished',
        possession: 'Ready to Move',
        city: 'Mumbai',
        address: 'Lokhandwala Complex, Andheri West',
        amenities: JSON.stringify(['Swimming Pool', '24/7 Security', 'Clubhouse']),
        imageUrls: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        ],
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    if (!res.data.success || !res.data.data._id) throw new Error('Property creation failed');
    createdPropId = res.data.data._id;
  });

  // Test 7: Get Single Property by ID
  await test(`GET /api/properties/${createdPropId} - Fetch property details`, async () => {
    const res = await axios.get(`${BASE_URL}/api/properties/${createdPropId}`);
    if (!res.data.success || res.data.data.title !== 'Oberoi Sky Heights - 3 BHK Sea-Breeze Luxury Residence') {
      throw new Error('Property details mismatch');
    }
  });

  // Test 8: Guest Viewing Appointment (Module 3)
  let guestApptId = '';
  await test('POST /api/appointments/guest - Book guest viewing appointment', async () => {
    const res = await axios.post(`${BASE_URL}/api/appointments/guest`, {
      propertyId: createdPropId,
      name: 'Rohan Mehra',
      email: 'rohan.mehra@gmail.com',
      phone: '+91 98200 55555',
      preferredDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      timeSlot: 'Morning (10:00 AM - 01:00 PM)',
      notes: 'Interested in seeing parking bays.',
    });
    if (!res.data.success || !res.data.data._id) throw new Error('Guest booking failed');
    guestApptId = res.data.data._id;
  });

  // Test 9: Authenticated User Viewing Appointment (Module 3)
  let authApptId = '';
  await test('POST /api/appointments - Book viewing as logged-in investor', async () => {
    const res = await axios.post(
      `${BASE_URL}/api/appointments`,
      {
        propertyId: createdPropId,
        preferredDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        timeSlot: 'Evening (05:00 PM - 08:00 PM)',
        notes: 'Checking Vastu orientation.',
      },
      {
        headers: { Authorization: `Bearer ${newInvestorToken}` },
      }
    );
    if (!res.data.success || !res.data.data._id) throw new Error('Authenticated booking failed');
    authApptId = res.data.data._id;
  });

  // Test 10: Cancel Viewing Appointment
  await test(`PUT /api/appointments/${authApptId}/cancel - Cancel appointment`, async () => {
    const res = await axios.put(
      `${BASE_URL}/api/appointments/${authApptId}/cancel`,
      { cancellationReason: 'Schedule conflict with board meeting' },
      { headers: { Authorization: `Bearer ${newInvestorToken}` } }
    );
    if (!res.data.success || res.data.data.status !== 'Cancelled') {
      throw new Error('Appointment status is not Cancelled');
    }
  });

  // Test 11: AI Property Hub Search (Module 5)
  await test('POST /api/ai-hub/search - Natural language AI property discovery', async () => {
    const res = await axios.post(`${BASE_URL}/api/ai-hub/search`, {
      query: '3 BHK sea facing luxury apartment in Worli Mumbai under 10 Cr',
    });
    if (!res.data.success || res.data.data.length === 0) {
      throw new Error('AI search returned no ranked properties');
    }
    // Verify rentals are filtered out
    const hasRental = res.data.data.some((item) =>
      `${item.title} ${item.description}`.toLowerCase().includes('/month')
    );
    if (hasRental) throw new Error('Rental listing was not filtered out');
  });

  // Test 12: Forgot Password Request (Nodemailer)
  await test('POST /api/auth/forgot-password - Request password reset link', async () => {
    const res = await axios.post(`${BASE_URL}/api/auth/forgot-password`, {
      email: 'rohit.sharma@sapphireiq.in',
    });
    if (!res.data.success) throw new Error('Forgot password request failed');
  });

  console.log('\n================================================================');
  console.log(`📊 TEST SUITE SUMMARY: ${passed} Passed | ${failed} Failed`);
  console.log('================================================================\n');

  process.exit(failed > 0 ? 1 : 0);
};

runTests();
