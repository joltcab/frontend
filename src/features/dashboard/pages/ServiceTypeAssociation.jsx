import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, LinkIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Button, Badge, Modal, ConfirmModal } from '@/components/ui';

export default function ServiceTypeAssociation() {
  const [associations, setAssociations] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, association: null });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [associationsData, typesData, citiesData] = await Promise.all([
        adminService.getCityServicePricing(),
        adminService.getServiceTypes(),
        adminService.getCities()
      ]);
      
      setAssociations(associationsData.data?.data || []);
      setServiceTypes(typesData.data?.data || []);
      setCities(citiesData.data?.data || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    if (!formData.service_type_id || !formData.city_id) {
      alert('Please fill all required fields');
      return;
    }

    setSaving(true);
    try {
      await adminService.createCityServicePricing(formData);
      setAddModal(false);
      await loadData();
    } catch (error) {
      console.error('Failed to save association:', error);
      alert('Failed to save association. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminService.deleteCityServicePricing(deleteModal.association._id);
      setDeleteModal({ isOpen: false, association: null });
      await loadData();
    } catch (error) {
      console.error('Failed to delete association:', error);
      alert('Failed to delete association. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'service_type',
      label: 'Service Type',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900">{value?.name || 'N/A'}</span>
      )
    },
    {
      key: 'city',
      label: 'City',
      sortable: true,
      render: (value) => (
        <span className="text-gray-700">{value?.name || 'N/A'}</span>
      )
    },
    {
      key: 'base_fare',
      label: 'Base Fare',
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-gray-900">${value?.toFixed(2)}</span>
      )
    },
    {
      key: 'per_km_charge',
      label: 'Per KM',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-700">${value?.toFixed(2)}</span>
      )
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
      render: (_, association) => (
        <Button
          variant="ghost"
          size="xs"
          onClick={() => setDeleteModal({ isOpen: true, association })}
        >
          <TrashIcon className="w-4 h-4" />
        </Button>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading associations...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Type And City Association</h1>
          <p className="text-gray-600 mt-1">Link service types to specific cities</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setAddModal(true)}
        >
          <PlusIcon className="w-4 h-4" />
          Add Association
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={associations}
        pageSize={10}
        searchPlaceholder="Search by service type or city..."
        emptyMessage="No associations found"
      />

      <AssociationModal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        onSave={handleSave}
        serviceTypes={serviceTypes}
        cities={cities}
        saving={saving}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, association: null })}
        onConfirm={handleDelete}
        title="Delete Association"
        message="Are you sure you want to delete this service type and city association?"
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}

function AssociationModal({ isOpen, onClose, onSave, serviceTypes, cities, saving }) {
  const [formData, setFormData] = useState({
    service_type_id: '',
    city_id: '',
    base_fare: '',
    per_km_charge: '',
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        service_type_id: '',
        city_id: '',
        base_fare: '',
        per_km_charge: '',
      });
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Service Type Association"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Type
          </label>
          <select
            value={formData.service_type_id}
            onChange={(e) => setFormData({ ...formData, service_type_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-joltcab-400"
            required
          >
            <option value="">Select Service Type</option>
            {serviceTypes.map(type => (
              <option key={type._id} value={type._id}>{type.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <select
            value={formData.city_id}
            onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-joltcab-400"
            required
          >
            <option value="">Select City</option>
            {cities.map(city => (
              <option key={city._id} value={city._id}>{city.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Fare ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.base_fare}
              onChange={(e) => setFormData({ ...formData, base_fare: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-joltcab-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Per KM Charge ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.per_km_charge}
              onChange={(e) => setFormData({ ...formData, per_km_charge: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-joltcab-400"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
