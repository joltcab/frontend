import { useState, useEffect } from "react";
import joltcab from "@/lib/joltcab-api";
import appConfig from "@/config/app";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, Car, Briefcase, Hotel, Radio, ArrowRight, 
  ArrowLeft, Loader2, Eye, EyeOff, CheckCircle, Handshake 
} from "lucide-react";
import { motion } from "framer-motion";

export default function Register() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    phone: ""
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const disableChecks = import.meta.env.VITE_DISABLE_BACKEND_AUTH_CHECK === 'true';
      const isDev = import.meta.env.DEV === true;

      if (disableChecks || (!token && isDev)) {
        return; // no sesión, no verificar backend en dev
      }

      if (!token) {
        return;
      }

  const user = await joltcab.auth.me();
      if (user) {
        redirectToDashboard(user.role);
      }
    } catch {
      // Not logged in
    }
  };

  const redirectToDashboard = (role) => {
    const dashboards = {
      user: "UserDashboard",
      driver: "DriverDashboard",
      corporate: "CorporateDashboard",
      hotel: "HotelDashboard",
      dispatcher: "DispatcherDashboard",
      partner: "PartnerDashboard",
      admin: "AdminPanel"
    };
    window.location.href = createPageUrl(dashboards[role] || "UserDashboard");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.full_name || !formData.phone) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Registrar con base44
  await joltcab.auth.register(formData.email, formData.password);
      
      // Login automático
  await joltcab.auth.login(formData.email, formData.password);
      
      // Actualizar perfil con rol y datos adicionales
  await joltcab.auth.updateMe({
        full_name: formData.full_name,
        phone: formData.phone,
        role: selectedRole,
        status: selectedRole === 'driver' ? 'pending' : 'active',
        is_verified: false
      });

      setSuccess(true);
      setMessage({ 
        type: 'success', 
        text: '✅ Account created successfully! Redirecting...' 
      });

      setTimeout(() => {
        if (selectedRole === 'driver') {
          window.location.href = createPageUrl("CompleteVerification");
        } else {
          redirectToDashboard(selectedRole);
        }
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMsg = 'Registration failed. Please try again.';
      
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        errorMsg = '❌ This email is already registered. Try logging in instead.';
      } else if (error.message.includes('Invalid email')) {
        errorMsg = '❌ Invalid email format';
      }
      
      setMessage({ type: 'error', text: errorMsg });
      setLoading(false);
    }
  };

  const userTypes = [
    {
      id: "user",
      title: "Passenger",
      description: "Book rides and travel with ease",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      features: ["Fair pricing", "Safe trips", "24/7 support"]
    },
    {
      id: "driver",
      title: "Driver",
      description: "Earn money driving with JoltCab",
      icon: Car,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      features: ["Higher earnings", "Flexible hours", "Instant payouts"]
    },
    {
      id: "corporate",
      title: "Corporate",
      description: "Manage company transportation",
      icon: Briefcase,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      features: ["Centralized billing", "Trip reports", "Priority support"]
    },
    {
      id: "hotel",
      title: "Hotel",
      description: "Provide rides for your guests",
      icon: Hotel,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      features: ["Guest satisfaction", "Commission program", "Premium service"]
    },
    {
      id: "dispatcher",
      title: "Dispatcher",
      description: "Dispatch and coordinate rides",
      icon: Radio,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      features: ["Real-time tracking", "Fleet management", "Revenue reports"]
    },
    {
      id: "partner",
      title: "Partner (Fleet Owner)",
      description: "Manage multiple drivers and vehicles",
      icon: Handshake,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      features: ["Multi-driver management", "Fleet analytics", "Commission control"]
    }
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="pt-12 pb-8 text-center">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Account Created Successfully!
            </h2>
            
            <p className="text-gray-600 mb-8">
              {selectedRole === 'driver' 
                ? 'Please complete your verification to start driving.'
                : 'Redirecting to your dashboard...'}
            </p>

            <Loader2 className="w-8 h-8 animate-spin text-[#15B46A] mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <img
  src={appConfig.logo}
              alt="JoltCab"
              className="h-20 w-20 mx-auto rounded-2xl shadow-lg mb-6"
            />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Join JoltCab Today
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose how you want to use JoltCab
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {userTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 ${type.borderColor} ${type.bgColor}`}
                    onClick={() => setSelectedRole(type.id)}
                  >
                    <CardContent className="p-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${type.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {type.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4">
                        {type.description}
                      </p>

                      <ul className="space-y-2 mb-4">
                        {type.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        className={`w-full bg-gradient-to-r ${type.color} text-white hover:opacity-90`}
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Already have an account?{" "}
              <a 
                href={createPageUrl("UniversalLogin")} 
                className="text-[#15B46A] hover:text-[#0F9456] font-semibold"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentType = userTypes.find(t => t.id === selectedRole);
  const Icon = currentType.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => setSelectedRole(null)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Options
        </Button>

        <Card className="shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${currentType.color} rounded-full flex items-center justify-center mb-4`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              {currentType.title} Sign Up
            </CardTitle>
            <p className="text-gray-600 mt-2">{currentType.description}</p>
          </CardHeader>

          <CardContent>
            {message.text && (
              <Alert className={`mb-6 ${
                message.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  placeholder="John Doe"
                  required
                  disabled={loading}
                  className="text-lg py-6"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                  className="text-lg py-6"
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+1234567890"
                  required
                  disabled={loading}
                  className="text-lg py-6"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Minimum 6 characters"
                    required
                    disabled={loading}
                    className="text-lg py-6 pr-11"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Re-enter password"
                    required
                    disabled={loading}
                    className="text-lg py-6 pr-11"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className={`w-full bg-gradient-to-r ${currentType.color} text-white font-semibold shadow-lg py-6 text-lg`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create {currentType.title} Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <a 
                  href={createPageUrl("UniversalLogin")} 
                  className="text-[#15B46A] hover:text-[#0F9456] font-semibold"
                >
                  Sign In
                </a>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                By creating an account, you agree to JoltCab&apos;s{" "}
                <a href="#" className="text-[#15B46A] hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-[#15B46A] hover:underline">Privacy Policy</a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}