import { useState, useEffect } from 'react';
import { EyeIcon, MapPinIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Button, Badge } from '@/components/ui';

export default function ScheduledRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await adminService.getTrips({ status: 'scheduled' });
      setRequests(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load scheduled requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    const variants = {
      scheduled: 'warning',
      pending: 'warning',
      confirmed: 'primary',
      cancelled: 'danger',
      completed: 'success',
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
      key: 'scheduled_time',
      label: 'Scheduled For',
      sortable: true,
      render: (value) => value ? (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-gray-700">
            <CalendarIcon className="w-4 h-4" />
            {new Date(value).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <ClockIcon className="w-4 h-4" />
            {new Date(value).toLocaleTimeString()}
          </div>
        </div>
      ) : 'N/A'
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
      label: 'Est. Fare',
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-gray-900">${value?.toFixed(2) || '0.00'}</span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, request) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => console.log('View request:', request._id)}
          >
            <EyeIcon className="w-4 h-4" />
            View
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading scheduled requests...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Scheduled Requests</h1>
          <p className="text-gray-600 mt-1">View all scheduled trip requests</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={requests}
        pageSize={10}
        searchPlaceholder="Search by trip ID or customer..."
        emptyMessage="No scheduled requests found"
        defaultSort={{ key: 'scheduled_time', direction: 'asc' }}
      />
    </div>
  );
}
