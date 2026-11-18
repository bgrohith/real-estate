import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Null for guest bookings
    },
    guestInfo: {
      name: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        trim: true,
      },
    },
    preferredDate: {
      type: Date,
      required: [true, 'Please select a preferred viewing date'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Please choose a preferred time slot'],
      enum: [
        'Morning (10:00 AM - 01:00 PM)',
        'Afternoon (02:00 PM - 05:00 PM)',
        'Evening (05:00 PM - 08:00 PM)',
      ],
      default: 'Morning (10:00 AM - 01:00 PM)',
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled'],
      default: 'Pending',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
    cancelledBy: {
      type: String,
      enum: ['user', 'owner', 'guest', 'none'],
      default: 'none',
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
