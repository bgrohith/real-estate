import mongoose from 'mongoose';
import Property from '../models/Property.js';
import { uploadToImageKit, deleteFromImageKit } from '../services/imageKitService.js';
import { mockStore } from '../utils/mockStore.js';

// @desc    Get all properties with advanced filters, search, and pagination
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res, next) => {
  try {
    const {
      keyword,
      city,
      propertyType,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      bedrooms,
      furnishing,
      possession,
      featured,
      sortBy = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Fallback store if MongoDB Atlas is not connected yet
    if (mongoose.connection.readyState !== 1) {
      const { data, total } = mockStore.findProperties(
        { keyword, city, propertyType, minPrice, maxPrice, bedrooms, furnishing, featured: featured === 'true' },
        sortBy,
        skip,
        limitNum
      );
      return res.status(200).json({
        success: true,
        count: data.length,
        total,
        totalPages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        data,
      });
    }

    const query = {};

    // Keyword search across title, description, address, city
    if (keyword && keyword.trim() !== '') {
      const regex = new RegExp(keyword.trim(), 'i');
      query.$or = [
        { title: regex },
        { description: regex },
        { 'location.address': regex },
        { 'location.city': regex },
        { 'location.landmark': regex },
      ];
    }

    // City filter
    if (city && city.trim() !== '' && city !== 'All Cities') {
      query['location.city'] = new RegExp(`^${city.trim()}$`, 'i');
    }

    // Property Type filter
    if (propertyType && propertyType.trim() !== '' && propertyType !== 'All Types') {
      query.propertyType = propertyType.trim();
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Area range filter (sq ft)
    if (minArea || maxArea) {
      query.area = {};
      if (minArea) query.area.$gte = Number(minArea);
      if (maxArea) query.area.$lte = Number(maxArea);
    }

    // Bedrooms filter
    if (bedrooms && bedrooms !== 'Any') {
      if (bedrooms === '4+') {
        query.bedrooms = { $gte: 4 };
      } else {
        query.bedrooms = Number(bedrooms);
      }
    }

    // Furnishing filter
    if (furnishing && furnishing !== 'Any') {
      query.furnishing = furnishing;
    }

    // Possession filter
    if (possession && possession !== 'Any') {
      query.possession = possession;
    }

    // Featured only
    if (featured === 'true') {
      query.featured = true;
    }

    // Sorting
    let sortOptions = {};
    if (sortBy === 'price_asc') {
      sortOptions = { price: 1 };
    } else if (sortBy === 'price_desc') {
      sortOptions = { price: -1 };
    } else if (sortBy === 'area_desc') {
      sortOptions = { area: -1 };
    } else if (sortBy === 'views') {
      sortOptions = { viewsCount: -1 };
    } else {
      sortOptions = { createdAt: -1 };
    }

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('owner', 'name email phone avatar')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const prop = mockStore.findPropertyById(req.params.id);
      if (!prop) {
        return res.status(404).json({ success: false, error: 'Property not found' });
      }
      return res.status(200).json({ success: true, data: prop });
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewsCount: 1 } },
      { new: true }
    ).populate('owner', 'name email phone avatar');

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found with this ID',
      });
    }

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new property listing (with up to 4 images via ImageKit)
// @route   POST /api/properties
// @access  Private
export const createProperty = async (req, res, next) => {
  try {
    const {
      title,
      description,
      propertyType,
      price,
      area,
      bedrooms,
      bathrooms,
      furnishing,
      possession,
      address,
      city,
      state,
      pincode,
      landmark,
      amenities,
      featured,
    } = req.body;

    // Process uploaded images via Multer + ImageKit (up to 4 images)
    let images = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.slice(0, 4).map((file) =>
        uploadToImageKit(file.buffer, file.originalname)
      );
      images = await Promise.all(uploadPromises);
    } else if (req.body.imageUrls) {
      // Support array of image URL strings from client or seed
      const urls = Array.isArray(req.body.imageUrls)
        ? req.body.imageUrls
        : [req.body.imageUrls];
      images = urls.slice(0, 4).map((url) => ({
        url,
        fileId: '',
        thumbnail: url,
      }));
    }

    // Fallback placeholder image if none provided
    if (images.length === 0) {
      images.push({
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        fileId: '',
        thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      });
    }

    // Parse amenities if passed as JSON string or comma-separated
    let parsedAmenities = [];
    if (typeof amenities === 'string') {
      try {
        parsedAmenities = JSON.parse(amenities);
      } catch (e) {
        parsedAmenities = amenities.split(',').map((a) => a.trim());
      }
    } else if (Array.isArray(amenities)) {
      parsedAmenities = amenities;
    }

    // Fallback if MongoDB is not connected
    if (mongoose.connection.readyState !== 1) {
      const prop = mockStore.createProperty(
        {
          title,
          description,
          propertyType: propertyType || 'Apartment',
          price: Number(price),
          area: Number(area),
          bedrooms: Number(bedrooms) || 0,
          bathrooms: Number(bathrooms) || 0,
          furnishing: furnishing || 'Semi-Furnished',
          possession: possession || 'Ready to Move',
          location: {
            address: address || '',
            city: city || 'Mumbai',
            state: state || '',
            pincode: pincode || '',
            landmark: landmark || '',
          },
          images,
          amenities: parsedAmenities.length > 0 ? parsedAmenities : undefined,
          featured: featured === 'true' || featured === true,
        },
        req.user.id
      );
      return res.status(201).json({ success: true, data: prop });
    }

    const property = await Property.create({
      title,
      description,
      propertyType: propertyType || 'Apartment',
      price: Number(price),
      area: Number(area),
      bedrooms: Number(bedrooms) || 0,
      bathrooms: Number(bathrooms) || 0,
      furnishing: furnishing || 'Semi-Furnished',
      possession: possession || 'Ready to Move',
      location: {
        address: address || '',
        city: city || 'Mumbai',
        state: state || '',
        pincode: pincode || '',
        landmark: landmark || '',
      },
      images,
      amenities: parsedAmenities.length > 0 ? parsedAmenities : undefined,
      featured: featured === 'true' || featured === true,
      owner: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property listing
// @route   PUT /api/properties/:id
// @access  Private
export const updateProperty = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const updated = mockStore.updateProperty(req.params.id, req.body);
      if (!updated) return res.status(404).json({ success: false, error: 'Property not found' });
      return res.status(200).json({ success: true, data: updated });
    }

    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
      });
    }

    // Enforce ownership: only owner or admin can update
    if (
      property.owner.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to modify this property listing.',
      });
    }

    const updateData = { ...req.body };

    // Update location fields if provided
    if (req.body.address || req.body.city || req.body.state || req.body.pincode || req.body.landmark) {
      updateData.location = {
        address: req.body.address || property.location.address,
        city: req.body.city || property.location.city,
        state: req.body.state !== undefined ? req.body.state : property.location.state,
        pincode: req.body.pincode !== undefined ? req.body.pincode : property.location.pincode,
        landmark: req.body.landmark !== undefined ? req.body.landmark : property.location.landmark,
      };
    }

    // Handle new images upload (up to 4)
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.slice(0, 4).map((file) =>
        uploadToImageKit(file.buffer, file.originalname)
      );
      const newImages = await Promise.all(uploadPromises);
      // Append or replace depending on request
      if (req.body.replaceImages === 'true') {
        // delete old images from ImageKit
        for (const img of property.images) {
          if (img.fileId) await deleteFromImageKit(img.fileId);
        }
        updateData.images = newImages;
      } else {
        updateData.images = [...property.images, ...newImages].slice(0, 4);
      }
    }

    // Parse amenities
    if (typeof updateData.amenities === 'string') {
      try {
        updateData.amenities = JSON.parse(updateData.amenities);
      } catch (e) {
        updateData.amenities = updateData.amenities.split(',').map((a) => a.trim());
      }
    }

    property = await Property.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('owner', 'name email phone avatar');

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property listing
// @route   DELETE /api/properties/:id
// @access  Private
export const deleteProperty = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      mockStore.deleteProperty(req.params.id);
      return res.status(200).json({ success: true, message: 'Property listing deleted successfully.' });
    }

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
      });
    }

    // Enforce ownership: only owner or admin can delete
    if (
      property.owner.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this property listing.',
      });
    }

    // Clean up images in ImageKit
    if (property.images && property.images.length > 0) {
      for (const img of property.images) {
        if (img.fileId) {
          await deleteFromImageKit(img.fileId);
        }
      }
    }

    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Property listing deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's owned properties
// @route   GET /api/properties/user/my-properties
// @access  Private
export const getMyProperties = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const properties = mockStore.findPropertiesByOwner(req.user.id || req.user._id);
      return res.status(200).json({ success: true, count: properties.length, data: properties });
    }

    const properties = await Property.find({ owner: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};
