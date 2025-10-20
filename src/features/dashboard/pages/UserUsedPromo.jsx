import { useState, useEffect } from 'react';
import adminService from '@/services/dashboardService';

export default function UserUsedPromo() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsedPromos();
  }, []);

  const loadUsedPromos = async () => {
    try {
      const data = await adminService.getUsedPromos();
      setPromos(data.promos || []);
    } catch (error) {
      console.error('Failed to load used promos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Promo Codes Usage</h1>

      <div className="bg-white rounded-xl shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Promo Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Used Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trip ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : promos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No promo usage found</td>
                </tr>
              ) : (
                promos.map((promo, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{promo.user_name || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                        {promo.promo_code}
                      </span>
                    </td>
                    <td className="px-6 py-4">{promo.discount_type === 'percentage' ? `${promo.discount}%` : `$${promo.discount}`}</td>
                    <td className="px-6 py-4">{promo.used_date || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <a href={`/dashboard/trips/${promo.trip_id}`} className="text-blue-600 hover:underline">
                        {promo.trip_id}
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
