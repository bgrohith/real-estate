# SapphireIQ – Full-Stack Luxury Real Estate Platform

**SapphireIQ** is a modern, responsive, full-stack real estate marketplace and advisory platform tailored specifically for the Indian real estate market. The platform connects high-net-worth buyers, investors, property owners, and real estate consultants with verified listings, multi-criteria filtering, 4-image uploads via ImageKit, private viewing booking workflows, and an optional Firecrawl-powered AI Property Hub.

---

## 🌟 Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, TypeScript, Tailwind CSS, React Router DOM, React Context API, Axios, React.lazy |
| **Backend** | Node.js, Express.js (ES Modules), REST API, Mongoose |
| **Database** | MongoDB Atlas / Local MongoDB (with resilient auto-fallback) |
| **Authentication** | JWT Authentication, bcrypt password hashing, Nodemailer password reset |
| **Image Management**| Multer (4 images limit), ImageKit Cloud CDN storage |
| **Security** | Helmet, CORS allowlist, express-rate-limit, Environment variables |
| **AI Integration** | Firecrawl Web Discovery, AI Model API ranking, BYOK header, Rental filter |
| **Deployment** | Frontend on **Vercel** (`vercel.json`), Backend on **Render** (`render.yaml`) |

---

## 🏗️ Project Architecture

```
real estate/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB Atlas connection & resilient failover
│   │   ├── controllers/     # Auth, Property, Appointment, AI Hub controllers
│   │   ├── middlewares/     # JWT Auth, Multer (4 images), Helmet, RateLimit, Error handling
│   │   ├── models/          # User, Property, Appointment (Mongoose Schemas)
│   │   ├── routes/          # Express REST API routes
│   │   ├── scripts/         # Realistic Indian property seeder & End-to-End test suite
│   │   ├── services/        # ImageKit CDN, Nodemailer SMTP, Firecrawl AI Hub
│   │   ├── utils/           # Resilient storage fallback
│   │   └── server.js        # Express application entry
│   ├── .env.example         # Backend environment variables template
│   ├── render.yaml          # Render backend deployment configuration
│   └── package.json
│
├── frontend/
│   ├── public/              # Favicon, robots.txt, sitemap.xml
│   ├── src/
│   │   ├── components/      # Navbar, Footer, PropertyCard, ImageGallery, ViewingModal, ProtectedRoute
│   │   ├── context/         # AuthContext (JWT, Login, Register, Profile, Reset Password)
│   │   ├── pages/           # Lazy-loaded pages: Home, Listings, Details, Post, Dashboard, AI Hub, Auth
│   │   ├── services/        # Axios client with JWT interceptor
│   │   ├── types/           # TypeScript interfaces
│   │   ├── utils/           # Indian Rupee (₹ Cr/Lakhs) formatters, Cities, Amenities
│   │   ├── App.tsx          # React Router DOM with React.lazy & Suspense
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env.example         # Frontend environment variables template
│   ├── vercel.json          # Vercel SPA routing configuration
│   ├── tailwind.config.js   # Sapphire & Luxury theme colors
│   └── package.json
│
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on Node.js v26)
- **npm** v10+

### 2. Backend Setup
```bash
cd backend
npm install
```

Configure your `.env` file (copy from `.env.example`):
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database: MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/sapphireiq

# JWT Secret
JWT_SECRET=sapphireiq_jwt_secret_dev_key_secure_983742
JWT_EXPIRE=30d

# ImageKit Credentials (Optional - auto falls back to local uploads if empty)
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=

# Nodemailer SMTP Configuration
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=
SMTP_PASS=
FROM_EMAIL=support@sapphireiq.in
FROM_NAME="SapphireIQ Luxury Estates"
```

Seed initial luxury Indian properties and demo accounts:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
# Server will run on http://localhost:5000
```

### 3. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
```

Configure `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_ENABLE_AI_HUB=true
```

Start Vite development server:
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🔑 Demo Accounts

