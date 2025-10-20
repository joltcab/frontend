import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

const routeNames = {
  'admin': 'Admin',
  'dashboard': 'Dashboard',
  'users': 'Customers',
  'drivers': 'Providers',
  'pending': 'Pending Approval',
  'trips': 'Trips',
  'schedules': 'Scheduled Trips',
  'maps': 'Live Maps',
  'earnings': 'Earnings',
  'daily': 'Daily Earnings',
  'provider-weekly': 'Weekly Earnings',
  'provider': 'Provider Earnings',
  'report': 'Report',
  'transactions': 'Transactions',
  'payments': 'Payments',
  'promos': 'Promo Codes',
  'promo-usage': 'Promo Usage',
  'reviews': 'Reviews',
  'service-types': 'Service Types',
  'cities': 'Cities',
  'corporate': 'Corporate',
  'partners': 'Partners',
  'hotels': 'Hotels',
  'dispatchers': 'Dispatchers',
  'support': 'Support',
  'notifications': 'Notifications',
  'send': 'Send',
  'sms': 'SMS',
  'referrals': 'Referrals',
  'history': 'History',
  'admins': 'Admins',
  'settings': 'Settings',
  'installation': 'Installation',
  'terms-privacy': 'Terms & Privacy',
  'cancelation-reasons': 'Cancelation Reasons',
  'user-documents': 'User Documents',
  'wallet-history': 'Wallet History',
  'chat-history': 'Chat History',
  'provider-documents': 'Provider Documents',
  'provider-vehicles': 'Provider Vehicles',
  'vehicle-documents': 'Vehicle Documents',
  'provider-bank-details': 'Bank Details',
  'provider-tracking': 'Live Tracking',
  'provider-referrals': 'Provider Referrals',
  'add': 'Add New',
  'edit': 'Edit',
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't show breadcrumbs on the dashboard home
  if (pathnames.length <= 2 && pathnames[pathnames.length - 1] === 'dashboard') {
    return null;
  }

  const breadcrumbs = [];
  let currentPath = '';

  pathnames.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const name = routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    const isLast = index === pathnames.length - 1;

    breadcrumbs.push({
      name,
      path: currentPath,
      isLast,
    });
  });

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
      <Link
        to="/admin/dashboard"
        className="flex items-center hover:text-joltcab-600 transition-colors"
      >
        <HomeIcon className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>

      {breadcrumbs.map((crumb, index) => {
        // Skip admin and dashboard in breadcrumbs display
        if (crumb.name === 'Admin' || crumb.name === 'Dashboard') {
          return null;
        }

        return (
          <div key={crumb.path} className="flex items-center space-x-2">
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            {crumb.isLast ? (
              <span className="font-medium text-gray-900" aria-current="page">
                {crumb.name}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="hover:text-joltcab-600 transition-colors"
              >
                {crumb.name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
