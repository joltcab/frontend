
import React, { useState, useEffect } from "react";
import { joltcab } from "@/lib/joltcab-api";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users, Car, Settings, MapPin, DollarSign,
  Clock, CheckCircle, XCircle, Calendar,
  Menu, X, BarChart3, FileText, Palette,
  Globe, Bell, Briefcase, Hotel, Radio,
  Moon, Sun, LogOut, User, TrendingUp,
  ChevronLeft, ChevronRight, Download // Added Download icon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import UserManagement from "../components/admin/UserManagement";
import ServiceProviders from "../components/admin/ServiceProviders";
import TripManagement from "../components/admin/TripManagement";
import FinancialOverview from "../components/admin/FinancialOverview";
import BasicSettings from "../components/admin/BasicSettings";
import ServiceTypes from "../components/admin/ServiceTypes";
import CountryManagement from "../components/admin/CountryManagement";
import CityManagement from "../components/admin/CityManagement";
import TypeCityAssociation from "../components/admin/TypeCityAssociation";
import PromoCodes from "../components/admin/PromoCodes";
import IntegrationSettings from "../components/admin/IntegrationSettings";
import ContentManagement from "../components/admin/ContentManagement";
import AppearanceManager from "../components/admin/AppearanceManager";
import DispatchersManagement from "../components/admin/DispatchersManagement";
import CorporateManagement from "../components/admin/CorporateManagement";
import HotelsManagement from "../components/admin/HotelsManagement";
import MapView from "../components/admin/MapView";
import AdminProfile from "../components/admin/AdminProfile";
import RoleManagement from "../components/admin/RoleManagement";
import AdminManagement from "../components/admin/AdminManagement";
import AdvancedAnalytics from "../components/admin/AdvancedAnalytics";
import BackendDiagnostic from "../components/admin/BackendDiagnostic"; // New import

