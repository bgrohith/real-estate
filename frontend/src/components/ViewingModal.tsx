import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Calendar, Clock, User, Mail, Phone, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Property } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import api from '../services/api';

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
  const { formatPrice } = useCurrency();

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
        const res = await api.post('/api/appointments', {
          propertyId: property._id,
          preferredDate: date,
          timeSlot,
          notes,
          phone,
        });

        if (res.data.success) {
          setSuccessMessage('Private viewing scheduled successfully! Our luxury concierge will coordinate with you.');
          try {
            confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
          } catch {}
        }
      } else {
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
          try {
            confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
          } catch {}
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-800 animate-in zoom-in-95 duration-200 text-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-sapphire-950 to-slate-900 p-6 relative border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VIP Guided Viewing</span>
          </div>
          <h3 className="text-xl font-serif font-bold text-white">
            Schedule a Private Residence Tour
          </h3>
          <p className="text-xs text-slate-300 mt-1 line-clamp-1">
            {property.title} • {formatPrice(property.price)}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {successMessage ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle className="w-9 h-9" />
              </div>
              <h4 className="text-xl font-serif font-bold text-white">Viewing Confirmed</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                {successMessage}
              </p>
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Guest Information */}
              {!isAuthenticated && (
                <div className="space-y-3 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                  <p className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    Guest Visitor Details
                  </p>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Singhania"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-700 bg-slate-900 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="vikram@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-slate-700 bg-slate-900 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Mobile Phone (+91) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98200 12345"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-slate-700 bg-slate-900 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={minDate}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-700 bg-slate-900 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Time Slot *
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-700 bg-slate-900 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none text-white"
                  >
                    <option value="Morning (10:00 AM - 01:00 PM)">Morning (10 AM - 1 PM)</option>
                    <option value="Afternoon (02:00 PM - 05:00 PM)">Afternoon (2 PM - 5 PM)</option>
                    <option value="Evening (05:00 PM - 08:00 PM)">Evening (5 PM - 8 PM)</option>
                  </select>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Specific Requests or Questions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Would like to view parking bay and clubhouse amenities..."
                  className="w-full text-xs p-3 border border-slate-700 bg-slate-900 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none text-white"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Confirming with Concierge...' : 'Confirm Private Tour Booking'}
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-2">
                  Complimentary & verified site visit. Zero broker commission.
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
