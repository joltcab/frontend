import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, MapPinIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Button, Badge, Modal, Input, Select, ConfirmModal } from '@/components/ui';

export default function ServiceCity() {
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({ isOpen: false, city: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, city: null });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadCities();
    loadCountries();
  }, []);

  const loadCities = async () => {
    try {
      const response = await adminService.getCities();
      setCities(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCountries = async () => {
    try {
      const response = await adminService.getCountries();
      setCountries(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load countries:', error);
    }
  };

  const handleSave = async (formData) => {
    if (!formData.name || !formData.country_id) {
      alert('Please fill all required fields');
      return;
    }

    setSaving(true);
    try {
      if (editModal.city) {
        await adminService.updateCity(editModal.city._id, formData);
      } else {
        await adminService.createCity(formData);
      }
      setEditModal({ isOpen: false, city: null });
      await loadCities();
    } catch (error) {
      console.error('Failed to save city:', error);
      alert('Failed to save city. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminService.deleteCity(deleteModal.city._id);
      setDeleteModal({ isOpen: false, city: null });
      await loadCities();
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
          <MapPinIcon className="w-4 h-4 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{city.country?.name || 'N/A'}</p>
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
            onClick={() => setEditModal({ isOpen: true, city })}
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
          <h1 className="text-3xl font-bold text-gray-900">Cities</h1>
          <p className="text-gray-600 mt-1">Manage service cities</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setEditModal({ isOpen: true, city: null })}
        >
          <PlusIcon className="w-4 h-4" />
          Add City
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={cities}
        pageSize={10}
        searchPlaceholder="Search by city name..."
        emptyMessage="No cities found"
      />

      <CityModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, city: null })}
        onSave={handleSave}
        city={editModal.city}
        countries={countries}
        saving={saving}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, city: null })}
        onConfirm={handleDelete}
        title="Delete City"
        message={`Are you sure you want to delete "${deleteModal.city?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}

function CityModal({ isOpen, onClose, onSave, city, countries, saving }) {
  const [formData, setFormData] = useState({
    name: '',
    country_id: '',
    timezone: '',
    currency: 'USD',
    is_active: true,
  });

  useEffect(() => {
    if (city) {
      setFormData({
        name: city.name || '',
        country_id: city.country?._id || '',
        timezone: city.timezone || '',
        currency: city.currency || 'USD',
        is_active: city.is_active ?? true,
      });
    } else {
      setFormData({
        name: '',
        country_id: countries[0]?._id || '',
        timezone: '',
        currency: 'USD',
        is_active: true,
      });
    }
  }, [city, isOpen, countries]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={city ? 'Edit City' : 'Add City'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="City Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., New York"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <select
            value={formData.country_id}
            onChange={(e) => setFormData({ ...formData, country_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-joltcab-400"
            required
          >
            <option value="">Select Country</option>
            {countries.map(country => (
              <option key={country._id} value={country._id}>{country.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Timezone"
            value={formData.timezone}
            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
            placeholder="e.g., America/New_York"
            required
          />

          <Input
            label="Currency"
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            placeholder="e.g., USD"
            maxLength={3}
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="w-4 h-4 text-joltcab-600 rounded focus:ring-joltcab-500"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
            Active
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : city ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