Quickly sign in using one of the pre-configured Indian real estate accounts (with one-click demo fill buttons on `/login`):

| Role | Email | Password |
| :--- | :--- | :--- |
| **Real Estate Consultant** | `rohit.sharma@sapphireiq.in` | `Password@123` |
| **HNI Home Buyer** | `ananya.deshmukh@sapphireiq.in` | `Password@123` |

---

## 🧪 Automated End-to-End Test Suite

Run the full automated test suite verifying all 5 modules:
```bash
cd backend
node src/scripts/testEndpoints.js
```

### Test Coverage:
- `GET /api/health` – API status & uptime
- `GET /api/properties` – Filter by city (Mumbai, Bengaluru, Delhi NCR), category, price, BHK, area
- `POST /api/auth/login` – Secure JWT issue
- `GET /api/users/me` – Current user profile
- `POST /api/auth/register` – Registration with phone & role
- `POST /api/properties` – Creation with 4 images
- `GET /api/properties/:id` – Single property & gallery
- `POST /api/appointments/guest` – Guest viewing booking
- `POST /api/appointments` – Logged-in viewing booking
- `PUT /api/appointments/:id/cancel` – Appointment cancellation with reason
- `POST /api/ai-hub/search` – Firecrawl AI search with code-level rental exclusion and deduplication
- `POST /api/auth/forgot-password` – Nodemailer password reset

---

## 🇮🇳 Indian Real Estate Market Features

1. **Dual Currency Representation**: Automatically formats prices in Crores (`₹ 24.5 Cr`) and Lakhs (`₹ 88 Lakhs`) with price per sq ft metrics.
2. **Top Metropolitan Corridors**: Native filters for Mumbai, Bengaluru, Delhi NCR, Hyderabad, Pune, Goa, Chennai, Kolkata, and Ahmedabad.
3. **BHK Configurations**: 1 BHK, 2 BHK, 3 BHK, 4 BHK, and 5+ BHK Grand Penthouses.
4. **Carpet Area**: Accurately tracked in square feet (sq ft).
5. **RERA & Verified Badges**: Highlights verified title and legal compliance for luxury acquisitions.

---

## 🤖 Module 5: Optional AI Property Hub

The AI Property Hub enables natural language discovery (e.g. *"Find a 4 BHK sea-facing apartment in Worli Mumbai under 20 Cr with infinity pool"*):
- Discover listings using **Firecrawl**.
- **Bring Your Own Key (BYOK)**: Enter your Firecrawl API key in the UI settings; it is securely forwarded via the `x-firecrawl-key` HTTP header and persisted in `localStorage`.
- **Code-Level Rental Exclusion**: Explicitly checks descriptions and titles to eliminate rental/lease listings, ensuring only purchase opportunities are surfaced.
- **Deduplication Engine**: Removes duplicate cross-posted properties across Indian portals.
- **AI Ranking & Rationale**: Assigns a relevance match score (0-100%) and explains why each property fits your prompt.
- **Feature Flag**: Controlled via `VITE_ENABLE_AI_HUB=true` in `frontend/.env`. When disabled, the rest of the application runs unaffected.

---

## 🚢 Deployment Instructions

### Frontend (Vercel)
1. Import the `frontend` folder into your Vercel Dashboard.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Environment Variables:
   - `VITE_API_URL`: Your deployed Render backend URL (e.g., `https://sapphireiq-api.onrender.com`).
   - `VITE_ENABLE_AI_HUB`: `true`.
6. `frontend/vercel.json` ensures client-side routing works for all deep links.

### Backend (Render)
1. Create a new **Web Service** on Render pointing to the `backend` folder.
2. Environment: **Node**.
3. Build Command: `npm install`.
4. Start Command: `npm start`.
5. Add Environment Variables from `backend/.env.example` (including `MONGODB_URI` from your MongoDB Atlas cluster).
6. Alternatively, use the included `backend/render.yaml` Blueprint for 1-click infrastructure deployment.
