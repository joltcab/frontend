import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, MapPinIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Button, Badge, ConfirmModal, Modal, Input, Select } from '@/components/ui';

export default function Cities() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, city: null });
  const [editModal, setEditModal] = useState({ isOpen: false, city: null });
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    city_name: '',
    country_name: '',
    timezone: '',
    currency: 'USD',
    is_active: true
  });

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
    { _id: '1', city_name: 'New York', country_name: 'United States', timezone: 'America/New_York', currency: 'USD', is_active: true, providers_count: 245, users_count: 3456 },
    { _id: '2', city_name: 'Los Angeles', country_name: 'United States', timezone: 'America/Los_Angeles', currency: 'USD', is_active: true, providers_count: 189, users_count: 2789 },
    { _id: '3', city_name: 'Chicago', country_name: 'United States', timezone: 'America/Chicago', currency: 'USD', is_active: true, providers_count: 156, users_count: 2134 },
    { _id: '4', city_name: 'Miami', country_name: 'United States', timezone: 'America/New_York', currency: 'USD', is_active: true, providers_count: 98, users_count: 1567 },
    { _id: '5', city_name: 'Toronto', country_name: 'Canada', timezone: 'America/Toronto', currency: 'CAD', is_active: false, providers_count: 0, users_count: 0 },
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

  const handleEdit = (city) => {
    setFormData({
      city_name: city.city_name,
      country_name: city.country_name,
      timezone: city.timezone,
      currency: city.currency || 'USD',
      is_active: city.is_active
    });
    setEditModal({ isOpen: true, city });
  };

  const handleAddNew = () => {
    setFormData({
      city_name: '',
      country_name: '',
      timezone: '',
      currency: 'USD',
      is_active: true
    });
    setEditModal({ isOpen: true, city: null });
  };

  const handleSave = async () => {
    if (!formData.city_name.trim()) {
      alert('Please enter a city name');
      return;
    }
    if (!formData.country_name.trim()) {
      alert('Please enter a country name');
      return;
    }
    if (!formData.timezone) {
      alert('Please select a timezone');
      return;
    }
    if (!formData.currency) {
      alert('Please select a currency');
      return;
    }

    setSaving(true);
    try {
      const data = {
        city_name: formData.city_name.trim(),
        country_name: formData.country_name.trim(),
        timezone: formData.timezone,
        currency: formData.currency,
        is_active: formData.is_active
      };

      if (editModal.city) {
        await adminService.updateCity(editModal.city._id, data);
      } else {
        await adminService.createCity(data);
      }
      
      await loadCities();
      setEditModal({ isOpen: false, city: null });
    } catch (error) {
      console.error('Failed to save city:', error);
      alert('Failed to save city. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { 
      key: 'city_name', 
      label: 'City',
      sortable: true,
      render: (value, city) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <MapPinIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <GlobeAltIcon className="w-3 h-3" />
              {city.country_name}
            </p>
          </div>
        </div>
      )
    },
    { 
      key: 'timezone', 
      label: 'Timezone',
      sortable: true,
      render: (value) => <span className="text-sm text-gray-600">{value || 'Not set'}</span>
    },
    { 
      key: 'currency', 
      label: 'Currency',
      sortable: true,
      render: (value) => <span className="text-sm font-medium text-gray-700">{value || 'USD'}</span>
    },
    { 
      key: 'providers_count', 
      label: 'Providers',
      sortable: true,
      render: (value) => <span className="font-medium">{value || 0}</span>
    },
    { 
      key: 'users_count', 
      label: 'Users',
      sortable: true,
      render: (value) => <span className="font-medium">{value || 0}</span>
    },
    { 
      key: 'is_active', 
      label: 'Status',
      sortable: true,
      render: (value) => (
        <Badge variant={value ? 'success' : 'default'} size="sm">
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
            onClick={() => handleEdit(city)}
          >
            <PencilIcon className="w-4 h-4" />
            Edit
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cities Management</h1>
          <p className="text-sm text-gray-500 mt-1">Configure cities where your service operates</p>
        </div>
        <Button 
          variant="primary" 
          size="md"
          onClick={handleAddNew}
        >
          <PlusIcon className="w-4 h-4" />
          Add City
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={cities}
        pageSize={10}
        searchPlaceholder="Search cities..."
        emptyMessage="No cities found"
        defaultSort={{ key: 'city_name', direction: 'asc' }}
      />

      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, city: null })}
        title={editModal.city ? 'Edit City' : 'Add City'}
      >
        <div className="space-y-4">
          <Input
            label="City Name"
            value={formData.city_name}
            onChange={(e) => setFormData({ ...formData, city_name: e.target.value })}
            placeholder="e.g., New York"
            required
          />
          <Input
            label="Country"
            value={formData.country_name}
            onChange={(e) => setFormData({ ...formData, country_name: e.target.value })}
            placeholder="e.g., United States"
            required
          />
          <Select
            label="Timezone"
            value={formData.timezone}
            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
            required
          >
            <option value="">Select timezone</option>
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="America/Toronto">Toronto</option>
            <option value="Europe/London">London</option>
            <option value="Europe/Paris">Paris</option>
            <option value="Asia/Tokyo">Tokyo</option>
          </Select>
          <Select
            label="Currency"
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            required
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="CAD">CAD - Canadian Dollar</option>
            <option value="JPY">JPY - Japanese Yen</option>
          </Select>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-joltcab-600 border-gray-300 rounded focus:ring-joltcab-500"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              Active (service available in this city)
            </label>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              size="md"
              onClick={() => setEditModal({ isOpen: false, city: null })}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              size="md"
              onClick={handleSave}
              loading={saving}
            >
              {editModal.city ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, city: null })}
        onConfirm={handleDelete}
        title="Delete City"
        message={`Are you sure you want to delete "${deleteModal.city?.city_name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
