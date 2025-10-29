import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { BookingFormData } from '../types';
import Header from '../components/Header';

interface CheckoutPageProps {
  bookingData: BookingFormData;
  onNavigate: (page: string, data?: any) => void;
}

export default function CheckoutPage({ bookingData, onNavigate }: CheckoutPageProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [formError, setFormError] = useState('');

  const subtotal = bookingData.price * bookingData.quantity;
  const taxes = Math.round((subtotal - discount) * 0.06);
  const total = subtotal - discount + taxes;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    setPromoError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/promo/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode, subtotal }),
      });
      const result = await response.json();
      if (!response.ok || !result.valid) {
        setPromoError('Invalid promo code');
        setDiscount(0);
        return;
      }
      setDiscount(result.discount);
    } catch (error) {
      setPromoError('Error validating promo code');
      setDiscount(0);
    }
  };

  const handlePayAndConfirm = async () => {
    setFormError('');

    if (!fullName.trim()) {
      setFormError('Please enter your full name');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid email address');
      return;
    }

    if (!termsAccepted) {
      setFormError('Please accept the terms and safety policy');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experience_id: bookingData.experienceId,
          slot_id: bookingData.slotId,
          full_name: fullName,
          email,
          quantity: bookingData.quantity,
          subtotal,
          taxes,
          total,
          promo_code: promoCode || null,
          discount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Booking failed');
      }

      const result = await response.json();
      onNavigate('confirmation', { bookingRef: result.booking_ref });
    } catch (error) {
      console.error('Booking error:', error);
      setFormError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => onNavigate('details', { experienceId: bookingData.experienceId })}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Checkout</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value.toUpperCase());
                      setPromoError('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors font-medium"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="text-sm text-red-500 mt-1">{promoError}</p>
                )}
                {discount > 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    Promo code applied! You saved ₹{discount}
                  </p>
                )}
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the terms and safety policy
                </label>
              </div>

              {formError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-600">{formError}</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium">{bookingData.experienceName}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">{formatDate(bookingData.date)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium">{bookingData.time}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Qty</span>
                  <span className="font-medium">{bookingData.quantity}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center text-sm text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="text-gray-600">Taxes</span>
                  <span>₹{taxes}</span>
                </div>
                <div className="flex justify-between items-center font-semibold text-lg pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                onClick={handlePayAndConfirm}
                disabled={loading}
                className="w-full mt-6 py-3 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed rounded font-medium transition-colors"
              >
                {loading ? 'Processing...' : 'Pay and Confirm'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}