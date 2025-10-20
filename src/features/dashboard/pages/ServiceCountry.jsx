import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Button, Badge, Modal, Input, ConfirmModal } from '@/components/ui';

export default function ServiceCountry() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({ isOpen: false, country: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, country: null });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      const response = await adminService.getCountries();
      setCountries(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    if (!formData.name || !formData.code) {
      alert('Please fill all required fields');
      return;
    }

    setSaving(true);
    try {
      if (editModal.country) {
        await adminService.updateCountry(editModal.country._id, formData);
      } else {
        await adminService.createCountry(formData);
      }
      setEditModal({ isOpen: false, country: null });
      await loadCountries();
    } catch (error) {
      console.error('Failed to save country:', error);
      alert('Failed to save country. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminService.deleteCountry(deleteModal.country._id);
      setDeleteModal({ isOpen: false, country: null });
      await loadCountries();
    } catch (error) {
      console.error('Failed to delete country:', error);
      alert('Failed to delete country. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Country',
      sortable: true,
      render: (value, country) => (
        <div className="flex items-center gap-2">
          <GlobeAltIcon className="w-5 h-5 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">Code: {country.code}</p>
          </div>
        </div>
      )
    },
    {
      key: 'phone_code',
      label: 'Phone Code',
      sortable: true,
      render: (value) => <span className="text-sm text-gray-700">{value}</span>
    },
    {
      key: 'currency',
      label: 'Currency',
      sortable: true,
      render: (value, country) => (
        <span className="text-sm text-gray-700">{country.currency_symbol} {value}</span>
      )
    },
    {
      key: 'cities_count',
      label: 'Cities',
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
      render: (_, country) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setEditModal({ isOpen: true, country })}
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setDeleteModal({ isOpen: true, country })}
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
        <div className="text-gray-500">Loading countries...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Countries</h1>
          <p className="text-gray-600 mt-1">Manage service countries</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setEditModal({ isOpen: true, country: null })}
        >
          <PlusIcon className="w-4 h-4" />
          Add Country
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={countries}
        pageSize={10}
        searchPlaceholder="Search by country name or code..."
        emptyMessage="No countries found"
      />

      <CountryModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, country: null })}
        onSave={handleSave}
        country={editModal.country}
        saving={saving}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, country: null })}
        onConfirm={handleDelete}
        title="Delete Country"
        message={`Are you sure you want to delete "${deleteModal.country?.name}"? This will affect all cities in this country.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}

function CountryModal({ isOpen, onClose, onSave, country, saving }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    phone_code: '',
    currency: '',
    currency_symbol: '',
    is_active: true,
  });

  useEffect(() => {
    if (country) {
      setFormData({
        name: country.name || '',
        code: country.code || '',
        phone_code: country.phone_code || '',
        currency: country.currency || '',
        currency_symbol: country.currency_symbol || '',
        is_active: country.is_active ?? true,
      });
    } else {
      setFormData({
        name: '',
        code: '',
        phone_code: '',
        currency: '',
        currency_symbol: '',
        is_active: true,
      });
    }
  }, [country, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={country ? 'Edit Country' : 'Add Country'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Country Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., United States"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Country Code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            placeholder="e.g., US"
            maxLength={2}
            required
          />

          <Input
            label="Phone Code"
            value={formData.phone_code}
            onChange={(e) => setFormData({ ...formData, phone_code: e.target.value })}
            placeholder="e.g., +1"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Currency"
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value.toUpperCase() })}
            placeholder="e.g., USD"
            maxLength={3}
            required
          />

          <Input
            label="Currency Symbol"
            value={formData.currency_symbol}
            onChange={(e) => setFormData({ ...formData, currency_symbol: e.target.value })}
            placeholder="e.g., $"
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
            {saving ? 'Saving...' : country ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
