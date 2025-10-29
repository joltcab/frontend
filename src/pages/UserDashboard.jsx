import React, { useState, useEffect } from "react";
import { joltcab } from "@/lib/joltcab-api";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  MapPin, Calendar, Clock, ChevronRight, Receipt, 
  Tag, User, Car, Package, Repeat, UtensilsCrossed, 
  ShoppingCart, Plus, Shield, Award, Gift
} from "lucide-react";
import { createPageUrl } from "@/utils";
import RideBookingDialog from "../components/booking/RideBookingDialog";
import SignOutButton from "@/components/SignOutButton";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await joltcab.auth.me();
      setUser(userData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading user:", error);
      setIsLoading(false);
    }
  };

  const { data: rides = [] } = useQuery({
    queryKey: ["userRides", user?.email],
    queryFn: () => joltcab.entities.Ride.filter({ passenger_email: user?.email }, "-created_date", 10),
    enabled: !!user,
  });

  const services = [
    { icon: Car, label: "Ride", desc: "Go anywhere with Uber" },
    { icon: Calendar, label: "Reserve", desc: "Reserve your ride in advance" },
    { icon: Car, label: "Rental Cars", desc: "Rent a car for your trip" },
    { icon: Package, label: "Courier", desc: "Same-day item delivery" },
    { icon: Repeat, label: "Hourly", desc: "Multiple stops, one ride" },
    { icon: UtensilsCrossed, label: "Food", desc: "Order delivery from restaurants" },
    { icon: ShoppingCart, label: "Grocery", desc: "Get groceries delivered" },
  ];

  const quickActions = [
    { icon: Receipt, label: "Activity", href: createPageUrl("RideHistory") },
    { icon: Tag, label: "Promotions", href: "#" },
    { icon: User, label: "Account", href: createPageUrl("Profile") },
  ];

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Secondary Black Menu - Sticky */}
      <div className="bg-black text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <a
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-2 text-sm font-medium hover:text-gray-300 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{action.label}</span>
                  </a>
                );
              })}
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowBookingDialog(true)}
                className="bg-white text-black hover:bg-gray-100 rounded-full px-6"
              >
                Request a ride
              </Button>
              <SignOutButton variant="ghost" className="text-white hover:text-gray-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.full_name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-gray-600">You have no upcoming trips</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Booking */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Booking Card */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-black rounded-full"></div>
                    <Input
                      placeholder="Enter location"
                      className="flex-1 border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 text-lg"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-black rounded-sm"></div>
                    <Input
                      placeholder="Enter destination"
                      className="flex-1 border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 text-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date</label>
                      <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Time</label>
                      <Input type="time" defaultValue="now" className="mt-1" />
                    </div>
                  </div>

                  <Button 
                    onClick={() => setShowBookingDialog(true)}
                    className="w-full bg-black hover:bg-gray-800 text-white h-12 text-lg rounded-lg mt-4"
                  >
                    See prices
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Suggestions */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Suggestions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {services.slice(0, 8).map((service) => {
                  const Icon = service.icon;
                  return (
                    <button
                      key={service.label}
                      onClick={() => service.label === 'Ride' && setShowBookingDialog(true)}
                      className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium">{service.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your account and activity</h2>
              {rides.length > 0 ? (
                <div className="space-y-3">
                  {rides.slice(0, 5).map((ride) => (
                    <Card key={ride.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{ride.dropoff_location}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(ride.created_date).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric'
                                })} • {new Date(ride.created_date).toLocaleTimeString('en-US', { 
                                  hour: 'numeric', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">${ride.agreed_price || '0.00'}</p>
                            <button className="text-sm text-gray-600 hover:underline">See details</button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No trips yet</p>
                    <Button 
                      onClick={() => setShowBookingDialog(true)}
                      className="bg-black hover:bg-gray-800 text-white"
                    >
                      Book your first ride
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Services */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Services</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {services.slice(3).map((service) => {
                  const Icon = service.icon;
                  return (
                    <Card key={service.label} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <Icon className="w-10 h-10 mb-3" />
                        <h3 className="font-bold text-gray-900 mb-1">{service.label}</h3>
                        <p className="text-sm text-gray-600">{service.desc}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Promos */}
          <div className="space-y-6">
            {/* Plan for later */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl text-gray-900 mb-4">Plan for later</h3>
                <div className="mb-4">
                  <p className="text-2xl font-bold text-gray-900 mb-2">Reserve</p>
                  <p className="text-sm text-gray-600 mb-4">Get your ride right with Uber Reserve</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4" />
                      <span>Choose exact pickup time up to 90 days in advance</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock className="w-4 h-4" />
                      <span>Extra wait time included</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Shield className="w-4 h-4" />
                      <span>Cancel at no charge up to 60 minutes in advance</span>
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-black hover:bg-gray-800 text-white">
                  Reserve now
                </Button>
              </CardContent>
            </Card>

            {/* Uber One */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-6 h-6" />
                  <h3 className="font-bold text-xl text-gray-900">Uber One</h3>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  You could've saved $28.00 in the last 30 days
                </p>
                <ul className="space-y-2 mb-4 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5"></div>
                    <span>$0 Delivery Fee on eligible orders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5"></div>
                    <span>Earn 6% Uber Cash on rides</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5"></div>
                    <span>Up to 10% off deliveries</span>
                  </li>
                </ul>
                <Button className="w-full bg-black hover:bg-gray-800 text-white">
                  Try free for 4 weeks
                </Button>
              </CardContent>
            </Card>

            {/* Download Apps */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4">It's easier in the apps</h3>
                <div className="space-y-3">
                  <a href="#" className="block">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/320px-Download_on_the_App_Store_Badge.svg.png"
                      alt="Download on App Store"
                      className="h-10"
                    />
                  </a>
                  <a href="#" className="block">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/320px-Google_Play_Store_badge_EN.svg.png"
                      alt="Get it on Google Play"
                      className="h-10"
                    />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showBookingDialog && (
        <RideBookingDialog
          isOpen={showBookingDialog}
          onClose={() => setShowBookingDialog(false)}
          userEmail={user.email}
        />
      )}
    </div>
  );
}