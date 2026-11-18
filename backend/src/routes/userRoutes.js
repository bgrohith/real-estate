import express from 'express';
import { getMe, updateProfile } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.get('/me', getMe);
router.put('/me', updateProfile);

export default router;
