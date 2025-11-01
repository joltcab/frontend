import { useState, useEffect } from "react";
import { joltcab } from "@/lib/joltcab-api";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "@/utils";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showServicesMenu, setShowServicesMenu] = useState(false);

  // Removed scroll state to address unused variable lint warning

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const disableChecks = import.meta.env.VITE_DISABLE_BACKEND_AUTH_CHECK === 'true';
      const isDev = import.meta.env.DEV === true;

      // Evitar llamadas al backend si no hay sesión o si está deshabilitado en dev
      if (disableChecks || (!token && isDev)) {
        setUser(null);
        return;
      }

      if (!token) {
        setUser(null);
        return;
      }

      const userData = await joltcab.auth.me();
      setUser(userData);
    } catch {
      setUser(null);
    }
  };

  const handleSignIn = () => {
    // Redirigir a NUESTRO login custom
    window.location.href = createPageUrl("UniversalLogin");
  };

  const handleSignUp = () => {
    // Redirigir a NUESTRO registro custom
    window.location.href = createPageUrl("Register");
  };

  const handleDashboard = () => {
    const dashboards = {
      user: "UserDashboard",
      driver: "DriverDashboard",
      corporate: "CorporateDashboard",
      hotel: "HotelDashboard",
      dispatcher: "DispatcherDashboard",
      partner: "PartnerDashboard",
      admin: "AdminPanel"
    };
    window.location.href = createPageUrl(dashboards[user?.role] || "UserDashboard");
  };

  const navItems = [
    { label: "How it Works", href: "#how-it-works" },
    { 
      label: "Services", 
      href: "#services",
      hasDropdown: true,
      dropdownItems: [
        { label: "For Passengers", href: "#passengers" },
        { label: "For Drivers", href: "#drivers" },
        { label: "For Corporate", href: "#corporate" },
        { label: "For Hotels", href: "#hotels" },
        { label: "For Dispatchers", href: "#dispatcher" }
      ]
    },
    { label: "Coverage", href: "#coverage" },
    { label: "Blog", href: createPageUrl("Blog") }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href={createPageUrl("Home")} className="flex items-center gap-3 group">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f7eae9d9887c2ac98e6d49/870b77da8_LogoAppjolt26.png"
              alt="JoltCab"
              className="h-12 w-12 rounded-xl shadow-lg group-hover:scale-110 transition-transform"
            />
            <span className="text-2xl font-bold text-white">
              JoltCab
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.hasDropdown ? (
                  <div
                    onMouseEnter={() => setShowServicesMenu(true)}
                    onMouseLeave={() => setShowServicesMenu(false)}
                  >
                    <button
                      className="flex items-center gap-1 font-medium text-white hover:text-[#15B46A] transition-colors"
                    >
                      {item.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <AnimatePresence>
                      {showServicesMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2"
                        >
                          {item.dropdownItems.map((dropItem) => (
                            <a
                              key={dropItem.label}
                              href={dropItem.href}
                              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#15B46A] transition-colors"
                            >
                              {dropItem.label}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <a
                    href={item.href}
                    className="font-medium text-white hover:text-[#15B46A] transition-colors"
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <Button
                onClick={handleDashboard}
                className="bg-[#15B46A] hover:bg-[#0F9456] text-white rounded-full px-6"
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={handleSignIn}
                  className="rounded-full px-6 text-white hover:bg-white/10"
                >
                  Sign In
                </Button>
                <Button
                  onClick={handleSignUp}
                  className="bg-[#15B46A] hover:bg-[#0F9456] text-white rounded-full px-6 shadow-lg"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isOpen ? (
              <X className="text-white" />
            ) : (
              <Menu className="text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-gray-900 border-t border-gray-800"
          >
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block py-2 text-white hover:text-[#15B46A] font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              
              <div className="pt-4 border-t border-gray-800 space-y-2">
                {user ? (
                  <Button
                    onClick={handleDashboard}
                    className="w-full bg-[#15B46A] hover:bg-[#0F9456] text-white"
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleSignIn}
                      className="w-full"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={handleSignUp}
                      className="w-full bg-[#15B46A] hover:bg-[#0F9456] text-white"
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}