import mongoose from 'mongoose';
import Appointment from '../models/Appointment.js';
import Property from '../models/Property.js';
import { mockStore } from '../utils/mockStore.js';

// @desc    Book a property viewing as a guest (No login required)
// @route   POST /api/appointments/guest
// @access  Public
export const bookGuestAppointment = async (req, res, next) => {
  try {
    const { propertyId, name, email, phone, preferredDate, timeSlot, notes } = req.body;

    if (!propertyId || !name || !email || !phone || !preferredDate) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required guest details: property, name, email, phone, and preferred date.',
      });
    }

    if (mongoose.connection.readyState !== 1) {
      const property = mockStore.findPropertyById(propertyId);
      if (!property) return res.status(404).json({ success: false, error: 'Property not found' });

      const appt = mockStore.createAppointment({
        property,
        owner: property.owner,
        user: null,
        guestInfo: { name, email, phone },
        preferredDate,
        timeSlot: timeSlot || 'Morning (10:00 AM - 01:00 PM)',
        notes: notes || '',
      });
      return res.status(201).json({
        success: true,
        message: 'Viewing appointment booked successfully! The property consultant will contact you to confirm.',
        data: appt,
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
      });
    }

    const appointment = await Appointment.create({
      property: property._id,
      owner: property.owner,
      user: null, // Guest booking
      guestInfo: {
        name,
        email,
        phone,
      },
      preferredDate,
      timeSlot: timeSlot || 'Morning (10:00 AM - 01:00 PM)',
      notes: notes || '',
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Viewing appointment booked successfully! The property consultant will contact you to confirm.',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Book a property viewing as an authenticated user
// @route   POST /api/appointments
// @access  Private
export const bookAuthAppointment = async (req, res, next) => {
  try {
    const { propertyId, preferredDate, timeSlot, notes, phone } = req.body;

    if (!propertyId || !preferredDate) {
      return res.status(400).json({
        success: false,
        error: 'Please provide property ID and preferred viewing date.',
      });
    }

    if (mongoose.connection.readyState !== 1) {
      const property = mockStore.findPropertyById(propertyId);
      if (!property) return res.status(404).json({ success: false, error: 'Property not found' });

      const appt = mockStore.createAppointment({
        property,
        owner: property.owner,
        user: req.user,
        guestInfo: {
          name: req.user.name,
          email: req.user.email,
          phone: phone || req.user.phone || '',
        },
        preferredDate,
        timeSlot: timeSlot || 'Morning (10:00 AM - 01:00 PM)',
        notes: notes || '',
      });
      return res.status(201).json({
        success: true,
        message: 'Viewing appointment requested successfully!',
        data: appt,
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
      });
    }

    // Prevent booking own property
    if (property.owner.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'You cannot book a viewing for your own property.',
      });
    }

    const appointment = await Appointment.create({
      property: property._id,
      owner: property.owner,
      user: req.user.id,
      guestInfo: {
        name: req.user.name,
        email: req.user.email,
        phone: phone || req.user.phone || '',
      },
      preferredDate,
      timeSlot: timeSlot || 'Morning (10:00 AM - 01:00 PM)',
      notes: notes || '',
      status: 'Pending',
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('property', 'title location price images propertyType')
      .populate('owner', 'name email phone avatar');

    res.status(201).json({
      success: true,
      message: 'Viewing appointment requested successfully!',
      data: populatedAppointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointments booked by the current user
// @route   GET /api/appointments/my-appointments
// @access  Private
export const getMyAppointments = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const appointments = mockStore.findAppointmentsByUser(req.user.id || req.user._id);
      return res.status(200).json({ success: true, count: appointments.length, data: appointments });
    }

    const appointments = await Appointment.find({ user: req.user.id })
      .populate('property', 'title location price images propertyType')
      .populate('owner', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointments requested on properties owned by current user
// @route   GET /api/appointments/owner-appointments
// @access  Private
export const getOwnerAppointments = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const appointments = mockStore.findAppointmentsByOwner(req.user.id || req.user._id);
      return res.status(200).json({ success: true, count: appointments.length, data: appointments });
    }

    const appointments = await Appointment.find({ owner: req.user.id })
      .populate('property', 'title location price images propertyType')
      .populate('user', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an appointment (by booking user or property owner)
// @route   PUT /api/appointments/:id/cancel
// @access  Private
export const cancelAppointment = async (req, res, next) => {
  try {
    const { cancellationReason } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const updated = mockStore.updateAppointmentStatus(req.params.id, 'Cancelled', cancellationReason);
      return res.status(200).json({
        success: true,
        message: 'Appointment cancelled successfully.',
        data: updated,
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }

    const isBooker = appointment.user && appointment.user.toString() === req.user.id;
    const isOwner = appointment.owner.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isBooker && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this appointment.',
      });
    }

    appointment.status = 'Cancelled';
    appointment.cancellationReason = cancellationReason || 'Cancelled by user/owner';
    appointment.cancelledBy = isBooker ? 'user' : 'owner';
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully.',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status (Confirm / Cancel by owner)
// @route   PUT /api/appointments/:id/status
// @access  Private
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be Pending, Confirmed, or Cancelled',
      });
    }

    if (mongoose.connection.readyState !== 1) {
      const updated = mockStore.updateAppointmentStatus(req.params.id, status);
      return res.status(200).json({
        success: true,
        message: `Appointment status updated to ${status}.`,
        data: updated,
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }

    // Only property owner or admin can confirm
    if (appointment.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only the property owner can confirm or update appointment status.',
      });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}.`,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};
