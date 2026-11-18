import express from 'express';
import {
  bookGuestAppointment,
  bookAuthAppointment,
  getMyAppointments,
  getOwnerAppointments,
  cancelAppointment,
  updateAppointmentStatus,
} from '../controllers/appointmentController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Guest booking route (no login required)
router.post('/guest', bookGuestAppointment);

// Authenticated booking routes
router.post('/', protect, bookAuthAppointment);
router.get('/my-appointments', protect, getMyAppointments);
router.get('/owner-appointments', protect, getOwnerAppointments);
router.put('/:id/cancel', protect, cancelAppointment);
router.put('/:id/status', protect, updateAppointmentStatus);

export default router;
