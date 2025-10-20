import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminService from '@/services/dashboardService';

export default function AddServiceTypeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serviceType, setServiceType] = useState({
    name: '',
    description: '',
    base_fare: 0,
    per_km_rate: 0,
    per_minute_rate: 0,
    minimum_fare: 0,
    capacity: 4,
    is_active: true,
  });

  useEffect(() => {
    if (id) {
      loadServiceType();
    }
  }, [id]);

  const loadServiceType = async () => {
    try {
      const data = await adminService.getServiceType(id);
      setServiceType(data);
    } catch (error) {
      console.error('Failed to load service type:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await adminService.updateServiceType(id, serviceType);
        alert('Service type updated successfully');
      } else {
        await adminService.createServiceType(serviceType);
        alert('Service type created successfully');
      }
      navigate('/admin/dashboard/service-types');
    } catch (error) {
      console.error('Failed to save service type:', error);
      alert('Failed to save service type');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setServiceType(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked :
              type === 'number' ? parseFloat(value) || 0 :
              value
    }));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{id ? 'Edit' : 'Add'} Service Type</h1>

      <div className="bg-white rounded-xl shadow p-6 border border-gray-200 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name *
              </label>
              <input
                type="text"
                name="name"
                value={serviceType.name}
                onChange={handleChange}
                placeholder="e.g., Standard, Premium, SUV"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={serviceType.description}
                onChange={handleChange}
                rows="3"
                placeholder="Brief description of this service type"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Fare ($) *
              </label>
              <input
                type="number"
                name="base_fare"
                value={serviceType.base_fare}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Per KM Rate ($) *
              </label>
              <input
                type="number"
                name="per_km_rate"
                value={serviceType.per_km_rate}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Per Minute Rate ($) *
              </label>
              <input
                type="number"
                name="per_minute_rate"
                value={serviceType.per_minute_rate}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Fare ($) *
              </label>
              <input
                type="number"
                name="minimum_fare"
                value={serviceType.minimum_fare}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity (Passengers) *
              </label>
              <input
                type="number"
                name="capacity"
                value={serviceType.capacity}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={serviceType.is_active}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">Active</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard/service-types')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? 'Saving...' : (id ? 'Update' : 'Create') + ' Service Type'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
