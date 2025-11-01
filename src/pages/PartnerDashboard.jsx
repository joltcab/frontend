import React, { useState, useEffect } from "react";
import joltcab from "@/lib/joltcab-api";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users, Car, DollarSign, TrendingUp, Clock, CheckCircle,
  Loader2, ArrowRight, Plus, AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";

export default function PartnerDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
  const userData = await joltcab.auth.me();
      setUser(userData);
      
      if (userData.role !== 'partner') {
        window.location.href = createPageUrl('Home');
        return;
      }

      // Load partner profile
  const profiles = await joltcab.entities.PartnerProfile.filter({
        user_email: userData.email
      });
      
      if (profiles[0]) {
        setProfile(profiles[0]);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get partner's drivers
  const { data: drivers = [] } = useQuery({
    queryKey: ['partnerDrivers', user?.email],
    queryFn: async () => {
  const allDrivers = await joltcab.entities.DriverProfile.filter({});
      // Filter drivers that belong to this partner
      return allDrivers.filter(d => d.partner_email === user?.email);
    },
    enabled: !!user,
  });

  // Get partner's vehicles
  const { data: vehicles = [] } = useQuery({
    queryKey: ['partnerVehicles', user?.email],
    queryFn: async () => {
  const allVehicles = await joltcab.entities.Vehicle.filter({});
      // Filter vehicles through drivers
      const driverEmails = drivers.map(d => d.user_email);
      return allVehicles.filter(v => driverEmails.includes(v.driver_email));
    },
    enabled: !!user && drivers.length > 0,
  });

  // Get all rides from partner's drivers
  const { data: rides = [] } = useQuery({
    queryKey: ['partnerRides', user?.email],
    queryFn: async () => {
  const allRides = await joltcab.entities.Ride.filter({});
      const driverEmails = drivers.map(d => d.user_email);
      return allRides.filter(r => driverEmails.includes(r.driver_email));
    },
    enabled: !!user && drivers.length > 0,
  });

  // Calculate stats
  const activeDrivers = drivers.filter(d => d.is_online).length;
  const totalVehicles = vehicles.length;
  const completedRides = rides.filter(r => r.status === 'completed').length;
  
  const totalRevenue = rides
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + (r.agreed_price || 0), 0);

  const partnerCommission = totalRevenue * ((profile?.commission_rate || 15) / 100);

  // Get today's rides
  const todayRides = rides.filter(r => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const rideDate = new Date(r.created_date);
    return rideDate >= today && r.status === 'completed';
  });

  const todayRevenue = todayRides.reduce((sum, r) => sum + (r.agreed_price || 0), 0);
  const todayCommission = todayRevenue * ((profile?.commission_rate || 15) / 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (profile?.status === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <CardTitle className="text-center text-2xl">Account Under Review</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Thank you for registering as a partner! Your account is currently under review by our team.
            </p>
            <p className="text-sm text-gray-500">
              You'll receive an email notification once your account is approved. This usually takes 24-48 hours.
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.href = createPageUrl('Home')}
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Drivers",
      value: drivers.length,
      subtitle: `${activeDrivers} online now`,
      icon: Users,
      color: "bg-blue-500",
      link: createPageUrl('PartnerProviders')
    },
    {
      title: "Total Vehicles",
      value: totalVehicles,
      subtitle: `${vehicles.filter(v => v.is_active).length} active`,
      icon: Car,
      color: "bg-purple-500",
      link: createPageUrl('PartnerVehicles')
    },
    {
      title: "Total Rides",
      value: completedRides,
      subtitle: `${todayRides.length} today`,
      icon: CheckCircle,
      color: "bg-green-500",
      link: createPageUrl('PartnerEarnings')
    },
    {
      title: "Total Commission",
      value: `$${partnerCommission.toFixed(2)}`,
      subtitle: `$${todayCommission.toFixed(2)} today`,
      icon: DollarSign,
      color: "bg-yellow-500",
      link: createPageUrl('PartnerEarnings')
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🤝 Partner Dashboard</h1>
            <p className="text-blue-100 text-lg">{profile?.partner_company_name || 'Fleet Management'}</p>
            <p className="text-blue-200 text-sm mt-1">
              Commission Rate: {profile?.commission_rate || 15}%
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => window.location.href = createPageUrl('PartnerProviders')}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Driver
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="hover:shadow-lg transition-all cursor-pointer"
              onClick={() => window.location.href = stat.link}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-xs text-gray-500">
                  {stat.subtitle}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto flex-col items-start p-4 text-left"
              onClick={() => window.location.href = createPageUrl('PartnerProviders')}
            >
              <Users className="w-6 h-6 mb-2 text-blue-600" />
              <span className="font-semibold">Manage Drivers</span>
              <span className="text-xs text-gray-500 mt-1">
                Add, edit or remove drivers from your fleet
              </span>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col items-start p-4 text-left"
              onClick={() => window.location.href = createPageUrl('PartnerVehicles')}
            >
              <Car className="w-6 h-6 mb-2 text-purple-600" />
              <span className="font-semibold">Manage Vehicles</span>
              <span className="text-xs text-gray-500 mt-1">
                View and manage your fleet vehicles
              </span>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col items-start p-4 text-left"
              onClick={() => window.location.href = createPageUrl('PartnerEarnings')}
            >
              <TrendingUp className="w-6 h-6 mb-2 text-green-600" />
              <span className="font-semibold">View Earnings</span>
              <span className="text-xs text-gray-500 mt-1">
                Track your commission and payments
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Rides</CardTitle>
        </CardHeader>
        <CardContent>
          {rides.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No rides yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Rides from your drivers will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {rides.slice(0, 5).map((ride, index) => {
                const driver = drivers.find(d => d.user_email === ride.driver_email);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Car className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {ride.pickup_location} → {ride.dropoff_location}
                        </p>
                        <p className="text-sm text-gray-500">
                          Driver: {driver?.user_email || 'Unknown'} • {new Date(ride.created_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${ride.agreed_price?.toFixed(2) || '0.00'}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        ride.status === 'completed' 
                          ? 'bg-green-100 text-green-700'
                          : ride.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {ride.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}