import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  HomeIcon,
  MapIcon,
  TruckIcon,
  UsersIcon,
  UserIcon,
  BuildingOfficeIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  BellIcon,
  Bars3Icon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { Breadcrumbs } from '@/components/ui';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('🔍 DashboardLayout: Checking authentication...');
    const token = localStorage.getItem('token');
    console.log('🎫 Token found:', token ? 'YES' : 'NO');
    console.log('📍 Current path:', location.pathname);
    
    if (!token) {
      console.warn('⚠️ No token found, redirecting to /admin');
      navigate('/admin', { replace: true });
    } else {
      console.log('✅ Token found, staying on dashboard');
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin');
  };

  const toggleMenu = (menuId) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const menuItems = [
    {
      id: 'dashboard',
      icon: HomeIcon,
      label: 'Dashboard',
      submenu: [
        { label: 'Dashboard', path: '/admin/dashboard' },
        { label: "Today's Requests", path: '/admin/dashboard/today-requests' },
        { label: 'Completed Requests', path: '/admin/dashboard/completed-requests' },
        { label: 'Scheduled Requests', path: '/admin/dashboard/scheduled-requests' },
        { label: 'Reviews', path: '/admin/dashboard/reviews' },
        { label: 'Cancellation Reason', path: '/admin/dashboard/cancellation-reasons' },
      ]
    },
    {
      id: 'map',
      icon: MapIcon,
      label: 'Map View',
      submenu: [
        { label: 'Providers Map View', path: '/admin/dashboard/map/providers' },
        { label: 'Provider Tracking', path: '/admin/dashboard/map/tracking' },
        { label: 'All Cities', path: '/admin/dashboard/map/cities' },
      ]
    },
    {
      id: 'providers',
      icon: TruckIcon,
      label: 'Service Providers',
      submenu: [
        { label: 'Online Providers', path: '/admin/dashboard/providers/online' },
        { label: 'Approved Providers', path: '/admin/dashboard/providers/approved' },
        { label: 'Unapproved Providers', path: '/admin/dashboard/providers/unapproved' },
      ]
    },
    {
      id: 'users',
      icon: UsersIcon,
      label: 'Users',
      submenu: [
        { label: 'Users', path: '/admin/dashboard/users' },
        { label: 'Blocked Users', path: '/admin/dashboard/users/blocked' },
      ]
    },
    {
      id: 'dispatchers',
      icon: UserIcon,
      label: 'Dispatchers',
      path: '/admin/dashboard/dispatchers'
    },
    {
      id: 'corporate',
      icon: BuildingOfficeIcon,
      label: 'Corporate',
      path: '/admin/dashboard/corporate'
    },
    {
      id: 'hotels',
      icon: BuildingOfficeIcon,
      label: 'Hotels',
      path: '/admin/dashboard/hotels'
    },
    {
      id: 'partners',
      icon: UserIcon,
      label: 'Partners',
      path: '/admin/dashboard/partners'
    },
    {
      id: 'service-types',
      icon: Cog6ToothIcon,
      label: 'Service Types',
      submenu: [
        { label: 'Type', path: '/admin/dashboard/service-types' },
        { label: 'Country', path: '/admin/dashboard/service-types/country' },
        { label: 'City', path: '/admin/dashboard/service-types/city' },
        { label: 'Type And City Association', path: '/admin/dashboard/service-types/association' },
      ]
    },
    {
      id: 'trip-payment',
      icon: CurrencyDollarIcon,
      label: 'Trip Payment',
      submenu: [
        { label: 'Trip Earnings', path: '/admin/dashboard/trip-payment/earnings' },
        { label: 'Daily Earning', path: '/admin/dashboard/trip-payment/daily' },
        { label: 'Weekly Earning', path: '/admin/dashboard/trip-payment/weekly' },
        { label: 'Partner Weekly Payments', path: '/admin/dashboard/trip-payment/partner-weekly' },
        { label: 'Wallet History', path: '/admin/dashboard/trip-payment/wallet' },
        { label: 'Transaction History', path: '/admin/dashboard/trip-payment/transactions' },
      ]
    },
    {
      id: 'report',
      icon: DocumentTextIcon,
      label: 'Report',
      submenu: [
        { label: 'User Referral Report', path: '/admin/dashboard/report/user-referral' },
        { label: 'Driver Referral Report', path: '/admin/dashboard/report/driver-referral' },
      ]
    },
    {
      id: 'settings',
      icon: Cog6ToothIcon,
      label: 'Settings',
      submenu: [
        { label: 'Languages', path: '/admin/dashboard/settings/languages' },
        { label: 'Basic Settings', path: '/admin/dashboard/settings' },
        { label: 'Installation Settings', path: '/admin/dashboard/settings/installation' },
        { label: 'Promo Codes', path: '/admin/dashboard/settings/promos' },
        { label: 'Documents', path: '/admin/dashboard/settings/documents' },
        { label: 'Mail Template', path: '/admin/dashboard/settings/mail-template' },
        { label: 'SMS Template', path: '/admin/dashboard/settings/sms-template' },
        { label: 'Admin Settings', path: '/admin/dashboard/settings/admin' },
        { label: 'Terms And Privacy', path: '/admin/dashboard/settings/terms-privacy' },
      ]
    },
    {
      id: 'notification',
      icon: BellIcon,
      label: 'Send Mass Notification',
      path: '/admin/dashboard/send-notification'
    },
  ];

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const hasActiveSubmenu = (submenu) => {
    return submenu?.some(item => location.pathname === item.path);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'w-64' : 'w-0'
          } bg-gray-900 text-white transition-all duration-300 overflow-y-auto flex-shrink-0`}
        >
          <div className="p-4">
            <div className="flex items-center justify-center mb-8">
              <h1 className="text-2xl font-bold text-joltcab-500">JoltCab</h1>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => (
                <div key={item.id}>
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() => toggleMenu(item.id)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                          hasActiveSubmenu(item.submenu)
                            ? 'bg-joltcab-600 text-white'
                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </div>
                        <ChevronDownIcon
                          className={`w-4 h-4 transition-transform ${
                            openMenus[item.id] ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {openMenus[item.id] && (
                        <div className="mt-1 ml-4 space-y-1">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                                isActiveLink(subItem.path)
                                  ? 'bg-joltcab-600 text-white'
                                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                              }`}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                        isActiveLink(item.path)
                          ? 'bg-joltcab-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`${
            isSidebarOpen ? 'ml-0' : 'ml-0'
          } flex-1 transition-all duration-300 overflow-y-auto`}
        >
          {/* Top Bar */}
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
            <div className="flex items-center justify-between px-6 py-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Bars3Icon className="w-6 h-6 text-gray-600" />
              </button>

              <div className="flex items-center gap-4">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                  <BellIcon className="w-6 h-6 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          <div className="p-6">
            <Breadcrumbs />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
