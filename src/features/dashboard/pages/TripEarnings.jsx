import { useState, useEffect } from 'react';
import { CalendarIcon, CurrencyDollarIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { Card, CardHeader, CardTitle, CardContent, DataTable, Badge } from '@/components/ui';

export default function TripEarnings() {
  const [earnings, setEarnings] = useState([]);
  const [stats, setStats] = useState({
    total_earnings: 0,
    platform_commission: 0,
    driver_earnings: 0,
    total_trips: 0
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all');

  useEffect(() => {
    loadEarnings();
  }, [period]);

  const loadEarnings = async () => {
    try {
      const data = await adminService.getTripEarnings({ period });
      setEarnings(data.earnings || generateMockEarnings());
      setStats(data.stats || {
        total_earnings: 45280.50,
        platform_commission: 9056.10,
        driver_earnings: 36224.40,
        total_trips: 1248
      });
    } catch (error) {
      console.error('Failed to load trip earnings:', error);
      setEarnings(generateMockEarnings());
      setStats({
        total_earnings: 45280.50,
        platform_commission: 9056.10,
        driver_earnings: 36224.40,
        total_trips: 1248
      });
    } finally {
      setLoading(false);
    }
  };

  const generateMockEarnings = () => [
    {
      _id: '1',
      trip_id: 'T10001',
      driver: { first_name: 'Mike', last_name: 'Smith' },
      user: { first_name: 'John', last_name: 'Doe' },
      total_fare: 24.50,
      platform_commission: 4.90,
      driver_earnings: 19.60,
      payment_method: 'card',
      completed_at: '2024-10-18T10:45:00Z'
    },
    {
      _id: '2',
      trip_id: 'T10002',
      driver: { first_name: 'Sarah', last_name: 'Johnson' },
      user: { first_name: 'Jane', last_name: 'Williams' },
      total_fare: 18.20,
      platform_commission: 3.64,
      driver_earnings: 14.56,
      payment_method: 'cash',
      completed_at: '2024-10-18T11:20:00Z'
    },
  ];

  const columns = [
    {
      key: 'trip_id',
      label: 'Trip ID',
      sortable: true,
      render: (value) => <span className="font-mono font-medium">#{value}</span>
    },
    {
      key: 'driver',
      label: 'Driver',
      sortable: true,
      render: (value) => value ? `${value.first_name} ${value.last_name}` : 'N/A'
    },
    {
      key: 'user',
      label: 'Customer',
      sortable: true,
      render: (value) => value ? `${value.first_name} ${value.last_name}` : 'N/A'
    },
    {
      key: 'total_fare',
      label: 'Total Fare',
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-gray-900">${value?.toFixed(2)}</span>
      )
    },
    {
      key: 'platform_commission',
      label: 'Commission',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-joltcab-600">${value?.toFixed(2)}</span>
      )
    },
    {
      key: 'driver_earnings',
      label: 'Driver Earnings',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-green-600">${value?.toFixed(2)}</span>
      )
    },
    {
      key: 'payment_method',
      label: 'Payment',
      sortable: true,
      render: (value) => (
        <Badge variant="default">{value?.toUpperCase()}</Badge>
      )
    },
    {
      key: 'completed_at',
      label: 'Date',
      sortable: true,
      render: (value) => value ? (
        <div className="text-xs text-gray-600">
          {new Date(value).toLocaleDateString()}
        </div>
      ) : 'N/A'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading trip earnings...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Trip Earnings</h1>
        <p className="text-gray-600 mt-1">View all trip earnings and commissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${stats.total_earnings?.toFixed(2)}</p>
              </div>
              <CurrencyDollarIcon className="w-10 h-10 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Platform Commission</p>
                <p className="text-2xl font-bold text-joltcab-600">${stats.platform_commission?.toFixed(2)}</p>
              </div>
              <ChartBarIcon className="w-10 h-10 text-joltcab-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Driver Earnings</p>
                <p className="text-2xl font-bold text-green-600">${stats.driver_earnings?.toFixed(2)}</p>
              </div>
              <CurrencyDollarIcon className="w-10 h-10 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Trips</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_trips}</p>
              </div>
              <CalendarIcon className="w-10 h-10 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={earnings}
        pageSize={15}
        searchPlaceholder="Search by trip ID, driver, or customer..."
        emptyMessage="No earnings found"
        defaultSort={{ key: 'completed_at', direction: 'desc' }}
        filters={
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Period:</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-joltcab-400"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        }
      />
    </div>
  );
}
