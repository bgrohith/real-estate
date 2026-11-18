import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Building,
  Calendar,
  User as UserIcon,
  PlusCircle,
  Trash2,
  Edit,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Save,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Property, Appointment } from '../types';
import { formatIndianPrice, formatDate } from '../utils/formatters';

export const DashboardPage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<'listings' | 'my-bookings' | 'received-inquiries' | 'profile'>('listings');

  // Listings state
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  // Appointments state
  const [myBookings, setMyBookings] = useState<Appointment[]>([]);
  const [receivedInquiries, setReceivedInquiries] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  // Profile edit state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch properties and appointments
  const fetchDashboardData = async () => {
    try {
      setLoadingProperties(true);
      setLoadingAppointments(true);

      const [propRes, myApptRes, ownerApptRes] = await Promise.all([
        api.get('/api/properties/user/my-properties'),
        api.get('/api/appointments/my-appointments'),
        api.get('/api/appointments/owner-appointments'),
      ]);

      if (propRes.data.success) {
        setMyProperties(propRes.data.data);
      }
      if (myApptRes.data.success) {
        setMyBookings(myApptRes.data.data);
      }
      if (ownerApptRes.data.success) {
        setReceivedInquiries(ownerApptRes.data.data);
      }
    } catch (err) {
      console.warn('Dashboard data fetch error:', err);
    } finally {
      setLoadingProperties(false);
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Delete property listing
  const handleDeleteProperty = async (propertyId: string) => {
    if (window.confirm('Are you sure you want to delete this property listing? This action cannot be undone.')) {
      try {
        await api.delete(`/api/properties/${propertyId}`);
        setMyProperties(myProperties.filter((p) => p._id !== propertyId));
      } catch (err: any) {
        alert(err.response?.data?.error || 'Failed to delete property listing');
      }
    }
  };

  // Cancel booking
  const handleCancelBooking = async (appointmentId: string) => {
    const reason = prompt('Please provide a reason for cancelling this viewing:');
    if (reason !== null) {
      try {
        const res = await api.put(`/api/appointments/${appointmentId}/cancel`, {
          cancellationReason: reason,
        });
        if (res.data.success) {
          fetchDashboardData();
        }
      } catch (err: any) {
        alert(err.response?.data?.error || 'Failed to cancel appointment');
      }
    }
  };

  // Update appointment status by owner (Confirm / Cancel)
  const handleUpdateStatus = async (appointmentId: string, status: 'Confirmed' | 'Cancelled') => {
    try {
      const res = await api.put(`/api/appointments/${appointmentId}/status`, { status });
      if (res.data.success) {
        fetchDashboardData();
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  // Update profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    const res = await updateProfile({ name, phone, avatar });
    if (res.success) {
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } else {
      setProfileMsg({ type: 'error', text: res.error || 'Failed to update profile' });
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Confirmed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Confirmed
        </span>
      );
    }
    if (status === 'Cancelled') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
          <XCircle className="w-3.5 h-3.5 text-rose-600" /> Cancelled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
        <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Review
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner with User Greeting & Quick Stats */}
      <div className="bg-gradient-to-r from-sapphire-950 via-sapphire-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={user?.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-sapphire-400/40"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold">{user?.name}</h1>
            <p className="text-xs text-slate-300 mt-0.5">{user?.email} • {user?.phone || 'No phone set'}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-sapphire-800/80 border border-sapphire-400/30 text-[11px] font-semibold text-sapphire-200 capitalize">
              Role: {user?.role} Account
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/properties/new"
            className="px-4 py-2.5 bg-white text-sapphire-950 hover:bg-slate-100 font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-sapphire-800" />
            <span>List New Property</span>
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-2 sm:gap-6 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('listings')}
            className={`py-3 px-2 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'listings'
                ? 'border-sapphire-700 text-sapphire-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>My Listings ({myProperties.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('my-bookings')}
            className={`py-3 px-2 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'my-bookings'
                ? 'border-sapphire-700 text-sapphire-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Viewing Appointments ({myBookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('received-inquiries')}
            className={`py-3 px-2 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'received-inquiries'
                ? 'border-sapphire-700 text-sapphire-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Received Viewing Requests ({receivedInquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-2 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-sapphire-700 text-sapphire-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile Settings</span>
          </button>
        </div>
      </div>

      {/* Tab 1: My Listings */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-slate-900">
              Properties Listed by You
            </h3>
            <Link
              to="/properties/new"
              className="text-xs font-semibold text-sapphire-700 hover:text-sapphire-900 flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add New
            </Link>
          </div>

          {loadingProperties ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading listings...</div>
          ) : myProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProperties.map((prop) => (
                <div
                  key={prop._id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] bg-slate-100">
                    <img
                      src={prop.images[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'}
                      alt={prop.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                      <span className="bg-sapphire-900/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        {prop.propertyType}
                      </span>
                      <span className="bg-emerald-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        {prop.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="font-semibold text-sm text-slate-900 line-clamp-1">{prop.title}</h4>
                    <p className="text-xs font-bold text-sapphire-800">{formatIndianPrice(prop.price)}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {prop.location.city} • {prop.area} sq ft
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                    <Link
                      to={`/properties/${prop._id}`}
                      className="text-slate-600 hover:text-sapphire-700 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> View
                    </Link>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/properties/edit/${prop._id}`}
                        className="px-2.5 py-1 text-slate-700 hover:text-sapphire-700 bg-white border border-slate-200 rounded-lg flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" /> Edit
                      </Link>

                      <button
                        onClick={() => handleDeleteProperty(prop._id)}
                        className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
              <Building className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="font-semibold text-slate-800 text-sm">No listings posted yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Ready to showcase your premier property to verified buyers across India?
              </p>
              <Link
                to="/properties/new"
                className="inline-block px-4 py-2 bg-sapphire-700 text-white rounded-lg text-xs font-semibold"
              >
                Create Listing
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Viewing Bookings */}
      {activeTab === 'my-bookings' && (
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-lg text-slate-900">
            Viewings Booked by You
          </h3>

          {loadingAppointments ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading appointments...</div>
          ) : myBookings.length > 0 ? (
            <div className="space-y-3">
              {myBookings.map((appt) => (
                <div
                  key={appt._id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={appt.property?.images?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80'}
                      alt=""
                      className="w-20 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(appt.status)}
                        <span className="text-[11px] text-slate-400">
                          Booked on {formatDate(appt.createdAt)}
                        </span>
                      </div>
                      <Link
                        to={`/properties/${appt.property?._id}`}
                        className="font-semibold text-sm text-slate-900 hover:text-sapphire-700 line-clamp-1"
                      >
                        {appt.property?.title || 'Exclusive Residence'}
                      </Link>
                      <p className="text-xs text-slate-500 flex items-center gap-2">
                        <span>Date: <strong>{formatDate(appt.preferredDate)}</strong></span>
                        <span>•</span>
                        <span>Slot: <strong>{appt.timeSlot}</strong></span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    {appt.status !== 'Cancelled' && (
                      <button
                        onClick={() => handleCancelBooking(appt._id)}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
                      >
                        Cancel Appointment
                      </button>
                    )}
                    <Link
                      to={`/properties/${appt.property?._id}`}
                      className="px-3 py-1.5 text-xs font-semibold text-sapphire-700 hover:bg-sapphire-50 border border-sapphire-200 rounded-lg transition-colors"
                    >
                      View Property
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
              <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="font-semibold text-slate-800 text-sm">No Viewing Appointments</h4>
              <p className="text-xs text-slate-500">
                You haven't booked any property visits yet. Browse our verified luxury listings to schedule a visit.
              </p>
              <Link
                to="/properties"
                className="inline-block px-4 py-2 bg-sapphire-700 text-white rounded-lg text-xs font-semibold"
              >
                Browse Listings
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Received Inquiries / Owner Bookings */}
      {activeTab === 'received-inquiries' && (
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-lg text-slate-900">
            Viewing Requests on Your Properties
          </h3>

          {loadingAppointments ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading requests...</div>
          ) : receivedInquiries.length > 0 ? (
            <div className="space-y-3">
              {receivedInquiries.map((appt) => (
                <div
                  key={appt._id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium">Viewing for:</span>
                      <Link
                        to={`/properties/${appt.property?._id}`}
                        className="font-semibold text-sm text-slate-900 hover:text-sapphire-700 block"
                      >
                        {appt.property?.title}
                      </Link>
                    </div>
                    <div>{getStatusBadge(appt.status)}</div>
                  </div>

                  {/* Visitor Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Visitor Name</span>
                      <p className="font-semibold text-slate-800">{appt.guestInfo?.name || appt.user?.name || 'Visitor'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Phone</span>
                      <p className="font-medium text-slate-700 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-sapphire-600" />
                        {appt.guestInfo?.phone || appt.user?.phone || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Email</span>
                      <p className="font-medium text-slate-700 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-sapphire-600" />
                        {appt.guestInfo?.email || appt.user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                    <p>
                      Requested Slot: <strong>{formatDate(appt.preferredDate)}</strong> ({appt.timeSlot})
                    </p>

                    {/* Owner Action Buttons */}
                    {appt.status === 'Pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateStatus(appt._id, 'Confirmed')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Confirm
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(appt._id, 'Cancelled')}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold rounded-lg text-xs flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
              <LayoutDashboard className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="font-semibold text-slate-800 text-sm">No Viewing Requests Yet</h4>
              <p className="text-xs text-slate-500">
                When buyers or guests book a tour for your listed properties, their contact details and preferred time slots will appear here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="max-w-xl bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-slate-900 pb-2 border-b border-slate-100">
            Account & Profile Settings
          </h3>

          {profileMsg && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                profileMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {profileMsg.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sapphire-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400">Email cannot be modified directly.</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Mobile Phone (+91)</label>
              <input
                type="tel"
                placeholder="+91 98200 12345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sapphire-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Avatar Image URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sapphire-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-5 bg-sapphire-700 hover:bg-sapphire-800 text-white font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
export default DashboardPage;
