import { CheckCircle } from 'lucide-react';
import Header from '../components/Header';

interface ConfirmationPageProps {
  bookingRef: string;
  onNavigate: (page: string) => void;
}

export default function ConfirmationPage({ bookingRef, onNavigate }: ConfirmationPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-semibold mb-2">Booking Confirmed</h1>

          <p className="text-gray-600 mb-8">
            Ref ID: <span className="font-medium">{bookingRef}</span>
          </p>

          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded font-medium transition-colors"
          >
            Back to Home
          </button>
        </div>
      </main>
    </div>
  );
}