const createPageUrl = (pageName) => {
  if (pageName === "Home") {
    return "/";
  }
  // This will handle "MigrationHub" correctly to "/migrationhub"
  // And "RepositoryReadme" to "/repositoryreadme"
  return `/${pageName.toLowerCase()}`;
};

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [serviceTypesMenuOpen, setServiceTypesMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    todayRequests: 0,
    completedRequests: 0,
    scheduledRequests: 0,
    cancelledRequests: 0,
    totalUsers: 0,
    totalDrivers: 0,
    onlineDrivers: 0,
    todayRevenue: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
    
    const savedCollapsed = localStorage.getItem('adminSidebarCollapsed') === 'true';
    setSidebarCollapsed(savedCollapsed);

    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('adminDarkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const serviceSubmenuIds = ['services', 'countries', 'cities', 'association'];
    if (serviceSubmenuIds.includes(activeSection)) {
      setServiceTypesMenuOpen(true);
    }
  }, [activeSection]);

  const loadUser = async () => {
    try {
      console.log('🔍 Loading admin user...');
      
      // PRIMERO: Verificar si hay admin logueado con Google en localStorage
      const adminData = localStorage.getItem('joltcab_admin');
      if (adminData) {
        const admin = JSON.parse(adminData);
        console.log('✅ Admin logged in via Google:', admin.email);
        
        // Verificar que realmente es admin (type 0 o 1)
        if (admin.type === 0 || admin.type === 1) {
          // IMPORTANTE: Autenticar también en joltcab.auth
          try {
            // Intentar obtener el usuario de joltcab
            const joltcabUser = await joltcab.auth.me();
            console.log('✅ joltcab.auth user already exists/authenticated:', joltcabUser);
            
            setUser({
              email: admin.email,
              full_name: admin.first_name + ' ' + admin.last_name,
              role: 'admin',
              profile_image: admin.avatar
            });
          } catch (authError) {
            // Si no está autenticado en joltcab, crear/sincronizar usuario admin
            console.log('⚠️ Not authenticated in joltcab.auth, syncing admin user...', authError);
            
            try {
              // TODO: Implementar sincronización de admin
              console.log('Sync admin not implemented yet');
              console.log('✅ Admin synced successfully with joltcab.auth.');
            } catch (syncError) {
              console.error('❌ Error syncing admin:', syncError);
            }
            
            // Establecer usuario de todas formas para la UI, ya que está logueado con Google
            setUser({
              email: admin.email,
              full_name: admin.first_name + ' ' + admin.last_name,
              role: 'admin',
              profile_image: admin.avatar
            });
          }
          
          setLoading(false);
          return;
        }
      }

      // SEGUNDO: Verificar si hay usuario logueado con joltcab.auth
      const userData = await joltcab.auth.me();
      console.log('👤 JoltCab user:', userData);
      
      if (userData.role !== 'admin') {
        console.warn('❌ User is not admin, redirecting to Home');
        window.location.href = createPageUrl("Home");
        return;
      }
      
      setUser(userData);
      setLoading(false);
      
    } catch (error) {
      console.error("❌ Error loading user:", error);
      
      // Verificar una última vez el localStorage antes de redirigir
      const adminData = localStorage.getItem('joltcab_admin');
      if (adminData) {
        const admin = JSON.parse(adminData);
        if (admin.type === 0 || admin.type === 1) {
          setUser({
            email: admin.email,
            full_name: admin.first_name + ' ' + admin.last_name,
            role: 'admin',
            profile_image: admin.avatar
          });
          setLoading(false);
          return;
        }
      }
      
      // No hay admin logueado de ninguna forma
      console.warn('❌ No admin logged in, redirecting to Admin login');
      window.location.href = createPageUrl("Admin");
    }
  };

  const loadStats = async () => {
    try {
      // Verificar que el usuario esté cargado primero
      if (!user) {
        console.log('⏳ User not loaded yet, skipping stats');
        return;
      }

      const [rides, users, drivers] = await Promise.all([
        joltcab.entities.Ride.list(),
        joltcab.entities.User.filter({ role: 'user' }),
        joltcab.entities.DriverProfile.list()
      ]);

      const today = new Date().toISOString().split('T')[0];
      const todayRides = rides.filter(r => r.created_date?.startsWith(today));
      const completed = rides.filter(r => r.status === 'completed');
      const scheduled = rides.filter(r => r.status === 'requested' && r.scheduled_date);
      const cancelled = rides.filter(r => r.status === 'cancelled');
      const online = drivers.filter(d => d.is_online);

      const todayRevenue = todayRides
        .filter(r => r.status === 'completed')
        .reduce((sum, r) => sum + (r.agreed_price || 0), 0);

      const totalRevenue = completed.reduce((sum, r) => sum + (r.agreed_price || 0), 0);

      setStats({
        todayRequests: todayRides.length,
        completedRequests: completed.length,
        scheduledRequests: scheduled.length,
        cancelledRequests: cancelled.length,
        totalUsers: users.length,
        totalDrivers: drivers.length,
        onlineDrivers: online.length,
        todayRevenue: todayRevenue,
        totalRevenue: totalRevenue
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  // Call loadStats when user is loaded
  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('adminDarkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleSidebarCollapse = () => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsed);
    localStorage.setItem('adminSidebarCollapsed', newCollapsed.toString());
  };

  const handleLogout = async () => {
    try {
      // Limpiar localStorage (para Google login)
      localStorage.removeItem('joltcab_admin');
      localStorage.removeItem('joltcab_admin_token');
      
      // Logout de joltcab.auth también
      await joltcab.auth.logout();
      
    } catch (error) {
      console.error("Error logging out:", error);
      // Aún así limpiar localStorage
      localStorage.removeItem('joltcab_admin');
      localStorage.removeItem('joltcab_admin_token');
    } finally {
      window.location.href = createPageUrl("Admin");
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'diagnostic', label: 'Backend Diagnostic', icon: Settings }, // New menu item
    { id: 'analytics', label: 'Advanced Analytics', icon: TrendingUp },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'drivers', label: 'Drivers', icon: Car },
    { id: 'trips', label: 'Trips', icon: MapPin },
    { id: 'map', label: 'Live Map', icon: Globe },
    { id: 'financials', label: 'Financials', icon: DollarSign },
    {
      id: 'service-types-menu',
      label: 'Service & Pricing',
      icon: Car,
      isSubmenu: true,
      submenuItems: [
        { id: 'services', label: 'Service Types' },
        { id: 'countries', label: 'Countries' },
        { id: 'cities', label: 'Cities' },
        { id: 'association', label: 'Type-City Association' }
      ]
    },
    { id: 'promos', label: 'Promo Codes', icon: DollarSign },
    { id: 'dispatchers', label: 'Dispatchers', icon: Radio },
    { id: 'corporate', label: 'Corporate', icon: Briefcase },
    { id: 'hotels', label: 'Hotels', icon: Hotel },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Settings },
    { id: 'roles', label: 'Roles & Permissions', icon: Users },
    { id: 'admins', label: 'Admin Users', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="w-8 h-8 opacity-80" />
                    <span className="text-3xl font-bold">{stats.todayRequests}</span>
                  </div>
                  <p className="text-sm opacity-90">Today's Requests</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <CheckCircle className="w-8 h-8 opacity-80" />
                    <span className="text-3xl font-bold">{stats.completedRequests}</span>
                  </div>
                  <p className="text-sm opacity-90">Completed</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Calendar className="w-8 h-8 opacity-80" />
                    <span className="text-3xl font-bold">{stats.scheduledRequests}</span>
                  </div>
                  <p className="text-sm opacity-90">Scheduled</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <XCircle className="w-8 h-8 opacity-80" />
                    <span className="text-3xl font-bold">{stats.cancelledRequests}</span>
                  </div>
                  <p className="text-sm opacity-90">Cancelled</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Users</p>
                    </div>
                    <Users className="w-12 h-12 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalDrivers}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Drivers</p>
                    </div>
                    <Car className="w-12 h-12 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.onlineDrivers}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Online Now</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-6 rounded-xl">
                    <p className="text-sm text-green-700 dark:text-green-300 mb-2">Today's Revenue</p>
                    <p className="text-4xl font-bold text-green-900 dark:text-white">${stats.todayRevenue.toFixed(2)}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-6 rounded-xl">
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">Total Revenue</p>
                    <p className="text-4xl font-bold text-blue-900 dark:text-white">${stats.totalRevenue.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'diagnostic': // New case for Backend Diagnostic
        return <BackendDiagnostic />;
      case 'analytics':
        return <AdvancedAnalytics />;
      case 'profile':
        return <AdminProfile user={user} onUpdate={loadUser} />;
      case 'users':
        return <UserManagement />;
      case 'drivers':
        return <ServiceProviders />;
      case 'trips':
        return <TripManagement />;
      case 'map':
        return <MapView />;
      case 'financials':
        return <FinancialOverview />;
      case 'services':
        return <ServiceTypes />;
      case 'countries':
        return <CountryManagement />;
      case 'cities':
        return <CityManagement />;
      case 'association':
        return <TypeCityAssociation />;
      case 'promos':
        return <PromoCodes />;
      case 'dispatchers':
        return <DispatchersManagement />;
      case 'corporate':
        return <CorporateManagement />;
      case 'hotels':
        return <HotelsManagement />;
      case 'content':
        return <ContentManagement />;
      case 'appearance':
        return <AppearanceManager />;
      case 'integrations':
        return <IntegrationSettings />;
      case 'roles':
        return <RoleManagement />;
      case 'admins':
        return <AdminManagement />;
      case 'settings':
        return <BasicSettings />;
      default:
        return <div className="text-gray-900 dark:text-white">Select a section</div>;
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-[#15B46A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // --- Start of new/modified return structure based on outline ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left side of new header: Sidebar toggle, Logo, Title */}
            <div className="flex items-center gap-4">
              {/* Re-integrate sidebar toggle button here, visible on mobile */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors lg:hidden"
                title={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                )}
              </button>
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f7eae9d9887c2ac98e6d49/870b77da8_LogoAppjolt26.png"
                alt="JoltCab"
                className="h-12 w-12 rounded-xl shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
                  <a 
                    href="https://ihostcast.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 dark:text-gray-500 font-medium hover:text-[#15B46A] dark:hover:text-[#15B46A] transition-colors"
                  >
                    by iHOSTcast
                  </a>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">JoltCab Management System</p>
              </div>
            </div>
            
            {/* Right side of new header: Download, Dark Mode, Bell, User Info/Logout */}
            <div className="flex items-center gap-3">
              {/* NUEVO: Botón para acceder a Repository Readme */}
              <Button
                variant="outline"
                onClick={() => window.location.href = createPageUrl("RepositoryReadme")}
                className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Repository
              </Button>

              {/* Re-integrate existing Dark Mode Toggle and Notification Bell (hidden on small screens to save space) */}
              <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors hidden md:block"
                title={darkMode ? "Light Mode" : "Dark Mode"}
              >
                {darkMode ? <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
              </button>
              <button 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative hidden md:block"
                title="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* OUTLINE'S USER INFO BLOCK (modified to use 'user' state) */}
              {user && (
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.full_name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{user.admin_role || user.role}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ORIGINAL LAYOUT CONTENT - ADAPTED TO SIT BELOW THE NEW HEADER */}
      <div className={`flex h-[calc(100vh-80px)] ${darkMode ? 'dark' : ''}`}> {/* Adjusted height: new header is py-4 (~32px) + logo/text height. Assuming total ~80px */}
        
        {/* OVERLAY para mobile cuando sidebar está abierto */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-[9998] lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
              className={`
                ${sidebarCollapsed ? 'w-20' : 'w-64'} 
                bg-gradient-to-b from-[#15B46A] to-[#0F9456] 
                dark:from-gray-800 dark:to-gray-900 
                text-white flex flex-col shadow-2xl 
                transition-all duration-300
                fixed lg:relative z-[9999] h-full /* h-full to fit parent flex item, sidebar will still overlap new header on mobile due to z-index */
              `}
            >
              {/* Header with Logo and Collapse Button */}
              <div className="p-4 border-b border-white/20 dark:border-gray-700 flex items-center justify-between">
                {!sidebarCollapsed && (
                  <div className="flex items-center gap-3">
                    <img
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f7eae9d9887c2ac98e6d49/870b77da3_LogoAppjolt26.png"
                      alt="JoltCab"
                      className="h-10 w-10 rounded-lg"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold">JoltCab</h1>
                        <a 
                          href="https://ihostcast.com" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] text-white/50 dark:text-gray-500 font-medium hover:text-[#15B46A] transition-colors"
                        >
                          by iHOSTcast
                        </a>
                      </div>
                      <p className="text-xs text-white/70 dark:text-gray-400">Admin Panel</p>
                    </div>
                  </div>
                )}
                
                {sidebarCollapsed && (
                  <img
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f7eae9d9887c2ac98e6d49/870b77da3_LogoAppjolt26.png"
                    alt="JoltCab"
                    className="h-10 w-10 rounded-lg mx-auto"
                  />
                )}

                <button
                  onClick={toggleSidebarCollapse}
                  className="p-2 hover:bg-white/10 dark:hover:bg-gray-700 rounded-lg transition-colors hidden lg:block"
                  title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                  {sidebarCollapsed ? (
                    <ChevronRight className="w-5 h-5" />
                  ) : (
                    <ChevronLeft className="w-5 h-5" />
                  )}
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-4">
                <div className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;

                    if (item.isSubmenu) {
                      return (
                        <div key={item.id}>
                          <button
                            onClick={() => setServiceTypesMenuOpen(!serviceTypesMenuOpen)}
                            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} gap-3 px-4 py-3 rounded-lg transition-all text-white/80 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-700 hover:text-white ${
                              serviceTypesMenuOpen ? 'bg-[#0F9456] dark:bg-gray-700' : ''
                            }`}
                            title={sidebarCollapsed ? item.label : ''}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-5 h-5" />
                              {!sidebarCollapsed && <span>{item.label}</span>}
                            </div>
                            {!sidebarCollapsed && (
                              <svg
                                className={`w-4 h-4 transition-transform ${serviceTypesMenuOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            )}
                          </button>

                          {serviceTypesMenuOpen && !sidebarCollapsed && (
                            <div className="ml-4 mt-1 space-y-1">
                              {item.submenuItems.map((subItem) => (
                                <button
                                  key={subItem.id}
                                  onClick={() => {
                                    setActiveSection(subItem.id);
                                    if (window.innerWidth < 1024) {
                                      setSidebarOpen(false);
                                    }
                                  }}
                                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm ${
                                    activeSection === subItem.id
                                      ? 'bg-white text-[#15B46A] dark:bg-gray-700 dark:text-white shadow-lg font-semibold'
                                      : 'text-white/70 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-gray-700 hover:text-white'
                                  }`}
                                >
                                  <span>• {subItem.label}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveSection(item.id);
                          if (window.innerWidth < 1024) {
                            setSidebarOpen(false);
                          }
                        }}
                        className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-all ${
                          activeSection === item.id
                            ? 'bg-white text-[#15B46A] dark:bg-gray-700 dark:text-white shadow-lg font-semibold'
                            : 'text-white/80 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-700 hover:text-white'
                        }`}
                        title={sidebarCollapsed ? item.label : ''}
                      >
                        <Icon className="w-5 h-5" />
                        {!sidebarCollapsed && <span>{item.label}</span>}
                      </button>
                    );
                  })}
                </div>
              </nav>

              <div className="p-4 border-t border-white/20 dark:border-gray-700">
                <button 
                  onClick={() => setActiveSection('profile')}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-lg hover:bg-white/10 dark:hover:bg-gray-700 transition-colors`}
                  title={sidebarCollapsed ? user?.full_name || user?.email : ''}
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user?.profile_image} />
                    <AvatarFallback className="bg-white/20 text-white">
                      {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  {!sidebarCollapsed && (
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-white">{user?.full_name || user?.email}</p>
                      <p className="text-xs text-white/70 dark:text-gray-400">Administrator</p>
                    </div>
                  )}
                </button>
                {/* Removed dark mode and logout buttons from sidebar footer as they are now in the main header */}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-100 dark:bg-gray-900">
          {/* The old header was removed as per the outline, and its elements re-integrated into the new top header */}
          <main className="flex-1 overflow-y-auto p-6">
            {/* Botón de Migración */}
            <Card className="border-[#15B46A] bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      🚀 Guía de Migración a VPS
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Migra tu app a Hetzner, AWS, Google Cloud o Azure con guías completas
                    </p>
                  </div>
                  <Button
                    onClick={() => window.location.href = createPageUrl("MigrationHub")}
                    className="bg-[#15B46A] hover:bg-[#0F9456] text-white"
                  >
                    Ver Guías de Migración
                  </Button>
                </div>
              </CardContent>
            </Card>

            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
  // --- End of new/modified return structure ---
}
