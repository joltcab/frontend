import React, { useState, useEffect } from "react";
import joltcab from "@/lib/joltcab-api";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radio, MapPin, DollarSign, TrendingUp, Calendar, Plus } from "lucide-react";
import { motion } from "framer-motion";
import DashboardHeader from "../components/shared/DashboardHeader";
import AIChat from "../components/AIChat";

export default function DispatcherDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
  const userData = await joltcab.auth.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user");
    }
  };

  const { data: dispatcherProfile } = useQuery({
    queryKey: ["dispatcherProfile"],
  queryFn: () => joltcab.entities.DispatcherProfile.filter({ user_email: user?.email }),
    enabled: !!user,
  });

  const stats = [
    { icon: DollarSign, label: "Today's Revenue", value: "$2,850", change: "+18%", color: "bg-green-500" },
    { icon: MapPin, label: "Dispatched Rides", value: "47", change: "+12%", color: "bg-blue-500" },
    { icon: TrendingUp, label: "Active Drivers", value: "12", change: "", color: "bg-purple-500" },
    { icon: Calendar, label: "This Month", value: "654", change: "+15%", color: "bg-orange-500" }
  ];

  return (
    <>
      <DashboardHeader title="Dispatcher Dashboard" user={user} />
      
      <div className="space-y-8 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl p-8 text-white shadow-xl"
        >
          <h1 className="text-3xl font-bold mb-2">Dispatcher Dashboard 📻</h1>
          <p className="text-white/90">Manage rides and drivers efficiently</p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Button size="lg" className="h-20 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            Create New Ride
          </Button>
          <Button size="lg" variant="outline" className="h-20 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white rounded-2xl">
            <MapPin className="w-5 h-5 mr-2" />
            View Live Map
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

        {/* Dispatcher Info */}
        {dispatcherProfile?.[0] && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-gray-900" />
                Dispatcher Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Dispatcher Name</p>
                  <p className="text-lg font-semibold text-gray-900">{dispatcherProfile[0].dispatcher_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    dispatcherProfile[0].status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {dispatcherProfile[0].status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Dispatched</p>
                  <p className="text-lg font-semibold text-gray-900">{dispatcherProfile[0].total_dispatched} rides</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Commission Rate</p>
                  <p className="text-lg font-semibold text-gray-900">{dispatcherProfile[0].commission_rate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Rides */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-900" />
              Recent Dispatched Rides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Radio className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No dispatched rides yet</p>
              <Button className="bg-gray-900 hover:bg-gray-800">Create First Ride</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AIChat role="dispatcher" />
    </>
  );
}