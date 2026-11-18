import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a property title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed property description'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    propertyType: {
      type: String,
      required: [true, 'Please select property type'],
      enum: [
        'Apartment',
        'Villa',
        'Penthouse',
        'Independent House',
        'Plot/Land',
        'Commercial',
      ],
      default: 'Apartment',
    },
    price: {
      type: Number,
      required: [true, 'Please specify price in INR'],
      min: [100000, 'Price must be at least ₹ 1,00,000'],
    },
    area: {
      type: Number,
      required: [true, 'Please specify super built-up / carpet area in sq ft'],
      min: [50, 'Area must be at least 50 sq ft'],
    },
    bedrooms: {
      type: Number,
      default: 0,
      min: 0,
      max: 20,
    },
    bathrooms: {
      type: Number,
      default: 0,
      min: 0,
      max: 20,
    },
    furnishing: {
      type: String,
      enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
      default: 'Semi-Furnished',
    },
    possession: {
      type: String,
      enum: ['Ready to Move', 'Under Construction', 'New Launch'],
      default: 'Ready to Move',
    },
    location: {
      address: {
        type: String,
        required: [true, 'Please provide street address or project name'],
        trim: true,
      },
      city: {
        type: String,
        required: [true, 'Please provide city (e.g., Mumbai, Bengaluru, Delhi NCR)'],
        trim: true,
      },
      state: {
        type: String,
        default: '',
        trim: true,
      },
      pincode: {
        type: String,
        default: '',
        trim: true,
      },
      landmark: {
        type: String,
        default: '',
        trim: true,
      },
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        fileId: {
          type: String,
          default: '',
        },
        thumbnail: {
          type: String,
          default: '',
        },
      },
    ],
    amenities: {
      type: [String],
      default: [
        '24/7 Security',
        'Power Backup',
        'Clubhouse',
        'Reserved Parking',
      ],
    },
    status: {
      type: String,
      enum: ['Available', 'Under Offer', 'Sold'],
      default: 'Available',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high performance search and filter
propertySchema.index({ 'location.city': 1, propertyType: 1, price: 1 });
propertySchema.index({ title: 'text', description: 'text', 'location.address': 'text' });

const Property = mongoose.model('Property', propertySchema);
export default Property;
