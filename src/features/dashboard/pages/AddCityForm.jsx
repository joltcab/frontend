import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminService from '@/services/dashboardService';

export default function AddCityForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState({
    name: '',
    country: '',
    currency: 'USD',
    currency_symbol: '$',
    timezone: '',
    is_active: true,
  });

  useEffect(() => {
    if (id) {
      loadCity();
    }
  }, [id]);

  const loadCity = async () => {
    try {
      const data = await adminService.getCity(id);
      setCity(data);
    } catch (error) {
      console.error('Failed to load city:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await adminService.updateCity(id, city);
        alert('City updated successfully');
      } else {
        await adminService.createCity(city);
        alert('City created successfully');
      }
      navigate('/admin/dashboard/cities');
    } catch (error) {
      console.error('Failed to save city:', error);
      alert('Failed to save city');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCity(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{id ? 'Edit' : 'Add'} City</h1>

      <div className="bg-white rounded-xl shadow p-6 border border-gray-200 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City Name *
              </label>
              <input
                type="text"
                name="name"
                value={city.name}
                onChange={handleChange}
                placeholder="e.g., New York"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <input
                type="text"
                name="country"
                value={city.country}
                onChange={handleChange}
                placeholder="e.g., United States"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency Code *
              </label>
              <input
                type="text"
                name="currency"
                value={city.currency}
                onChange={handleChange}
                placeholder="USD"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency Symbol *
              </label>
              <input
                type="text"
                name="currency_symbol"
                value={city.currency_symbol}
                onChange={handleChange}
                placeholder="$"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <input
                type="text"
                name="timezone"
                value={city.timezone}
                onChange={handleChange}
                placeholder="America/New_York"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={city.is_active}
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
              onClick={() => navigate('/admin/dashboard/cities')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? 'Saving...' : (id ? 'Update' : 'Create') + ' City'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
