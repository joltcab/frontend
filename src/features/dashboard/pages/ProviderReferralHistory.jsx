import { useState, useEffect } from 'react';
import adminService from '@/services/dashboardService';

export default function ProviderReferralHistory() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProviderReferrals();
  }, []);

  const loadProviderReferrals = async () => {
    try {
      const data = await adminService.getProviderReferralHistory();
      setReferrals(data.referrals || []);
    } catch (error) {
      console.error('Failed to load provider referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Provider Referral History</h1>

      <div className="bg-white rounded-xl shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referrer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referred Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bonus</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : referrals.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No referrals found</td>
                </tr>
              ) : (
                referrals.map((ref) => (
                  <tr key={ref._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{ref.referrer_name || 'N/A'}</td>
                    <td className="px-6 py-4">{ref.referred_name || 'N/A'}</td>
                    <td className="px-6 py-4 font-semibold">${ref.bonus_amount || 0}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ref.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ref.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{ref.created_date || 'N/A'}</td>
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
