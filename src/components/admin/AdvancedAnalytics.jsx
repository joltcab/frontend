import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { joltcab } from "@/lib/joltcab-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, TrendingUp, TrendingDown, DollarSign, Users, Car, MapPin, Calendar } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import moment from 'moment';

export default function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d, 1y
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const { data: rides = [] } = useQuery({
    queryKey: ['analyticsRides'],
    queryFn: () => joltcab.entities.Ride.list('-created_date', 500),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['analyticsUsers'],
    queryFn: () => joltcab.entities.User.list(),
  });

  const { data: drivers = [] } = useQuery({
    queryKey: ['analyticsDrivers'],
    queryFn: () => joltcab.entities.DriverProfile.list(),
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['analyticsTransactions'],
    queryFn: () => joltcab.entities.Transaction.list('-created_date', 500),
  });

  // Calculate date range
  const getDateRange = () => {
    const now = moment();
    switch (timeRange) {
      case '7d': return moment().subtract(7, 'days');
      case '30d': return moment().subtract(30, 'days');
      case '90d': return moment().subtract(90, 'days');
      case '1y': return moment().subtract(1, 'year');
      default: return moment().subtract(7, 'days');
    }
  };

  const startDate = getDateRange();

  // Filter data by date range
  const filteredRides = rides.filter(r => moment(r.created_date).isAfter(startDate));
  const filteredTransactions = transactions.filter(t => moment(t.created_date).isAfter(startDate));

  // KPIs
  const totalRevenue = filteredTransactions
    .filter(t => t.status === 'completed' && t.type === 'ride_payment')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const completedRides = filteredRides.filter(r => r.status === 'completed').length;
  const cancelledRides = filteredRides.filter(r => r.status === 'cancelled').length;
  const avgRideValue = completedRides > 0 ? totalRevenue / completedRides : 0;
  const completionRate = filteredRides.length > 0 ? (completedRides / filteredRides.length * 100) : 0;

  // Daily revenue data
  const getDailyData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = moment().subtract(i, 'days');
      const dayRides = filteredRides.filter(r => 
        moment(r.created_date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
      );
      const dayTransactions = filteredTransactions.filter(t => 
        moment(t.created_date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD') &&
        t.status === 'completed'
      );
      
      data.push({
        date: date.format('MMM DD'),
        revenue: dayTransactions.reduce((sum, t) => sum + (t.amount || 0), 0),
        rides: dayRides.filter(r => r.status === 'completed').length,
        cancelled: dayRides.filter(r => r.status === 'cancelled').length,
        users: users.filter(u => moment(u.created_date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')).length,
      });
    }
    
    return data;
  };

  const dailyData = getDailyData();

  // Ride status distribution
  const statusData = [
    { name: 'Completed', value: filteredRides.filter(r => r.status === 'completed').length, color: '#10B981' },
    { name: 'Cancelled', value: filteredRides.filter(r => r.status === 'cancelled').length, color: '#EF4444' },
    { name: 'In Progress', value: filteredRides.filter(r => r.status === 'in_progress').length, color: '#3B82F6' },
    { name: 'Requested', value: filteredRides.filter(r => r.status === 'requested').length, color: '#F59E0B' },
  ].filter(item => item.value > 0);

  // Payment methods distribution
  const paymentData = [
    { name: 'Cash', value: filteredRides.filter(r => r.payment_method === 'cash').length, color: '#10B981' },
    { name: 'Card', value: filteredRides.filter(r => r.payment_method === 'card').length, color: '#3B82F6' },
    { name: 'Wallet', value: filteredRides.filter(r => r.payment_method === 'wallet').length, color: '#8B5CF6' },
  ].filter(item => item.value > 0);

  // Top drivers
  const driverStats = drivers.map(driver => {
    const driverRides = filteredRides.filter(r => r.driver_email === driver.user_email && r.status === 'completed');
    const driverRevenue = driverRides.reduce((sum, r) => sum + (r.agreed_price || 0), 0);
    return {
      email: driver.user_email,
      rides: driverRides.length,
      revenue: driverRevenue,
      rating: driver.rating || 0,
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

  // Export to CSV
  const exportToCSV = () => {
    const csvData = [
      ['Date', 'Revenue', 'Rides', 'Cancelled', 'New Users'],
      ...dailyData.map(d => [d.date, d.revenue, d.rides, d.cancelled, d.users])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `joltcab-analytics-${moment().format('YYYY-MM-DD')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Advanced Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Comprehensive business insights and reports</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportToCSV} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
            <p className="text-sm text-gray-600 mt-1">Total Revenue</p>
            <p className="text-xs text-green-600 mt-2">↑ {timeRange}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{completedRides}</p>
            <p className="text-sm text-gray-600 mt-1">Completed Rides</p>
            <p className="text-xs text-gray-500 mt-2">{cancelledRides} cancelled</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">${avgRideValue.toFixed(2)}</p>
            <p className="text-sm text-gray-600 mt-1">Avg. Ride Value</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{completionRate.toFixed(1)}%</p>
            <p className="text-sm text-gray-600 mt-1">Completion Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Revenue & Rides Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRides" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="left" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue ($)" />
              <Area yAxisId="right" type="monotone" dataKey="rides" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRides)" name="Rides" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ride Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Ride Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={paymentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Drivers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            Top Performing Drivers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {driverStats.map((driver, index) => (
              <div
                key={driver.email}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{driver.email}</p>
                    <p className="text-sm text-gray-600">{driver.rides} rides completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">${driver.revenue.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">⭐ {driver.rating.toFixed(1)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}