import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from '@/features/landing/pages/LandingPage';
import LoginPage from '@/features/landing/pages/LoginPage';
import RegisterPage from '@/features/landing/pages/RegisterPage';

// Dashboard Routes (Admin)
import DashboardLayout from '@/features/dashboard/layouts/DashboardLayout';
import DashboardLogin from '@/features/dashboard/pages/DashboardLogin';
import DashboardHome from '@/features/dashboard/pages/Dashboard';

// Dashboard Section Pages
import TodayRequests from '@/features/dashboard/pages/TodayRequests';
import CompletedRequests from '@/features/dashboard/pages/CompletedRequests';
import ScheduledRequests from '@/features/dashboard/pages/ScheduledRequests';
import DashboardReviews from '@/features/dashboard/pages/Reviews';
import CancellationReasons from '@/features/dashboard/pages/CancellationReasons';

// Map View Pages
import ProvidersMapView from '@/features/dashboard/pages/ProvidersMapView';
import ProviderTracking from '@/features/dashboard/pages/ProviderTracking';
import AllCities from '@/features/dashboard/pages/AllCities';

// Service Providers Pages
import OnlineProviders from '@/features/dashboard/pages/OnlineProviders';
import ApprovedProviders from '@/features/dashboard/pages/ApprovedProviders';
import UnapprovedProviders from '@/features/dashboard/pages/UnapprovedProviders';

// Users Pages
import DashboardUsers from '@/features/dashboard/pages/Users';
import BlockedUsers from '@/features/dashboard/pages/BlockedUsers';

// Single CRUD Pages
import DashboardDispatchers from '@/features/dashboard/pages/Dispatchers';
import DashboardCorporate from '@/features/dashboard/pages/Corporate';
import DashboardHotels from '@/features/dashboard/pages/Hotels';
import DashboardPartners from '@/features/dashboard/pages/Partners';

// Service Types Pages
import ServiceType from '@/features/dashboard/pages/ServiceType';
import ServiceCountry from '@/features/dashboard/pages/ServiceCountry';
import ServiceCity from '@/features/dashboard/pages/ServiceCity';
import ServiceTypeAssociation from '@/features/dashboard/pages/ServiceTypeAssociation';

// Trip Payment Pages
import TripEarnings from '@/features/dashboard/pages/TripEarnings';
import DailyEarning from '@/features/dashboard/pages/DailyEarning';
import WeeklyEarning from '@/features/dashboard/pages/WeeklyEarning';
import PartnerWeeklyPayments from '@/features/dashboard/pages/PartnerWeeklyPayments';
import WalletHistory from '@/features/dashboard/pages/WalletHistory';
import TransactionHistory from '@/features/dashboard/pages/TransactionHistory';

// Report Pages
import UserReferralReport from '@/features/dashboard/pages/UserReferralReport';
import DriverReferralReport from '@/features/dashboard/pages/DriverReferralReport';

// Settings Pages
import SettingsLanguages from '@/features/dashboard/pages/SettingsLanguages';
import SettingsBasic from '@/features/dashboard/pages/Settings';
import SettingsInstallation from '@/features/dashboard/pages/AdminInstallationSettings';
import SettingsPromos from '@/features/dashboard/pages/Promos';
import SettingsDocuments from '@/features/dashboard/pages/Documents';
import SettingsMailTemplate from '@/features/dashboard/pages/SettingsMailTemplate';
import SettingsSMSTemplate from '@/features/dashboard/pages/SettingsSMSTemplate';
import SettingsAdmin from '@/features/dashboard/pages/Admins';
import SettingsTermsPrivacy from '@/features/dashboard/pages/TermsAndPrivacySettings';

// Send Mass Notification
import SendMassNotification from '@/features/dashboard/pages/SendMassNotification';

// User Routes
import UserLayout from '@/features/user/layouts/UserLayout';
import UserDashboard from '@/features/user/pages/Dashboard';
import UserBookRide from '@/features/user/pages/BookRide';
import UserTrips from '@/features/user/pages/Trips';
import UserPayment from '@/features/user/pages/Payment';
import UserProfile from '@/features/user/pages/Profile';
import UserSupport from '@/features/user/pages/Support';

// Driver Routes
import DriverLayout from '@/features/driver/layouts/DriverLayout';
import DriverDashboard from '@/features/driver/pages/Dashboard';

// Partner Routes
import PartnerLayout from '@/features/partner/layouts/PartnerLayout';
import PartnerDashboard from '@/features/partner/pages/Dashboard';

// Corporate Routes
import CorporateLayout from '@/features/corporate/layouts/CorporateLayout';
import CorporateDashboard from '@/features/corporate/pages/Dashboard';

