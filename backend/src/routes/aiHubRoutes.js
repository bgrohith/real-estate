import express from 'express';
import { searchAIProperties } from '../controllers/aiHubController.js';

const router = express.Router();

router.post('/search', searchAIProperties);

export default router;
