import express from 'express';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
} from '../controllers/propertyController.js';
import { protect } from '../middlewares/auth.js';
import { uploadPropertyImages } from '../middlewares/upload.js';

const router = express.Router();

router.get('/', getProperties);
router.get('/user/my-properties', protect, getMyProperties);
router.get('/:id', getPropertyById);
router.post('/', protect, uploadPropertyImages, createProperty);
router.put('/:id', protect, uploadPropertyImages, updateProperty);
router.delete('/:id', protect, deleteProperty);

export default router;
