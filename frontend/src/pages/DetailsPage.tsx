import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { Experience, Slot } from '../types';
import Header from '../components/Header';

interface DetailsPageProps {
  experienceId: string;
  onNavigate: (page: string, data?: any) => void;
}

export default function DetailsPage({ experienceId, onNavigate }: DetailsPageProps) {
  const [experience, setExperience] = useState<Experience | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperienceDetails();
  }, [experienceId]);

  const fetchExperienceDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/experiences/${experienceId}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setExperience(data);
      setSlots(data.slots || []);

      if (data.slots && data.slots.length > 0) {
        setSelectedDate(data.slots[0].date);
      }
    } catch (error) {
      console.error('Error fetching experience details:', error);
    } finally {
      setLoading(false);
    }
  };

  const availableDates = Array.from(new Set(slots.map((slot) => slot.date))).sort();
  const availableTimes = slots.filter((slot) => slot.date === selectedDate);

  useEffect(() => {
    if (selectedDate && selectedTime) {
      const slot = slots.find((s) => s.date === selectedDate && s.time === selectedTime);
      setSelectedSlot(slot || null);
    }
  }, [selectedDate, selectedTime, slots]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    return { month, day };
  };

  const subtotal = (experience?.price || 0) * quantity;
  const taxes = Math.round(subtotal * 0.06);
  const total = subtotal + taxes;

  const handleConfirm = () => {
    if (!selectedSlot || !experience) return;

    onNavigate('checkout', {
      experienceId: experience.id,
      experienceName: experience.name,
      slotId: selectedSlot.id,
      date: selectedDate,
      time: selectedTime,
      quantity,
      price: experience.price,
    });
  };

  const isSlotAvailable = (slot: Slot) => slot.booked < slot.capacity;
  const isSlotSoldOut = (slot: Slot) => slot.booked >= slot.capacity;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-500">Experience not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Details</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={experience.image_url}
                  alt={experience.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <h1 className="text-2xl font-semibold mb-2">{experience.name}</h1>
                <p className="text-gray-600 mb-6">{experience.description}</p>

                <div className="mb-6">
                  <h2 className="font-semibold mb-3">Choose date</h2>
                  <div className="flex gap-2 flex-wrap">
                    {availableDates.map((date) => {
                      const { month, day } = formatDate(date);
                      return (
                        <button
                          key={date}
                          onClick={() => {
                            setSelectedDate(date);
                            setSelectedTime('');
                          }}
                          className={`px-4 py-3 border rounded text-center min-w-[80px] transition-colors ${
                            selectedDate === date
                              ? 'bg-yellow-400 border-yellow-400 font-medium'
                              : 'bg-white border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="text-xs">{month} {day}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="font-semibold mb-3">Choose time</h2>
                  <div className="flex gap-2 flex-wrap">
                    {availableTimes.map((slot) => {
                      const available = isSlotAvailable(slot);
                      const soldOut = isSlotSoldOut(slot);
                      const availableSpots = slot.capacity - slot.booked;

                      return (
                        <button
                          key={slot.id}
                          onClick={() => available && setSelectedTime(slot.time)}
                          disabled={!available}
                          className={`px-4 py-2 border rounded text-sm transition-colors disabled:cursor-not-allowed ${
                            selectedTime === slot.time
                              ? 'bg-yellow-400 border-yellow-400 font-medium'
                              : available
                              ? 'bg-white border-gray-300 hover:border-gray-400'
                              : 'bg-gray-100 border-gray-200 text-gray-400'
                          }`}
                        >
                          <div>{slot.time}</div>
                          {soldOut ? (
                            <div className="text-xs text-red-500 font-medium">Sold out</div>
                          ) : (
                            <div className="text-xs text-gray-500">{availableSpots} left</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    All times are in IST (GMT +5:30)
                  </p>
                </div>

                <div>
                  <h2 className="font-semibold mb-2">About</h2>
                  <p className="text-sm text-gray-600">{experience.about}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Starts at</span>
                  <span className="font-semibold">₹{experience.price}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                      -
                    </button>
                    <span className="font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mb-4">
                    <span className="text-gray-600">Taxes</span>
                    <span>₹{taxes}</span>
                  </div>
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <button
                  onClick={handleConfirm}
                  disabled={!selectedSlot}
                  className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed rounded font-medium transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}