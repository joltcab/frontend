import { useState, useEffect } from 'react';
import { CurrencyDollarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, CalendarIcon, UserIcon, TruckIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { StatCard, Card, CardHeader, CardTitle, CardContent, DataTable, Badge } from '@/components/ui';

export default function Earnings() {
  const [stats, setStats] = useState({
    todayEarnings: 0,
    weeklyEarnings: 0,
    monthlyEarnings: 0,
    totalEarnings: 0
  });
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [periodFilter, setPeriodFilter] = useState('daily');

  useEffect(() => {
    loadEarnings();
  }, [periodFilter]);

  const loadEarnings = async () => {
    try {
      const response = await adminService.getEarnings({ period: periodFilter });
      setStats(response.data?.stats || {
        todayEarnings: 0,
        weeklyEarnings: 0,
        monthlyEarnings: 0,
        totalEarnings: 0
      });
      setEarnings(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1 text-sm text-gray-700">
          <CalendarIcon className="w-4 h-4 text-gray-400" />
          {new Date(value).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'provider',
      label: 'Driver',
      sortable: true,
      render: (value) => value ? (
        <div className="flex items-center gap-2">
          <TruckIcon className="w-4 h-4 text-gray-400" />
          <span>{`${value.first_name} ${value.last_name}`}</span>
        </div>
      ) : 'N/A'
    },
    {
      key: 'trips',
      label: 'Trips',
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>
    },
    {
      key: 'total_fare',
      label: 'Total Fare',
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-gray-900">${value?.toFixed(2) || '0.00'}</span>
      )
    },
    {
      key: 'commission',
      label: 'Commission (20%)',
      sortable: true,
      render: (value) => (
        <span className="text-joltcab-700 font-medium">${value?.toFixed(2) || '0.00'}</span>
      )
    },
    {
      key: 'net_earnings',
      label: 'Driver Earnings',
      sortable: true,
      render: (value) => (
        <span className="font-semibold">${value?.toFixed(2) || '0.00'}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <Badge variant={value === 'paid' ? 'success' : 'warning'}>
          {value === 'paid' ? 'Paid' : 'Pending'}
        </Badge>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading earnings...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Earnings & Revenue</h1>
        <p className="text-gray-600 mt-1">Track platform earnings and driver payouts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Today's Earnings"
          value={`$${stats.todayEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={CurrencyDollarIcon}
          trend={{ value: '+12.5%', isPositive: true }}
        />
        <StatCard
          title="Weekly Earnings"
          value={`$${stats.weeklyEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={ArrowTrendingUpIcon}
          trend={{ value: '+8.2%', isPositive: true }}
        />
        <StatCard
          title="Monthly Earnings"
          value={`$${stats.monthlyEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={ArrowTrendingUpIcon}
          trend={{ value: '+15.7%', isPositive: true }}
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={CurrencyDollarIcon}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Earnings Report</CardTitle>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">View:</label>
              <select
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-joltcab-400"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={earnings}
            pageSize={10}
            searchPlaceholder="Search by driver name..."
            emptyMessage="No earnings data available"
            defaultSort={{ key: 'date', direction: 'desc' }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
