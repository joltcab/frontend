import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hotel, Users, DollarSign, TrendingUp, Star, Calendar, Plus } from "lucide-react";
import { motion } from "framer-motion";
import DashboardHeader from "../components/shared/DashboardHeader";
import AIChat from "../components/AIChat";

export default function HotelDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user");
    }
  };

  const { data: hotelProfile } = useQuery({
    queryKey: ["hotelProfile"],
    queryFn: () => base44.entities.HotelProfile.filter({ user_email: user?.email }),
    enabled: !!user,
  });

  const stats = [
    { icon: DollarSign, label: "Commission Earned", value: "$3,240", change: "+15%", color: "bg-green-500" },
    { icon: Users, label: "Guest Bookings", value: "156", change: "+12%", color: "bg-blue-500" },
    { icon: TrendingUp, label: "This Month", value: "42", change: "+8%", color: "bg-purple-500" },
    { icon: Star, label: "Hotel Rating", value: hotelProfile?.[0]?.star_rating || 0, change: "", color: "bg-yellow-500" }
  ];

  return (
    <>
      <DashboardHeader title="Hotel Dashboard" user={user} />
      
      <div className="space-y-8 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-3xl p-8 text-white shadow-xl"
        >
          <h1 className="text-3xl font-bold mb-2">Hotel Dashboard 🏨</h1>
          <p className="text-white/90">Premium transportation services for your guests</p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Button size="lg" className="h-20 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            Book for Guest
          </Button>
          <Button size="lg" variant="outline" className="h-20 border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white rounded-2xl">
            <Calendar className="w-5 h-5 mr-2" />
            Booking History
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                      </div>
                      {stat.change && <span className="text-sm font-medium text-green-600">{stat.change}</span>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Hotel Info */}
        {hotelProfile?.[0] && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hotel className="w-5 h-5 text-orange-600" />
                Hotel Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Hotel Name</p>
                  <p className="text-lg font-semibold text-gray-900">{hotelProfile[0].hotel_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Contact Person</p>
                  <p className="text-lg font-semibold text-gray-900">{hotelProfile[0].contact_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Address</p>
                  <p className="text-lg font-semibold text-gray-900">{hotelProfile[0].address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Commission Rate</p>
                  <p className="text-lg font-semibold text-gray-900">{hotelProfile[0].commission_rate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Guest Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-600" />
              Recent Guest Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Hotel className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No guest bookings yet</p>
              <Button className="bg-orange-600 hover:bg-orange-700">Create First Booking</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AIChat role="hotel" />
    </>
  );
}