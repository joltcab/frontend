import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminService from '@/services/dashboardService';

export default function PromoCodeDetailEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [promo, setPromo] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: 0,
    max_discount: 0,
    min_order_value: 0,
    usage_limit: 0,
    usage_limit_per_user: 1,
    valid_from: '',
    valid_until: '',
    is_active: true,
    description: '',
  });

  useEffect(() => {
    if (id) {
      loadPromo();
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadPromo = async () => {
    try {
      const data = await adminService.getPromoCode(id);
      setPromo(data);
    } catch (error) {
      console.error('Failed to load promo code:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await adminService.updatePromoCode(id, promo);
        alert('Promo code updated successfully');
      } else {
        await adminService.createPromoCode(promo);
        alert('Promo code created successfully');
      }
      navigate('/admin/dashboard/promos');
    } catch (error) {
      console.error('Failed to save promo code:', error);
      alert('Failed to save promo code');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPromo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) || 0 : 
              value
    }));
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{id ? 'Edit' : 'Create'} Promo Code</h1>
        <button
          onClick={() => navigate('/admin/dashboard/promos')}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back to List
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Promo Code *
              </label>
              <input
                type="text"
                name="code"
                value={promo.code}
                onChange={handleChange}
                placeholder="e.g., SUMMER2025"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 uppercase"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Type *
              </label>
              <select
                name="discount_type"
                value={promo.discount_type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Value *
              </label>
              <input
                type="number"
                name="discount_value"
                value={promo.discount_value}
                onChange={handleChange}
                placeholder={promo.discount_type === 'percentage' ? '10' : '5.00'}
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Discount Amount ($)
              </label>
              <input
                type="number"
                name="max_discount"
                value={promo.max_discount}
                onChange={handleChange}
                placeholder="e.g., 50"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Order Value ($)
              </label>
              <input
                type="number"
                name="min_order_value"
                value={promo.min_order_value}
                onChange={handleChange}
                placeholder="e.g., 20"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Usage Limit
              </label>
              <input
                type="number"
                name="usage_limit"
                value={promo.usage_limit}
                onChange={handleChange}
                placeholder="0 = unlimited"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usage Limit Per User
              </label>
              <input
                type="number"
                name="usage_limit_per_user"
                value={promo.usage_limit_per_user}
                onChange={handleChange}
                placeholder="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valid From *
              </label>
              <input
                type="date"
                name="valid_from"
                value={promo.valid_from}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valid Until *
              </label>
              <input
                type="date"
                name="valid_until"
                value={promo.valid_until}
                onChange={handleChange}
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
                value={promo.description}
                onChange={handleChange}
                rows="3"
                placeholder="Internal description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={promo.is_active}
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
              onClick={() => navigate('/admin/dashboard/promos')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
            >
              {id ? 'Update' : 'Create'} Promo Code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
