import { useState, useEffect } from 'react';
import { EyeIcon, MapPinIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Button, Badge } from '@/components/ui';

export default function TodayRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await adminService.getTrips({ date: today });
      setRequests(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load today requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredRequests = () => {
    if (statusFilter === 'all') return requests;
    return requests.filter(r => r.trip_status === statusFilter);
  };

  const getStatusVariant = (status) => {
    const variants = {
      completed: 'success',
      active: 'primary',
      cancelled: 'danger',
      pending: 'warning',
    };
    return variants[status] || 'default';
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
      render: (value) => value ? `${value.first_name} ${value.last_name}` : 'Searching...'
    },
    {
      key: 'pickup_location',
      label: 'Pickup',
      render: (value) => (
        <div className="flex items-start gap-1 max-w-xs">
          <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-600 truncate">{value?.address || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'trip_status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <Badge variant={getStatusVariant(value)}>
          {value ? value.charAt(0).toUpperCase() + value.slice(1) : 'N/A'}
        </Badge>
      )
    },
    {
      key: 'total_after_surge_fare',
      label: 'Fare',
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-gray-900">${value?.toFixed(2) || '0.00'}</span>
      )
    },
    {
      key: 'created_at',
      label: 'Time',
      sortable: true,
      render: (value) => value ? (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <ClockIcon className="w-4 h-4" />
          {new Date(value).toLocaleTimeString()}
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
        <div className="text-gray-500">Loading today's requests...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Today's Requests</h1>
          <p className="text-gray-600 mt-1">View all trip requests for today</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={getFilteredRequests()}
        pageSize={10}
        searchPlaceholder="Search by trip ID, customer, or driver..."
        emptyMessage="No requests found for today"
        defaultSort={{ key: 'created_at', direction: 'desc' }}
        filters={
          <>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-joltcab-400"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            {statusFilter !== 'all' && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setStatusFilter('all')}
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
