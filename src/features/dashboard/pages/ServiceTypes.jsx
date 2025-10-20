import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, TruckIcon, PhotoIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Button, Badge, ConfirmModal, Modal, Input, Textarea } from '@/components/ui';

export default function ServiceTypes() {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, service: null });
  const [editModal, setEditModal] = useState({ isOpen: false, service: null });
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    service_category: 'Normal',
    is_default: false,
    base_fare: '',
    per_km_charge: '',
    per_min_charge: '',
    capacity: '4',
    type_image: null,
    map_pin_image: null,
    is_active: true
  });
  const [imagePreview, setImagePreview] = useState({ type_image: null, map_pin_image: null });

  useEffect(() => {
    loadServiceTypes();
  }, []);

  const loadServiceTypes = async () => {
    try {
      const data = await adminService.getServiceTypes();
      setServiceTypes(data.service_types || []);
    } catch (error) {
      console.error('Failed to load service types:', error);
      setServiceTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminService.deleteServiceType(deleteModal.service._id);
      setServiceTypes(serviceTypes.filter(s => s._id !== deleteModal.service._id));
      setDeleteModal({ isOpen: false, service: null });
    } catch (error) {
      console.error('Failed to delete service type:', error);
      alert('Failed to delete service type. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (service) => {
    setFormData({
      name: service.name,
      description: service.description || '',
      service_category: service.service_category || 'Normal',
      is_default: service.is_default || false,
      base_fare: service.base_fare?.toString() || '',
      per_km_charge: service.per_km_charge?.toString() || '',
      per_min_charge: service.per_min_charge?.toString() || '',
      capacity: service.capacity?.toString() || '4',
      type_image: null,
      map_pin_image: null,
      is_active: service.is_active ?? true
    });
    setImagePreview({
      type_image: service.type_image || null,
      map_pin_image: service.map_pin_image || null
    });
    setEditModal({ isOpen: true, service });
  };

  const handleAddNew = () => {
    setFormData({
      name: '',
      description: '',
      service_category: 'Normal',
      is_default: false,
      base_fare: '',
      per_km_charge: '',
      per_min_charge: '',
      capacity: '4',
      type_image: null,
      map_pin_image: null,
      is_active: true
    });
    setImagePreview({ type_image: null, map_pin_image: null });
    setEditModal({ isOpen: true, service: null });
  };

  const handleImageChange = (field, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
      setFormData(prev => ({ ...prev, [field]: file }));
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a service name');
      return;
    }

    const baseFare = parseFloat(formData.base_fare);
    const perKmCharge = parseFloat(formData.per_km_charge);
    const perMinCharge = parseFloat(formData.per_min_charge);
    const capacity = parseInt(formData.capacity);

    if (isNaN(baseFare) || baseFare < 0) {
      alert('Please enter a valid base fare');
      return;
    }
    if (isNaN(perKmCharge) || perKmCharge < 0) {
      alert('Please enter a valid price per km');
      return;
    }
    if (isNaN(perMinCharge) || perMinCharge < 0) {
      alert('Please enter a valid price per minute');
      return;
    }
    if (isNaN(capacity) || capacity < 1) {
      alert('Please enter a valid capacity (at least 1)');
      return;
    }

    setSaving(true);
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('service_category', formData.service_category);
      submitData.append('is_default', formData.is_default);
      submitData.append('base_fare', baseFare);
      submitData.append('per_km_charge', perKmCharge);
      submitData.append('per_min_charge', perMinCharge);
      submitData.append('capacity', capacity);
      submitData.append('is_active', formData.is_active);

      if (formData.type_image instanceof File) {
        submitData.append('type_image', formData.type_image);
      }
      if (formData.map_pin_image instanceof File) {
        submitData.append('map_pin_image', formData.map_pin_image);
      }

      if (editModal.service) {
        await adminService.updateServiceType(editModal.service._id, submitData);
      } else {
        await adminService.createServiceType(submitData);
      }
      
      await loadServiceTypes();
      setEditModal({ isOpen: false, service: null });
    } catch (error) {
      console.error('Failed to save service type:', error);
      alert('Failed to save service type. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { 
      key: 'name', 
      label: 'Service Type',
      sortable: true,
      render: (value, service) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {service.type_image ? (
              <img src={service.type_image} alt={value} className="w-full h-full object-contain" />
            ) : (
              <TruckIcon className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{service.description}</p>
          </div>
        </div>
      )
    },
    {
      key: 'service_category',
      label: 'Service Type',
      sortable: true,
      render: (value) => (
        <Badge variant={value === 'Business' ? 'primary' : value === 'Visitor' ? 'warning' : 'default'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'is_active',
      label: 'Business',
      sortable: true,
      render: (value) => (
        <Badge variant={value ? 'success' : 'default'} size="sm">
          {value ? 'ON' : 'OFF'}
        </Badge>
      )
    },
    {
      key: 'is_default',
      label: 'Default Selected',
      sortable: true,
      render: (value) => (
        <span className="text-sm font-medium text-gray-700">
          {value ? 'Yes' : 'No'}
        </span>
      )
    },
    { 
      key: 'capacity', 
      label: 'Capacity',
      sortable: true,
      render: (value) => <span className="text-sm text-gray-700">{value} passengers</span>
    },
    { 
      key: 'actions', 
      label: 'Actions',
      sortable: false,
      render: (_, service) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="xs"
            onClick={() => handleEdit(service)}
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="xs"
            onClick={() => setDeleteModal({ isOpen: true, service })}
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Types</h1>
          <p className="text-sm text-gray-500 mt-1">Configure ride service types and pricing</p>
        </div>
        <Button 
          variant="primary" 
          size="md"
          onClick={handleAddNew}
        >
          <PlusIcon className="w-4 h-4" />
          Add Type
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={serviceTypes}
        pageSize={10}
        searchPlaceholder="Search service types..."
        emptyMessage="No service types found"
        defaultSort={{ key: 'name', direction: 'asc' }}
      />

      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, service: null })}
        title={editModal.service ? 'Edit Type' : 'Add Type'}
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <Input
            label="Type Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., JoltCab Economy"
            required
          />
          
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="e.g., Servicio económico y confiable para viajes diarios"
            rows={3}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Type
            </label>
            <div className="flex gap-3">
              {['Visitor', 'Normal', 'Business'].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="service_category"
                    value={type}
                    checked={formData.service_category === type}
                    onChange={(e) => setFormData({ ...formData, service_category: e.target.value })}
                    className="w-4 h-4 text-joltcab-600 border-gray-300 focus:ring-joltcab-500"
                  />
                  <span className="text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_default"
              checked={formData.is_default}
              onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
              className="w-4 h-4 text-joltcab-600 border-gray-300 rounded focus:ring-joltcab-500"
            />
            <label htmlFor="is_default" className="text-sm font-medium text-gray-700">
              Default Selected
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Base Fare ($)"
              type="number"
              step="0.01"
              value={formData.base_fare}
              onChange={(e) => setFormData({ ...formData, base_fare: e.target.value })}
              placeholder="5.00"
              required
            />
            <Input
              label="Price per Km ($)"
              type="number"
              step="0.01"
              value={formData.per_km_charge}
              onChange={(e) => setFormData({ ...formData, per_km_charge: e.target.value })}
              placeholder="1.20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price per Minute ($)"
              type="number"
              step="0.01"
              value={formData.per_min_charge}
              onChange={(e) => setFormData({ ...formData, per_min_charge: e.target.value })}
              placeholder="0.30"
              required
            />
            <Input
              label="Capacity (passengers)"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              placeholder="4"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type Image
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 flex flex-col items-center px-4 py-6 bg-white border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-joltcab-500 transition-colors">
                <PhotoIcon className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Click to upload vehicle image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange('type_image', e.target.files[0])}
                  className="hidden"
                />
              </label>
              {imagePreview.type_image && (
                <div className="w-24 h-24 border rounded-lg overflow-hidden bg-gray-50">
                  <img src={imagePreview.type_image} alt="Type preview" className="w-full h-full object-contain" />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Map Pin Image
              <span className="text-xs text-gray-500 ml-2">(Aspect ratio 0.45:1)</span>
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 flex flex-col items-center px-4 py-6 bg-white border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-joltcab-500 transition-colors">
                <PhotoIcon className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Click to upload map pin</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange('map_pin_image', e.target.files[0])}
                  className="hidden"
                />
              </label>
              {imagePreview.map_pin_image && (
                <div className="w-24 h-16 border rounded-lg overflow-hidden bg-gray-50">
                  <img src={imagePreview.map_pin_image} alt="Pin preview" className="w-full h-full object-contain" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-joltcab-600 border-gray-300 rounded focus:ring-joltcab-500"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Business (Active)
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              size="md"
              onClick={() => setEditModal({ isOpen: false, service: null })}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              size="md"
              onClick={handleSave}
              loading={saving}
            >
              {editModal.service ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, service: null })}
        onConfirm={handleDelete}
        title="Delete Service Type"
        message={`Are you sure you want to delete "${deleteModal.service?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
