import multer from 'multer';

// Use memory storage to process image buffers directly for ImageKit
const storage = multer.memoryStorage();

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

// Limit up to 4 images per property, max 5MB each
export const uploadPropertyImages = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 4,                  // Max 4 images
  },
  fileFilter,
}).array('images', 4);
