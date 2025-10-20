import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, MapIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Button, Badge, ConfirmModal } from '@/components/ui';

export default function AllCities() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, city: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const data = await adminService.getCities();
      setCities(data.cities || generateMockCities());
    } catch (error) {
      console.error('Failed to load cities:', error);
      setCities(generateMockCities());
    } finally {
      setLoading(false);
    }
  };

  const generateMockCities = () => [
    {
      _id: '1',
      name: 'New York',
      country: 'United States',
      timezone: 'America/New_York',
      currency: 'USD',
      providers_count: 385,
      users_count: 1247,
      is_active: true,
    },
    {
      _id: '2',
      name: 'Los Angeles',
      country: 'United States',
      timezone: 'America/Los_Angeles',
      currency: 'USD',
      providers_count: 290,
      users_count: 980,
      is_active: true,
    },
    {
      _id: '3',
      name: 'Chicago',
      country: 'United States',
      timezone: 'America/Chicago',
      currency: 'USD',
      providers_count: 150,
      users_count: 560,
      is_active: true,
    },
  ];

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminService.deleteCity(deleteModal.city._id);
      setCities(cities.filter(c => c._id !== deleteModal.city._id));
      setDeleteModal({ isOpen: false, city: null });
    } catch (error) {
      console.error('Failed to delete city:', error);
      alert('Failed to delete city. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'City',
      sortable: true,
      render: (value, city) => (
        <div className="flex items-center gap-2">
          <MapIcon className="w-4 h-4 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{city.country}</p>
          </div>
        </div>
      )
    },
    {
      key: 'timezone',
      label: 'Timezone',
      sortable: true,
      render: (value) => <span className="text-sm text-gray-600">{value}</span>
    },
    {
      key: 'currency',
      label: 'Currency',
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>
    },
    {
      key: 'providers_count',
      label: 'Providers',
      sortable: true,
      render: (value) => <span className="font-semibold text-gray-900">{value || 0}</span>
    },
    {
      key: 'users_count',
      label: 'Users',
      sortable: true,
      render: (value) => <span className="font-semibold text-gray-900">{value || 0}</span>
    },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <Badge variant={value ? 'success' : 'default'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, city) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => console.log('Edit city:', city._id)}
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setDeleteModal({ isOpen: true, city })}
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading cities...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Cities</h1>
          <p className="text-gray-600 mt-1">View all service cities on the map</p>
        </div>
        <Button variant="primary">
          <PlusIcon className="w-4 h-4" />
          Add City
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={cities}
        pageSize={10}
        searchPlaceholder="Search by city or country..."
        emptyMessage="No cities found"
        defaultSort={{ key: 'name', direction: 'asc' }}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, city: null })}
        onConfirm={handleDelete}
        title="Delete City"
        message={`Are you sure you want to delete ${deleteModal.city?.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
