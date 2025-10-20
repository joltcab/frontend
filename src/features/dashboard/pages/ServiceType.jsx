import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Button, Badge, Modal, Input, ConfirmModal } from '@/components/ui';

export default function ServiceType() {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({ isOpen: false, type: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: null });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadServiceTypes();
  }, []);

  const loadServiceTypes = async () => {
    try {
      const response = await adminService.getServiceTypes();
      setServiceTypes(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load service types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    if (!formData.name || !formData.base_fare) {
      alert('Please fill all required fields');
      return;
    }

    setSaving(true);
    try {
      if (editModal.type) {
        await adminService.updateServiceType(editModal.type._id, formData);
      } else {
        await adminService.createServiceType(formData);
      }
      setEditModal({ isOpen: false, type: null });
      await loadServiceTypes();
    } catch (error) {
      console.error('Failed to save service type:', error);
      alert('Failed to save service type. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminService.deleteServiceType(deleteModal.type._id);
      setDeleteModal({ isOpen: false, type: null });
      await loadServiceTypes();
    } catch (error) {
      console.error('Failed to delete service type:', error);
      alert('Failed to delete service type. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Service Type',
      sortable: true,
      render: (value, type) => (
        <div className="flex items-center gap-3">
          {type.type_image && (
            <img src={type.type_image} alt={value} className="w-12 h-12 object-contain" />
          )}
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{type.description}</p>
          </div>
        </div>
      )
    },
    {
      key: 'service_category',
      label: 'Category',
      sortable: true,
      render: (value) => (
        <Badge variant={value === 'Business' ? 'primary' : value === 'Normal' ? 'success' : 'default'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'is_default',
      label: 'Default',
      sortable: true,
      render: (value) => value ? <Badge variant="warning">Default</Badge> : <span className="text-gray-400">-</span>
    },
    {
      key: 'base_fare',
      label: 'Base Fare',
      sortable: true,
      render: (value) => <span className="font-semibold text-gray-900">${value?.toFixed(2)}</span>
    },
    {
      key: 'per_km_charge',
      label: 'Per KM',
      sortable: true,
      render: (value) => <span className="text-sm text-gray-700">${value?.toFixed(2)}</span>
    },
    {
      key: 'capacity',
      label: 'Capacity',
      sortable: true,
      render: (value) => <span className="text-sm text-gray-700">{value} seats</span>
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
      render: (_, type) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setEditModal({ isOpen: true, type })}
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setDeleteModal({ isOpen: true, type })}
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
        <div className="text-gray-500">Loading service types...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Types</h1>
          <p className="text-gray-600 mt-1">Manage vehicle service types and pricing</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setEditModal({ isOpen: true, type: null })}
        >
          <PlusIcon className="w-4 h-4" />
          Add Service Type
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={serviceTypes}
        pageSize={10}
        searchPlaceholder="Search by service type name..."
        emptyMessage="No service types found"
      />

      <ServiceTypeModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, type: null })}
        onSave={handleSave}
        type={editModal.type}
        saving={saving}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, type: null })}
        onConfirm={handleDelete}
        title="Delete Service Type"
        message={`Are you sure you want to delete "${deleteModal.type?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}

function ServiceTypeModal({ isOpen, onClose, onSave, type, saving }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    service_category: 'Normal',
    is_default: false,
    base_fare: '',
    per_km_charge: '',
    per_min_charge: '',
    capacity: '',
    type_image: '',
    map_pin_image: '',
    is_active: true,
  });

  useEffect(() => {
    if (type) {
      setFormData({
        name: type.name || '',
        description: type.description || '',
        service_category: type.service_category || 'Normal',
        is_default: type.is_default || false,
        base_fare: type.base_fare || '',
        per_km_charge: type.per_km_charge || '',
        per_min_charge: type.per_min_charge || '',
        capacity: type.capacity || '',
        type_image: type.type_image || '',
        map_pin_image: type.map_pin_image || '',
        is_active: type.is_active ?? true,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        service_category: 'Normal',
        is_default: false,
        base_fare: '',
        per_km_charge: '',
        per_min_charge: '',
        capacity: '',
        type_image: '',
        map_pin_image: '',
        is_active: true,
      });
    }
  }, [type, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type ? 'Edit Service Type' : 'Add Service Type'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Type Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., JoltCab Economy"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Servicio económico y confiable para viajes diarios"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-joltcab-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.service_category}
            onChange={(e) => setFormData({ ...formData, service_category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-joltcab-500"
            required
          >
            <option value="Visitor">Visitor</option>
            <option value="Normal">Normal</option>
            <option value="Business">Business</option>
          </select>
        </div>

        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
          <input
            type="checkbox"
            id="is_default"
            checked={formData.is_default}
            onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
            className="w-4 h-4 text-joltcab-600 rounded focus:ring-joltcab-500"
          />
          <label htmlFor="is_default" className="text-sm font-medium text-gray-700">
            Default Selected
          </label>
          <span className="text-xs text-gray-500 ml-2">(Only one service type can be default)</span>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Pricing Configuration</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Base Fare ($)"
              type="number"
              step="0.01"
              value={formData.base_fare}
              onChange={(e) => setFormData({ ...formData, base_fare: e.target.value })}
              required
            />

            <Input
              label="Per KM Charge ($)"
              type="number"
              step="0.01"
              value={formData.per_km_charge}
              onChange={(e) => setFormData({ ...formData, per_km_charge: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <Input
              label="Per Minute Charge ($)"
              type="number"
              step="0.01"
              value={formData.per_min_charge}
              onChange={(e) => setFormData({ ...formData, per_min_charge: e.target.value })}
              required
            />

            <Input
              label="Passenger Capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Images</h3>
          
          <Input
            label="Type Image"
            type="url"
            value={formData.type_image}
            onChange={(e) => setFormData({ ...formData, type_image: e.target.value })}
            placeholder="https://example.com/car-image.png"
            helperText="URL to vehicle type image"
          />

          <Input
            label="Map Pin Image"
            type="url"
            value={formData.map_pin_image}
            onChange={(e) => setFormData({ ...formData, map_pin_image: e.target.value })}
            placeholder="https://example.com/pin-image.png"
            helperText="Aspect ratio 0.45:1 recommended"
            className="mt-4"
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
            {saving ? 'Saving...' : type ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
