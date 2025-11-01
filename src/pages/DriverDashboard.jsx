import React, { useState, useEffect } from "react";
import joltcab from "@/lib/joltcab-api";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Car, DollarSign, Star, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import DashboardHeader from "../components/shared/DashboardHeader";
import OnlineToggle from "../components/tracking/OnlineToggle";
import ActiveRideTracker from "../components/driver/ActiveRideTracker";
import AIChat from "../components/AIChat";

export default function DriverDashboard() {
  const [user, setUser] = useState(null);
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

  const { data: driverProfile } = useQuery({
    queryKey: ["driverProfile", user?.email],
    queryFn: async () => {
  const profiles = await joltcab.entities.DriverProfile.filter({ user_email: user?.email });
      return profiles[0] || null;
    },
    enabled: !!user,
  });

  const { data: rides = [] } = useQuery({
    queryKey: ["driverRides", user?.email],
  queryFn: () => joltcab.entities.Ride.filter({ driver_email: user?.email }, "-created_date", 10),
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#15B46A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load user data</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  const completedRides = rides.filter(r => r.status === 'completed');
  const todayRides = completedRides.filter(r => {
    const rideDate = new Date(r.created_date);
    const today = new Date();
    return rideDate.toDateString() === today.toDateString();
  });
  const todayEarnings = todayRides.reduce((sum, r) => sum + (r.agreed_price || 0), 0);

  const stats = [
    { icon: DollarSign, label: "Today's Earnings", value: `$${todayEarnings.toFixed(2)}`, color: "bg-green-500" },
    { icon: Car, label: "Total Trips", value: completedRides.length, color: "bg-blue-500" },
    { icon: Star, label: "Rating", value: driverProfile?.rating?.toFixed(1) || "5.0", color: "bg-yellow-500" },
    { icon: CheckCircle, label: "Today's Trips", value: todayRides.length, color: "bg-purple-500" }
  ];

  return (
    <>
      <DashboardHeader title="Driver Dashboard" user={user} />
      
      <div className="space-y-8 p-6">
        {/* Welcome Header with Online Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#15B46A] to-[#0F9456] rounded-3xl p-8 text-white shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome, {user?.full_name?.split(' ')[0]}! 🚗
              </h1>
              <p className="text-white/90">Ready to start earning today?</p>
            </div>
            <OnlineToggle driverEmail={user.email} />
          </div>
        </motion.div>

        {/* Active Ride Tracker */}
        <ActiveRideTracker driverEmail={user.email} />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-md`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Trips */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Trips</h2>
            {completedRides.length === 0 ? (
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No completed trips yet</p>
                <p className="text-sm text-gray-500 mt-2">Go online to start receiving ride requests!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedRides.slice(0, 5).map((ride) => (
                  <div key={ride.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#15B46A]/10 rounded-full flex items-center justify-center">
                        <Car className="w-6 h-6 text-[#15B46A]" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {ride.pickup_location} → {ride.dropoff_location}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4" />
                          {new Date(ride.created_date).toLocaleDateString()} • {ride.duration_minutes || "N/A"} min
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${ride.agreed_price || "N/A"}</p>
                      <p className="text-sm text-gray-600">{ride.distance_km?.toFixed(1) || "N/A"} km</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AIChat userRole="driver" />
    </>
  );
}