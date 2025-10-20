import { useState, useEffect } from 'react';
import { CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Badge } from '@/components/ui';

export default function DailyEarning() {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    try {
      const response = await adminService.getProviderDailyEarnings();
      setEarnings(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load daily earnings:', error);
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
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-gray-900">
            {new Date(value).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
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
      key: 'cash_trips',
      label: 'Cash',
      sortable: true,
      render: (value, earning) => (
        <div className="text-sm">
          <span className="font-medium">{value}</span>
          <span className="text-gray-500"> trips</span>
        </div>
      )
    },
    {
      key: 'card_trips',
      label: 'Card',
      sortable: true,
      render: (value) => (
        <div className="text-sm">
          <span className="font-medium">{value}</span>
          <span className="text-gray-500"> trips</span>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading daily earnings...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Daily Earning</h1>
        <p className="text-gray-600 mt-1">Daily breakdown of earnings and trips</p>
      </div>

      <DataTable
        columns={columns}
        data={earnings}
        pageSize={15}
        searchPlaceholder="Search by date..."
        emptyMessage="No daily earnings found"
        defaultSort={{ key: 'date', direction: 'desc' }}
      />
    </div>
  );
}
