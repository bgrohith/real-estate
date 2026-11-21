import express from 'express';
import { getMe, updateProfile, toggleFavorite, getFavorites } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.get('/me', getMe);
router.put('/me', updateProfile);
router.get('/favorites', getFavorites);
router.post('/favorites/:propertyId', toggleFavorite);

export default router;
