import React, { useState, useEffect } from "react";
import joltcab from "@/lib/joltcab-api";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, DollarSign, TrendingUp, Calendar, FileText, Plus, Download } from "lucide-react";
import { motion } from "framer-motion";
import DashboardHeader from "../components/shared/DashboardHeader";
import AIChat from "../components/AIChat";

export default function CorporateDashboard() {
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

  const { data: corporateProfile } = useQuery({
    queryKey: ["corporateProfile"],
  queryFn: () => joltcab.entities.CorporateProfile.filter({ user_email: user?.email }),
    enabled: !!user,
  });

  const stats = [
    { icon: DollarSign, label: "Monthly Spent", value: "$12,450", change: "+12%", color: "bg-green-500" },
    { icon: Users, label: "Team Members", value: corporateProfile?.[0]?.employee_count || 0, change: "", color: "bg-blue-500" },
    { icon: Calendar, label: "Total Bookings", value: "284", change: "+8%", color: "bg-purple-500" },
    { icon: TrendingUp, label: "This Month", value: "42", change: "", color: "bg-orange-500" }
  ];

  return (
    <>
      <DashboardHeader title="Corporate Dashboard" user={user} />
      
      <div className="space-y-8 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl"
        >
          <h1 className="text-3xl font-bold mb-2">Corporate Dashboard 💼</h1>
          <p className="text-white/90">Manage your team's transportation efficiently</p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Button size="lg" className="h-20 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            Book for Team
          </Button>
          <Button size="lg" variant="outline" className="h-20 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl">
            <Users className="w-5 h-5 mr-2" />
            Manage Members
          </Button>
          <Button size="lg" variant="outline" className="h-20 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl">
            <FileText className="w-5 h-5 mr-2" />
            Monthly Report
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

        {/* Company Info */}
        {corporateProfile?.[0] && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Company Name</p>
                  <p className="text-lg font-semibold text-gray-900">{corporateProfile[0].company_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Contact Person</p>
                  <p className="text-lg font-semibold text-gray-900">{corporateProfile[0].contact_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    corporateProfile[0].status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {corporateProfile[0].status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Employees</p>
                  <p className="text-lg font-semibold text-gray-900">{corporateProfile[0].employee_count} members</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Recent Bookings
              </CardTitle>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No bookings yet</p>
              <Button className="bg-blue-600 hover:bg-blue-700">Create First Booking</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AIChat role="corporate" />
    </>
  );
}