// Dispatcher Routes
import DispatcherLayout from '@/features/dispatcher/layouts/DispatcherLayout';
import DispatcherDashboard from '@/features/dispatcher/pages/Dashboard';

// Hotel Routes
import HotelLayout from '@/features/hotel/layouts/HotelLayout';
import HotelDashboard from '@/features/hotel/pages/Dashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  
  // Admin Routes (Super Admin Dashboard)
  {
    path: '/admin',
    element: <DashboardLogin />,
  },
  {
    path: '/admin/dashboard',
    element: <DashboardLayout />,
    children: [
      // Dashboard Section
      { index: true, element: <DashboardHome /> },
      { path: 'today-requests', element: <TodayRequests /> },
      { path: 'completed-requests', element: <CompletedRequests /> },
      { path: 'scheduled-requests', element: <ScheduledRequests /> },
      { path: 'reviews', element: <DashboardReviews /> },
      { path: 'cancellation-reasons', element: <CancellationReasons /> },

      // Map View Section
      { path: 'map/providers', element: <ProvidersMapView /> },
      { path: 'map/tracking', element: <ProviderTracking /> },
      { path: 'map/cities', element: <AllCities /> },

      // Service Providers Section
      { path: 'providers/online', element: <OnlineProviders /> },
      { path: 'providers/approved', element: <ApprovedProviders /> },
      { path: 'providers/unapproved', element: <UnapprovedProviders /> },

      // Users Section
      { path: 'users', element: <DashboardUsers /> },
      { path: 'users/blocked', element: <BlockedUsers /> },

      // Single CRUD Pages
      { path: 'dispatchers', element: <DashboardDispatchers /> },
      { path: 'corporate', element: <DashboardCorporate /> },
      { path: 'hotels', element: <DashboardHotels /> },
      { path: 'partners', element: <DashboardPartners /> },

      // Service Types Section
      { path: 'service-types', element: <ServiceType /> },
      { path: 'service-types/country', element: <ServiceCountry /> },
      { path: 'service-types/city', element: <ServiceCity /> },
      { path: 'service-types/association', element: <ServiceTypeAssociation /> },

      // Trip Payment Section
      { path: 'trip-payment/earnings', element: <TripEarnings /> },
      { path: 'trip-payment/daily', element: <DailyEarning /> },
      { path: 'trip-payment/weekly', element: <WeeklyEarning /> },
      { path: 'trip-payment/partner-weekly', element: <PartnerWeeklyPayments /> },
      { path: 'trip-payment/wallet', element: <WalletHistory /> },
      { path: 'trip-payment/transactions', element: <TransactionHistory /> },

      // Report Section
      { path: 'report/user-referral', element: <UserReferralReport /> },
      { path: 'report/driver-referral', element: <DriverReferralReport /> },

      // Settings Section
      { path: 'settings/languages', element: <SettingsLanguages /> },
      { path: 'settings', element: <SettingsBasic /> },
      { path: 'settings/installation', element: <SettingsInstallation /> },
      { path: 'settings/promos', element: <SettingsPromos /> },
      { path: 'settings/documents', element: <SettingsDocuments /> },
      { path: 'settings/mail-template', element: <SettingsMailTemplate /> },
      { path: 'settings/sms-template', element: <SettingsSMSTemplate /> },
      { path: 'settings/admin', element: <SettingsAdmin /> },
      { path: 'settings/terms-privacy', element: <SettingsTermsPrivacy /> },

      // Send Mass Notification
      { path: 'send-notification', element: <SendMassNotification /> },
    ],
  },
  
  // User Routes
  {
    path: '/user',
    element: <UserLayout />,
    children: [
      { index: true, element: <UserDashboard /> },
      { path: 'book', element: <UserBookRide /> },
      { path: 'trips', element: <UserTrips /> },
      { path: 'payment', element: <UserPayment /> },
      { path: 'profile', element: <UserProfile /> },
      { path: 'support', element: <UserSupport /> },
    ],
  },
  
  // Driver Routes
  {
    path: '/driver',
    element: <DriverLayout />,
    children: [
      { index: true, element: <DriverDashboard /> },
    ],
  },
  
  // Partner Routes
  {
    path: '/partner',
    element: <PartnerLayout />,
    children: [
      { index: true, element: <PartnerDashboard /> },
    ],
  },
  
  // Corporate Routes
  {
    path: '/corporate',
    element: <CorporateLayout />,
    children: [
      { index: true, element: <CorporateDashboard /> },
    ],
  },
  
  // Dispatcher Routes
  {
    path: '/dispatcher',
    element: <DispatcherLayout />,
    children: [
      { index: true, element: <DispatcherDashboard /> },
    ],
  },
  
  // Hotel Routes
  {
    path: '/hotel',
    element: <HotelLayout />,
    children: [
      { index: true, element: <HotelDashboard /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
