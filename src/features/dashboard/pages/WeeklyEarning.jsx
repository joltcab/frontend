import { useState, useEffect } from 'react';
import { CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable } from '@/components/ui';

export default function WeeklyEarning() {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    try {
      const response = await adminService.getProviderWeeklyEarnings();
      setEarnings(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load weekly earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'week_start',
      label: 'Week',
      sortable: true,
      render: (value, earning) => (
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">
              {new Date(value).toLocaleDateString()} - {new Date(earning.week_end).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-500">Week Period</p>
          </div>
        </div>
      )
    },
    {
      key: 'total_trips',
      label: 'Total Trips',
      sortable: true,
      render: (value) => <span className="font-semibold text-gray-900">{value}</span>
    },
    {
      key: 'total_earnings',
      label: 'Total Earnings',
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-gray-900">${value?.toFixed(2)}</span>
      )
    },
    {
      key: 'platform_commission',
      label: 'Platform Commission',
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
      key: 'avg_per_trip',
      label: 'Avg/Trip',
      sortable: false,
      render: (_, earning) => {
        const avg = earning.total_earnings / earning.total_trips;
        return <span className="text-sm text-gray-700">${avg.toFixed(2)}</span>;
      }
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading weekly earnings...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Weekly Earning</h1>
        <p className="text-gray-600 mt-1">Weekly breakdown of earnings and trips</p>
      </div>

      <DataTable
        columns={columns}
        data={earnings}
        pageSize={15}
        searchPlaceholder="Search by week..."
        emptyMessage="No weekly earnings found"
        defaultSort={{ key: 'week_start', direction: 'desc' }}
      />
    </div>
  );
}
