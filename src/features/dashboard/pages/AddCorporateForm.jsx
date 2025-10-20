import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminService from '@/services/dashboardService';

export default function AddCorporateForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [corporate, setCorporate] = useState({
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    credit_limit: 0,
    is_active: true,
  });

  useEffect(() => {
    if (id) {
      loadCorporate();
    }
  }, [id]);

  const loadCorporate = async () => {
    try {
      const data = await adminService.getCorporateAccount(id);
      setCorporate(data);
    } catch (error) {
      console.error('Failed to load corporate account:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await adminService.updateCorporateAccount(id, corporate);
        alert('Corporate account updated successfully');
      } else {
        await adminService.createCorporateAccount(corporate);
        alert('Corporate account created successfully');
      }
      navigate('/admin/dashboard/corporate');
    } catch (error) {
      console.error('Failed to save corporate account:', error);
      alert('Failed to save corporate account');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCorporate(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked :
              type === 'number' ? parseFloat(value) || 0 :
              value
    }));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{id ? 'Edit' : 'Add'} Corporate Account</h1>

      <div className="bg-white rounded-xl shadow p-6 border border-gray-200 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="company_name"
                value={corporate.company_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person *
              </label>
              <input
                type="text"
                name="contact_person"
                value={corporate.contact_person}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={corporate.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={corporate.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Credit Limit ($)
              </label>
              <input
                type="number"
                name="credit_limit"
                value={corporate.credit_limit}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={corporate.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={corporate.is_active}
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
              onClick={() => navigate('/admin/dashboard/corporate')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? 'Saving...' : (id ? 'Update' : 'Create') + ' Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
