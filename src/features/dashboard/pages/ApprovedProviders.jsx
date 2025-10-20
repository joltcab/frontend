import { useState, useEffect } from 'react';
import { EyeIcon, PhoneIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Button, Badge } from '@/components/ui';
import DriverDetailModal from '../components/DriverDetailModal';

export default function ApprovedProviders() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const data = await adminService.getProviders({ approval_status: 'approved' });
      setProviders(data.providers || generateMockProviders());
    } catch (error) {
      console.error('Failed to load approved providers:', error);
      setProviders(generateMockProviders());
    } finally {
      setLoading(false);
    }
  };

  const generateMockProviders = () => [
    {
      _id: '1',
      first_name: 'Robert',
      last_name: 'Taylor',
      email: 'robert.taylor@example.com',
      phone: '+1 (555) 333-4444',
      vehicle_type: 'Sedan',
      rating: 4.7,
      total_trips: 215,
      is_active: true,
      is_approved: true,
      approved_at: '2024-08-15T10:00:00Z',
      documents_verified: true
    },
    {
      _id: '2',
      first_name: 'Linda',
      last_name: 'Martinez',
      email: 'linda.martinez@example.com',
      phone: '+1 (555) 444-5555',
      vehicle_type: 'SUV',
      rating: 4.9,
      total_trips: 428,
      is_active: false,
      is_approved: true,
      approved_at: '2024-07-20T14:30:00Z',
      documents_verified: true
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
      key: 'is_active',
      label: 'Online',
      sortable: true,
      render: (value) => (
        <Badge variant={value ? 'success' : 'default'}>
          {value ? 'Online' : 'Offline'}
        </Badge>
      )
    },
    {
      key: 'documents_verified',
      label: 'Docs',
      sortable: true,
      render: (value) => (
        <Badge variant={value ? 'success' : 'warning'}>
          {value ? 'Verified' : 'Pending'}
        </Badge>
      )
    },
    {
      key: 'approved_at',
      label: 'Approved',
      sortable: true,
      render: (value) => value ? (
        <div className="text-xs text-gray-600">
          {new Date(value).toLocaleDateString()}
        </div>
      ) : 'N/A'
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
        <div className="text-gray-500">Loading approved providers...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Approved Providers</h1>
          <p className="text-gray-600 mt-1">All approved and verified service providers</p>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircleIcon className="w-6 h-6 text-green-600" />
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Approved</p>
            <p className="text-2xl font-bold text-green-600">{providers.length}</p>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={providers}
        pageSize={10}
        searchPlaceholder="Search by name, phone, or email..."
        emptyMessage="No approved providers found"
        defaultSort={{ key: 'approved_at', direction: 'desc' }}
      />

      <DriverDetailModal
        driver={selectedDriver}
        isOpen={!!selectedDriver}
        onClose={() => setSelectedDriver(null)}
      />
    </div>
  );
}
