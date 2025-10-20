import { useState, useEffect } from 'react';
import { EyeIcon, MapPinIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Button, Badge } from '@/components/ui';

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const response = await adminService.getTrips();
      setTrips(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTrips = () => {
    let filtered = [...trips];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.trip_status === statusFilter);
    }

    if (dateFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(t => t.created_at?.startsWith(today));
    } else if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(t => new Date(t.created_at) >= weekAgo);
    }

    return filtered;
  };

  const getStatusVariant = (status) => {
    const variants = {
      completed: 'success',
      active: 'primary',
      cancelled: 'danger',
      scheduled: 'warning',
      pending: 'default'
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
      render: (value) => value ? `${value.first_name} ${value.last_name}` : 'N/A'
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
      key: 'created_at',
      label: 'Date',
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
      render: (_, trip) => (
        <Button
          variant="ghost"
          size="xs"
          onClick={() => console.log('View trip:', trip._id)}
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
        <div className="text-gray-500">Loading trips...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trip Requests</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all trip requests</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={getFilteredTrips()}
        pageSize={10}
        searchPlaceholder="Search by trip ID, customer, or driver..."
        emptyMessage="No trips found"
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
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
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
            {(statusFilter !== 'all' || dateFilter !== 'all') && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  setStatusFilter('all');
                  setDateFilter('all');
                }}
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
