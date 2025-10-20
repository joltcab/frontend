import { useState, useEffect } from 'react';
import { EyeIcon, MapPinIcon, CalendarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Button, Badge } from '@/components/ui';

export default function CompletedRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await adminService.getTrips({ status: 'completed' });
      setRequests(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load completed requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredRequests = () => {
    let filtered = [...requests];

    if (dateFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(t => t.completed_at?.startsWith(today));
    } else if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(t => new Date(t.completed_at) >= weekAgo);
    }

    return filtered;
  };

  const columns = [
    {
      key: 'unique_id',
      label: 'Trip ID',
      sortable: true,
      render: (value) => <span className="font-mono font-semibold">#{value}</span>
    },
    {
      key: 'user',
      label: 'Customer',
      sortable: true,
      render: (value) => value ? `${value.first_name} ${value.last_name}` : 'N/A'
    },
    {
      key: 'provider',
      label: 'Driver',
      sortable: true,
      render: (value) => value ? `${value.first_name} ${value.last_name}` : 'N/A'
    },
    {
      key: 'total_after_surge_fare',
      label: 'Amount',
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-gray-900">${value?.toFixed(2) || '0.00'}</span>
      )
    },
    {
      key: 'distance',
      label: 'Distance',
      sortable: true,
      render: (value) => value ? `${value.toFixed(1)} km` : 'N/A'
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (value) => value ? (
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">⭐</span>
          <span>{value}</span>
        </div>
      ) : 'No rating'
    },
    {
      key: 'completed_at',
      label: 'Completed',
      sortable: true,
      render: (value) => value ? (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <CalendarIcon className="w-4 h-4" />
          {new Date(value).toLocaleDateString()}
        </div>
      ) : 'N/A'
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, request) => (
        <Button
          variant="ghost"
          size="xs"
          onClick={() => console.log('View request:', request._id)}
        >
          <EyeIcon className="w-4 h-4" />
          View
        </Button>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading completed requests...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Completed Requests</h1>
          <p className="text-gray-600 mt-1">View all completed trip requests</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={getFilteredRequests()}
        pageSize={10}
        searchPlaceholder="Search by trip ID, customer, or driver..."
        emptyMessage="No completed requests found"
        defaultSort={{ key: 'completed_at', direction: 'desc' }}
        filters={
          <>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Period:</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-joltcab-400"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
              </select>
            </div>
            {dateFilter !== 'all' && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setDateFilter('all')}
              >
                Clear Filters
              </Button>
            )}
          </>
        }
      />
    </div>
  );
}
