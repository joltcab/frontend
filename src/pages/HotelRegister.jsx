import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Hotel, Mail, Lock, Phone, MapPin, Globe, Building2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";
import GoogleMapLoader from "../components/maps/GoogleMapLoader";

export default function HotelRegister() {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [autocomplete, setAutocomplete] = useState(null);

  // Login form
  const [loginData, setLoginData] = useState({
    email_or_phone: "",
    password: ""
  });

  // Register form
  const [registerData, setRegisterData] = useState({
    hotel_name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    contact_name: ""
  });

  useEffect(() => {
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    try {
      const user = await base44.auth.me();
      if (user && user.role === 'hotel') {
        window.location.href = createPageUrl('HotelDashboard');
      }
    } catch (error) {
      // Not logged in, continue
    }
  };

  // Get countries
  const { data: countries = [] } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const data = await base44.entities.Country.filter({ business_status: true });
      return data;
    }
  });

  // Get cities for selected country
  const { data: cities = [] } = useQuery({
    queryKey: ['cities', selectedCountry],
    queryFn: async () => {
      if (!selectedCountry) return [];
      const data = await base44.entities.City.filter({ 
        country_id: selectedCountry,
        business_status: true 
      });
      return data;
    },
    enabled: !!selectedCountry
  });

  // Setup Google Maps Autocomplete
  const setupAutocomplete = (country) => {
    if (!window.google || !country) return;

    const input = document.getElementById('address-input');
    if (!input) return;

    const options = {
      componentRestrictions: { country: country.country_code || 'US' },
      fields: ['address_components', 'geometry', 'formatted_address']
    };

    const autocomp = new window.google.maps.places.Autocomplete(input, options);
    
    autocomp.addListener('place_changed', () => {
      const place = autocomp.getPlace();
      if (place.geometry) {
        setAddress(place.formatted_address);
        setCoordinates({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        });
        setRegisterData(prev => ({
          ...prev,
          address: place.formatted_address
        }));
      }
    });

    setAutocomplete(autocomp);
  };

  useEffect(() => {
    if (selectedCountry && countries.length > 0) {
      const country = countries.find(c => c.id === selectedCountry);
      if (country) {
        setupAutocomplete(country);
      }
    }
  }, [selectedCountry, countries]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data) => {
      setLoading(true);
      
      // Determine if input is email or phone
      const isEmail = data.email_or_phone.includes('@');
      
      // Use Base44's built-in auth
      if (isEmail) {
        await base44.auth.redirectToLogin(createPageUrl('HotelDashboard'));
      } else {
        // Phone login - would need SMS verification
        throw new Error('Phone login requires SMS verification');
      }
    },
    onSuccess: () => {
      window.location.href = createPageUrl('HotelDashboard');
    },
    onError: (error) => {
      alert('Login failed: ' + error.message);
      setLoading(false);
    }
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data) => {
      setLoading(true);

      // Validation
      if (!data.hotel_name || !data.email || !data.password) {
        throw new Error('Please fill all required fields');
      }

      if (data.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      if (!selectedCountry || !selectedCity) {
        throw new Error('Please select country and city');
      }

      if (!coordinates.lat || !coordinates.lng) {
        throw new Error('Please select a valid address from the suggestions');
      }

      const country = countries.find(c => c.id === selectedCountry);
      const city = cities.find(c => c.id === selectedCity);

      // Create user account first (using Base44 auth)
      // Note: In production, you'd trigger Base44's signup flow
      // For now, we'll use a backend function to handle the registration
      
      const result = await base44.functions.invoke('registerHotel', {
        hotel_name: data.hotel_name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        contact_name: data.contact_name,
        address: data.address,
        country_id: selectedCountry,
        city_id: selectedCity,
        country_name: country.name,
        city_name: city.name,
        country_code: country.country_code,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        currency: country.currency,
        currency_sign: country.currency_sign
      });

      return result.data;
    },
    onSuccess: (data) => {
      alert('Registration successful! Please check your email to verify your account.');
      // Redirect to login or dashboard
      window.location.href = createPageUrl('HotelDashboard');
    },
    onError: (error) => {
      alert('Registration failed: ' + error.message);
      setLoading(false);
    }
  });

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    registerMutation.mutate(registerData);
  };

  const handleSocialLogin = (provider) => {
    alert(`${provider} login will be available soon`);
    // In production: base44.auth.socialLogin(provider, 'hotel')
  };

  return (
    <GoogleMapLoader>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Header */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <a href={createPageUrl('Home')} className="flex items-center gap-2">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f7eae9d9887c2ac98e6d49/870b77da8_LogoAppjolt26.png"
                  alt="JoltCab"
                  className="h-10 w-10 rounded-xl"
                />
                <span className="text-2xl font-bold text-gray-900">JoltCab</span>
              </a>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full"
          >
            <Card className="shadow-2xl">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                  <Hotel className="w-10 h-10 text-orange-600" />
                </div>
                <CardTitle className="text-3xl font-bold">
                  {mode === 'login' ? 'Welcome Back' : 'Hotel Services'}
                </CardTitle>
                <p className="text-gray-600">
                  {mode === 'login' 
                    ? 'Log in to your hotel account' 
                    : 'Partner with us for seamless travel'}
                </p>
              </CardHeader>

              <CardContent>
                <Tabs value={mode} onValueChange={setMode} className="mb-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Log in</TabsTrigger>
                    <TabsTrigger value="register">Sign up</TabsTrigger>
                  </TabsList>

                  {/* Login Tab */}
                  <TabsContent value="login" className="space-y-4 mt-6">
                    {/* Social Buttons */}
                    <div className="space-y-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => handleSocialLogin('google')}
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => handleSocialLogin('facebook')}
                      >
                        <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Continue with Facebook
                      </Button>
                    </div>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                      </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="email_or_phone">Email or Phone</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            id="email_or_phone"
                            type="text"
                            placeholder="Enter email or phone"
                            className="pl-10"
                            value={loginData.email_or_phone}
                            onChange={(e) => setLoginData({...loginData, email_or_phone: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label htmlFor="password">Password</Label>
                          <a href="#" className="text-sm text-orange-600 hover:underline">
                            Forgot password?
                          </a>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="Enter password"
                            className="pl-10"
                            value={loginData.password}
                            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Logging in...
                          </>
                        ) : (
                          'Log in'
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Register Tab */}
                  <TabsContent value="register" className="space-y-4 mt-6">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <Label htmlFor="hotel_name">Hotel Name *</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            id="hotel_name"
                            type="text"
                            placeholder="Enter hotel name"
                            className="pl-10"
                            value={registerData.hotel_name}
                            onChange={(e) => setRegisterData({...registerData, hotel_name: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="contact_name">Contact Name *</Label>
                        <Input
                          id="contact_name"
                          type="text"
                          placeholder="Enter contact person name"
                          value={registerData.contact_name}
                          onChange={(e) => setRegisterData({...registerData, contact_name: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Hotel Email *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="hotel@example.com"
                            className="pl-10"
                            value={registerData.email}
                            onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="register_password">Password *</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            id="register_password"
                            type="password"
                            placeholder="Min. 6 characters"
                            className="pl-10"
                            value={registerData.password}
                            onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                            required
                            minLength={6}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                          <SelectTrigger>
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-gray-400" />
                              <SelectValue placeholder="Select country" />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country.id} value={country.id}>
                                {country.country_code} {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedCountry && (
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Select value={selectedCity} onValueChange={setSelectedCity}>
                            <SelectTrigger>
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-gray-400" />
                                <SelectValue placeholder="Select city" />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              {cities.map((city) => (
                                <SelectItem key={city.id} value={city.id}>
                                  {city.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="Enter phone number"
                            className="pl-10"
                            value={registerData.phone}
                            onChange={(e) => setRegisterData({...registerData, phone: e.target.value.replace(/\D/g, '')})}
                            required
                          />
                        </div>
                      </div>

                      {selectedCountry && (
                        <div>
                          <Label htmlFor="address-input">Hotel Address *</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                              id="address-input"
                              type="text"
                              placeholder="Start typing address..."
                              className="pl-10"
                              value={registerData.address}
                              onChange={(e) => setRegisterData({...registerData, address: e.target.value})}
                              autoComplete="off"
                              required
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Select from suggestions for accurate location
                          </p>
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                        disabled={loading || !selectedCountry || !selectedCity}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          'Create hotel account'
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </GoogleMapLoader>
  );
}