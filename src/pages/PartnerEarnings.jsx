import React, { useState, useEffect } from "react";
import joltcab from "@/lib/joltcab-api";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign, TrendingUp, Calendar, Download, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";

export default function PartnerEarnings() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("this_week");

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

  const profiles = await joltcab.entities.PartnerProfile.filter({
        user_email: userData.email
      });
      
      if (profiles[0]) {
        setProfile(profiles[0]);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  // Get partner's drivers
  const { data: drivers = [] } = useQuery({
    queryKey: ['partnerDrivers', user?.email],
    queryFn: async () => {
  const allDrivers = await joltcab.entities.DriverProfile.filter({});
      return allDrivers.filter(d => d.partner_email === user?.email);
    },
    enabled: !!user,
  });

  // Get all rides
  const { data: allRides = [], isLoading } = useQuery({
    queryKey: ['partnerRides', drivers],
    queryFn: async () => {
  const rides = await joltcab.entities.Ride.filter({ status: 'completed' });
      const driverEmails = drivers.map(d => d.user_email);
      return rides.filter(r => driverEmails.includes(r.driver_email));
    },
    enabled: drivers.length > 0,
  });

  // Filter rides by period
  const getFilteredRides = () => {
    const now = new Date();
    let startDate;

    switch(selectedPeriod) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'this_week':
        startDate = new Date(now.setDate(now.getDate() - now.getDay()));
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'this_month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'all_time':
        return allRides;
      default:
        startDate = new Date(now.setDate(now.getDate() - now.getDay()));
    }

    return allRides.filter(ride => new Date(ride.created_date) >= startDate);
  };

  const filteredRides = getFilteredRides();

  // Calculate earnings
  const totalRevenue = filteredRides.reduce((sum, r) => sum + (r.agreed_price || 0), 0);
  const commissionRate = profile?.commission_rate || 15;
  const partnerCommission = totalRevenue * (commissionRate / 100);
  const driverEarnings = totalRevenue - partnerCommission;

  // Group by driver
  const earningsByDriver = {};
  filteredRides.forEach(ride => {
    if (!earningsByDriver[ride.driver_email]) {
      earningsByDriver[ride.driver_email] = {
        rides: 0,
        revenue: 0,
        commission: 0
      };
    }
    earningsByDriver[ride.driver_email].rides += 1;
    earningsByDriver[ride.driver_email].revenue += ride.agreed_price || 0;
    earningsByDriver[ride.driver_email].commission += (ride.agreed_price || 0) * (commissionRate / 100);
  });

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Earnings & Commission</h1>
          <p className="text-gray-600 mt-1">
            Track your fleet's earnings and your commission
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this_week">This Week</SelectItem>
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="all_time">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ${totalRevenue.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              From {filteredRides.length} rides
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Your Commission</p>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              ${partnerCommission.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {commissionRate}% of revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Driver Earnings</p>
              <DollarSign className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-blue-600">
              ${driverEarnings.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {100 - commissionRate}% of revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Avg Per Ride</p>
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ${filteredRides.length > 0 ? (totalRevenue / filteredRides.length).toFixed(2) : '0.00'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ${filteredRides.length > 0 ? (partnerCommission / filteredRides.length).toFixed(2) : '0.00'} commission/ride
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings by Driver */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings by Driver</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            </div>
          ) : Object.keys(earningsByDriver).length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No earnings data</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Driver</TableHead>
                    <TableHead>Total Rides</TableHead>
                    <TableHead>Total Revenue</TableHead>
                    <TableHead>Your Commission ({commissionRate}%)</TableHead>
                    <TableHead>Driver Earnings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(earningsByDriver).map(([email, data]) => {
                    const driver = drivers.find(d => d.user_email === email);
                    return (
                      <TableRow key={email}>
                        <TableCell className="font-medium">
                          {driver?.user_email || email}
                        </TableCell>
                        <TableCell>{data.rides}</TableCell>
                        <TableCell className="font-semibold">
                          ${data.revenue.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-green-600 font-semibold">
                          ${data.commission.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-blue-600 font-semibold">
                          ${(data.revenue - data.commission).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}