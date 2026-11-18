import React, { useState } from 'react';
import { X, Calendar, Clock, User, Mail, Phone, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Property } from '../types';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatIndianPrice } from '../utils/formatters';

interface ViewingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

export const ViewingModal: React.FC<ViewingModalProps> = ({
  isOpen,
  onClose,
  property,
}) => {
  const { user, isAuthenticated } = useAuth();

  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('Morning (10:00 AM - 01:00 PM)');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (isAuthenticated) {
        // Authenticated user booking route
        const res = await api.post('/api/appointments', {
          propertyId: property._id,
          preferredDate: date,
          timeSlot,
          notes,
          phone,
        });

        if (res.data.success) {
          setSuccessMessage('Private viewing scheduled successfully! Our luxury concierge will coordinate with you.');
        }
      } else {
        // Guest booking route
        if (!name || !email || !phone) {
          setErrorMessage('Please provide your name, email, and phone number to book.');
          setLoading(false);
          return;
        }

        const res = await api.post('/api/appointments/guest', {
          propertyId: property._id,
          name,
          email,
          phone,
          preferredDate: date,
          timeSlot,
          notes,
        });

        if (res.data.success) {
          setSuccessMessage('Viewing appointment booked as guest! A representative will call you for confirmation.');
        }
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.error || 'Unable to book appointment. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-sapphire-900 to-sapphire-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Guided Tour</span>
          </div>
          <h3 className="text-lg font-serif font-bold text-white">
            Schedule a Property Viewing
          </h3>
          <p className="text-xs text-slate-300 mt-1 line-clamp-1">
            {property.title} • {formatIndianPrice(property.price)}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {successMessage ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Viewing Reserved</h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                {successMessage}
              </p>
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-sapphire-700 hover:bg-sapphire-800 text-white font-semibold text-sm rounded-xl transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Guest Information (Only if not logged in) */}
              {!isAuthenticated && (
                <div className="space-y-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                  <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-sapphire-700" />
                    Guest Visitor Details
                  </p>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Singhania"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sapphire-600 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="vikram@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sapphire-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Mobile Phone (+91) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98200 12345"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sapphire-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-sapphire-700" />
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={minDate}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sapphire-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-sapphire-700" />
                    Preferred Time Slot *
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sapphire-600 focus:outline-none bg-white"
                  >
                    <option value="Morning (10:00 AM - 01:00 PM)">Morning (10 AM - 1 PM)</option>
                    <option value="Afternoon (02:00 PM - 05:00 PM)">Afternoon (2 PM - 5 PM)</option>
                    <option value="Evening (05:00 PM - 08:00 PM)">Evening (5 PM - 8 PM)</option>
                  </select>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Specific Requests or Questions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Would like to view parking bay and clubhouse amenities..."
                  className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sapphire-600 focus:outline-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-sapphire-700 hover:bg-sapphire-800 text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-sapphire disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Confirming with Concierge...' : 'Confirm Viewing Appointment'}
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-2">
                  Complimentary & verified site visit. No brokerage or consultation charge.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default ViewingModal;
