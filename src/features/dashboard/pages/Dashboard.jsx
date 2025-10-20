import { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  TruckIcon, 
  MapIcon, 
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { StatCard, Card, CardHeader, CardTitle, CardContent, Badge, DataTable } from '@/components/ui';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDrivers: 0,
    todayTrips: 0,
    totalRevenue: 0,
    activeTrips: 0,
    pendingDrivers: 0,
    monthlyGrowth: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentTrips, setRecentTrips] = useState([]);
  const [activeDrivers, setActiveDrivers] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await adminService.getDashboardStats();
      const data = response.data?.data || response.data || {};
      
      setStats({
        totalUsers: data.totalUsers || 0,
        totalDrivers: data.totalDrivers || 0,
        todayTrips: data.todayTrips || 0,
        totalRevenue: data.totalRevenue || 0,
        activeTrips: data.activeTrips || 0,
        pendingDrivers: data.pendingDrivers || 0,
        monthlyGrowth: data.monthlyGrowth || 0,
        completionRate: data.completionRate || 0
      });
      setRecentTrips(data.recentTrips || []);
      setActiveDrivers(data.activeDrivers || []);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const tripColumns = [
    { key: 'id', label: 'Trip ID' },
    { key: 'user', label: 'User' },
    { key: 'driver', label: 'Driver' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <Badge variant={value === 'completed' ? 'success' : 'info'}>
          {value}
        </Badge>
      )
    },
    { key: 'amount', label: 'Amount' },
    { key: 'time', label: 'Time' }
  ];

  const driverColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'trips', label: 'Trips Today' },
    { key: 'rating', label: 'Rating', render: (value) => `⭐ ${value}` },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <Badge variant={value === 'online' ? 'success' : 'warning'}>
          {value}
        </Badge>
      )
    },
    { key: 'earnings', label: 'Earnings' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          change="+8.2% from last month"
          trend="up"
          icon={<UserGroupIcon className="w-6 h-6" />}
        />
        <StatCard
          title="Active Drivers"
          value={stats.totalDrivers.toLocaleString()}
          change="+5.4% from last month"
          trend="up"
          icon={<TruckIcon className="w-6 h-6" />}
        />
        <StatCard
          title="Today's Trips"
          value={stats.todayTrips.toLocaleString()}
          change="+12.5% from yesterday"
          trend="up"
          icon={<MapIcon className="w-6 h-6" />}
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change="+18.3% from last month"
          trend="up"
          icon={<BanknotesIcon className="w-6 h-6" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Trips</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeTrips}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingDrivers}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Growth</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.monthlyGrowth}%</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completionRate}%</p>
              </div>
              <div className="w-10 h-10 bg-joltcab-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-joltcab-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Trips</h2>
            <a href="/admin/dashboard/trips" className="text-sm text-joltcab-600 hover:text-joltcab-700">
              View all
            </a>
          </div>
          <DataTable
            columns={tripColumns}
            data={recentTrips}
            pageSize={5}
            searchable={false}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Active Drivers</h2>
            <a href="/admin/dashboard/drivers" className="text-sm text-joltcab-600 hover:text-joltcab-700">
              View all
            </a>
          </div>
          <DataTable
            columns={driverColumns}
            data={activeDrivers}
            pageSize={5}
            searchable={false}
          />
        </div>
      </div>
    </div>
  );
}
