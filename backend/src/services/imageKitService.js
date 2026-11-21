import ImageKit from 'imagekit';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

let imagekit = null;

const isConfigured = Boolean(
  process.env.IMAGEKIT_PUBLIC_KEY &&
  process.env.IMAGEKIT_PRIVATE_KEY &&
  process.env.IMAGEKIT_URL_ENDPOINT
);

if (isConfigured) {
  try {
    imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
    console.log('[ImageKit] Initialized successfully with cloud CDN endpoint.');
  } catch (err) {
    console.warn('[ImageKit] Initialization error:', err.message);
  }
} else {
  console.log('[ImageKit] Credentials not provided in .env - using local media storage with ImageKit-compatible schema.');
}

/**
 * Upload an image buffer to ImageKit (or local storage fallback)
 * @param {Buffer} buffer - File buffer from Multer
 * @param {string} originalname - Original file name
 * @returns {Promise<{url: string, fileId: string, thumbnail: string}>}
 */
export const uploadToImageKit = async (buffer, originalname) => {
  // If ImageKit configured, upload to ImageKit CDN
  if (imagekit) {
    try {
      const response = await imagekit.upload({
        file: buffer.toString('base64'),
        fileName: `${Date.now()}-${originalname.replace(/\s+/g, '_')}`,
        folder: '/buyyourproperty/properties',
        useUniqueFileName: true,
      });

      return {
        url: response.url,
        fileId: response.fileId,
        thumbnail: response.thumbnailUrl || response.url,
      };
    } catch (error) {
      console.error('[ImageKit Upload Error]', error);
    }
  }

  // Graceful Local Fallback: saves file to uploads directory
  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const ext = path.extname(originalname) || '.jpg';
  const uniqueName = `byp_${Date.now()}_${crypto.randomBytes(4).toString('hex')}${ext}`;
  const filePath = path.join(uploadsDir, uniqueName);

  fs.writeFileSync(filePath, buffer);

  const fileUrl = `/uploads/${uniqueName}`;
  return {
    url: fileUrl,
    fileId: `local_${uniqueName}`,
    thumbnail: fileUrl,
  };
};

/**
 * Delete image by fileId from ImageKit or local storage
 * @param {string} fileId
 */
export const deleteFromImageKit = async (fileId) => {
  if (!fileId) return;

  if (fileId.startsWith('local_')) {
    const filename = fileId.replace('local_', '');
    const filePath = path.resolve(process.cwd(), 'uploads', filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn('Could not delete local file:', err.message);
      }
    }
    return;
  }

  if (imagekit) {
    try {
      await imagekit.deleteFile(fileId);
    } catch (err) {
      console.warn('[ImageKit Delete Error]', err.message);
    }
  }
};
