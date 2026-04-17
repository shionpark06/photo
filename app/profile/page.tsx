'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import { Calendar, MapPin, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Booking = {
  id: string;
  reference: string;
  plan: string;
  date: string;
  startHour: number;
  location: string;
  rawStatus: string;
  status: string;
  total: number;
  groupSize: number;
  addons: string[];
};

function formatStatus(raw: string): string {
  switch (raw) {
    case 'pending_confirmation':
      return 'Pending';
    case 'confirmed':
      return 'Confirmed';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return raw;
  }
}

function formatHour(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    async function fetchBookings() {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          reference,
          date,
          start_hour,
          status,
          total_price,
          group_size,
          plans(name),
          locations(name),
          booking_addons(addons(name))
        `)
        .eq('tourist_id', user!.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Failed to fetch bookings:', error.message);
        setLoading(false);
        return;
      }

      const mapped: Booking[] = (data ?? []).map((b: Record<string, unknown>) => {
        const plan = b.plans as { name: string } | null;
        const location = b.locations as { name: string } | null;
        const bookingAddons = b.booking_addons as { addons: { name: string } | null }[] | null;
        const addonNames = (bookingAddons ?? []).map((ba) => ba.addons?.name).filter((n): n is string => Boolean(n));

        return {
          id: b.id as string,
          reference: b.reference as string,
          plan: plan?.name ?? '—',
          date: b.date as string,
          startHour: b.start_hour as number,
          location: location?.name ?? '—',
          rawStatus: b.status as string,
          status: formatStatus(b.status as string),
          total: b.total_price as number,
          groupSize: b.group_size as number,
          addons: addonNames,
        };
      });

      setBookings(mapped);
      setLoading(false);
    }

    fetchBookings();
  }, [user]);

  const handleCancel = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to cancel this booking?')) {
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, rawStatus: 'cancelled', status: 'Cancelled' } : b)));
    }
  };

  const handleChangeDate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    alert('Date change request sent to support. We will contact you shortly.');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center pt-24 md:pt-32 px-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-medium tracking-tight text-black">Please log in</h1>
          <p className="text-gray-500 font-medium">You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfcfc] text-black selection:bg-black selection:text-white pt-24 md:pt-32 pb-20 md:pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 md:mb-16">
          <div>
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-1.5 md:mb-2">Profile</h1>
            <p className="text-sm md:text-base text-gray-500 font-medium break-all sm:break-normal">{user.name} ({user.email})</p>
          </div>
          <button
            onClick={signOut}
            className="mobile-touch-target w-full sm:w-auto px-6 border border-black/10 rounded-full text-sm font-medium hover:bg-black/5 transition-colors"
          >
            Log Out
          </button>
        </div>

        <h2 className="text-2xl font-medium tracking-tight mb-6 md:mb-8">Your Bookings</h2>

        {loading ? (
          <div className="text-center py-24 text-gray-400 font-medium">Loading bookings…</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-24 text-gray-400 font-medium">No bookings found.</div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {bookings.map((booking) => {
              const isExpanded = expandedId === booking.id;
              const isCancelled = booking.rawStatus === 'cancelled';

              return (
                <div
                  key={booking.id}
                  onClick={() => setExpandedId(isExpanded ? null : booking.id)}
                  className={`border border-black/10 rounded-2xl bg-white shadow-sm overflow-hidden cursor-pointer transition-colors hover:border-black/20 ${isExpanded ? 'ring-1 ring-black/5' : ''}`}
                >
                  <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 md:gap-3 mb-2.5 md:mb-3 flex-wrap">
                        <h3 className={`font-medium text-lg md:text-xl ${isCancelled ? 'text-gray-400 line-through' : 'text-black'}`}>{booking.plan}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] md:text-xs font-medium border ${
                            booking.rawStatus === 'confirmed'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : booking.rawStatus === 'cancelled'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : booking.rawStatus === 'pending_confirmation'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-gray-50 text-gray-700 border-gray-200'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div className={`grid grid-cols-1 sm:flex sm:flex-wrap items-start sm:items-center gap-2 sm:gap-5 text-[13px] md:text-sm font-medium ${isCancelled ? 'text-gray-400' : 'text-gray-500'}`}>
                        <span className="flex items-center gap-1.5 min-w-0"><Calendar size={15} /> {booking.date} at {formatHour(booking.startHour)}</span>
                        <span className="flex items-center gap-1.5 min-w-0"><MapPin size={15} /> {booking.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 mt-1 md:mt-0">
                      <div className={`text-left md:text-right ${isCancelled ? 'text-gray-400' : ''}`}>
                        <div className="text-xs md:text-sm font-medium mb-0.5 md:mb-1 opacity-70">Ref: {booking.reference}</div>
                        <div className="font-medium text-lg md:text-xl">${booking.total}</div>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-black"
                      >
                        <ChevronDown size={18} />
                      </motion.div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="border-t border-black/5"
                      >
                        <div className="p-4 md:p-6 bg-black/[0.02]">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 md:gap-8 mb-6 md:mb-8">
                            <div>
                              <h4 className="text-[11px] md:text-sm font-bold tracking-wider uppercase text-gray-500 mb-4">Booking Details</h4>
                              <ul className="space-y-3 text-sm font-medium text-black">
                                <li className="flex justify-between gap-4"><span className="text-gray-500">Group Size</span> <span>{booking.groupSize} {booking.groupSize > 1 ? 'People' : 'Person'}</span></li>
                                <li className="flex justify-between gap-4"><span className="text-gray-500">Add-ons</span> <span className="text-right">{booking.addons.length > 0 ? booking.addons.join(', ') : 'None'}</span></li>
                                <li className="flex justify-between gap-4"><span className="text-gray-500">Total Paid</span> <span>${booking.total}</span></li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-[11px] md:text-sm font-bold tracking-wider uppercase text-gray-500 mb-4">Actions</h4>
                              {booking.rawStatus === 'confirmed' ? (
                                <div className="space-y-3">
                                  <button
                                    onClick={(e) => handleChangeDate(booking.id, e)}
                                    className="w-full py-2.5 px-4 bg-white border border-black/10 rounded-xl text-sm font-medium text-black hover:bg-black/5 transition-colors text-left flex items-center justify-between"
                                  >
                                    Change Date & Time
                                    <Calendar size={16} className="text-gray-500" />
                                  </button>
                                  <button
                                    onClick={(e) => handleCancel(booking.id, e)}
                                    className="w-full py-2.5 px-4 bg-red-50 border border-red-100 rounded-xl text-sm font-medium text-red-600 hover:bg-red-100 transition-colors text-left flex items-center justify-between"
                                  >
                                    Cancel Booking
                                    <X size={16} />
                                  </button>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500 font-medium">No actions available for this booking.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
