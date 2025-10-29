import { useState } from 'react';
import HomePage from './pages/HomePage';
import DetailsPage from './pages/DetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import type { BookingFormData } from './types';

type Page = 'home' | 'details' | 'checkout' | 'confirmation';

interface NavigationState {
  page: Page;
  data?: any;
}

function App() {
  const [navigation, setNavigation] = useState<NavigationState>({
    page: 'home',
  });

  const handleNavigate = (page: string, data?: any) => {
    setNavigation({ page: page as Page, data });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (navigation.page) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;

      case 'details':
        return (
          <DetailsPage
            experienceId={navigation.data?.experienceId}
            onNavigate={handleNavigate}
          />
        );

      case 'checkout':
        return (
          <CheckoutPage
            bookingData={navigation.data as BookingFormData}
            onNavigate={handleNavigate}
          />
        );

      case 'confirmation':
        return (
          <ConfirmationPage
            bookingRef={navigation.data?.bookingRef}
            onNavigate={handleNavigate}
          />
        );

      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return <>{renderPage()}</>;
}

export default App;
