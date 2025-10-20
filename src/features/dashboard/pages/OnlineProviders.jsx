import { useState, useEffect } from 'react';
import { EyeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Button, Badge } from '@/components/ui';
import DriverDetailModal from '../components/DriverDetailModal';

export default function OnlineProviders() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const data = await adminService.getOnlineProviders();
      setProviders(data.providers || generateMockProviders());
    } catch (error) {
      console.error('Failed to load online providers:', error);
      setProviders(generateMockProviders());
    } finally {
      setLoading(false);
    }
  };

  const generateMockProviders = () => [
    {
      _id: '1',
      first_name: 'James',
      last_name: 'Wilson',
      email: 'james.wilson@example.com',
      phone: '+1 (555) 111-2222',
      vehicle_type: 'Sedan',
      rating: 4.8,
      total_trips: 324,
      is_active: true,
      is_busy: false,
      current_location: { address: 'Times Square, New York' }
    },
    {
      _id: '2',
      first_name: 'Maria',
      last_name: 'Garcia',
      email: 'maria.garcia@example.com',
      phone: '+1 (555) 222-3333',
      vehicle_type: 'SUV',
      rating: 4.9,
      total_trips: 521,
      is_active: true,
      is_busy: true,
      current_location: { address: 'Central Park, New York' }
    },
  ];

  const columns = [
    {
      key: 'first_name',
      label: 'Driver',
      sortable: true,
      render: (value, provider) => (
        <div>
          <p className="font-medium text-gray-900">{value} {provider.last_name}</p>
          <p className="text-xs text-gray-500">{provider.email}</p>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <PhoneIcon className="w-4 h-4" />
          {value}
        </div>
      )
    },
    {
      key: 'vehicle_type',
      label: 'Vehicle',
      sortable: true,
      render: (value) => <span className="text-sm text-gray-700">{value}</span>
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">⭐</span>
          <span className="font-medium">{value?.toFixed(1) || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'total_trips',
      label: 'Trips',
      sortable: true,
      render: (value) => <span className="font-semibold text-gray-900">{value || 0}</span>
    },
    {
      key: 'is_busy',
      label: 'Status',
      sortable: true,
      render: (value, provider) => (
        <Badge variant={value ? 'warning' : 'success'}>
          {value ? 'On Trip' : 'Available'}
        </Badge>
      )
    },
    {
      key: 'current_location',
      label: 'Location',
      render: (value) => (
        <div className="flex items-start gap-1 max-w-xs">
          <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="text-xs text-gray-600 truncate">{value?.address || 'Unknown'}</span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, provider) => (
        <Button
          variant="ghost"
          size="xs"
          onClick={() => setSelectedDriver(provider)}
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
        <div className="text-gray-500">Loading online providers...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Online Providers</h1>
          <p className="text-gray-600 mt-1">All currently online service providers</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-gray-600">Online Now</p>
            <p className="text-2xl font-bold text-joltcab-600">{providers.length}</p>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={providers}
        pageSize={10}
        searchPlaceholder="Search by name, phone, or email..."
        emptyMessage="No online providers found"
        defaultSort={{ key: 'rating', direction: 'desc' }}
      />

      <DriverDetailModal
        driver={selectedDriver}
        isOpen={!!selectedDriver}
        onClose={() => setSelectedDriver(null)}
      />
    </div>
  );
}
