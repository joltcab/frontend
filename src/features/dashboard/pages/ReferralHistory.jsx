import { useState, useEffect } from 'react';
import adminService from '@/services/dashboardService';

export default function ReferralHistory() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferralHistory();
  }, []);

  const loadReferralHistory = async () => {
    try {
      const [usersRes, driversRes] = await Promise.all([
        adminService.getUserReferrals(),
        adminService.getDriverReferrals()
      ]);
      
      const allReferrals = [
        ...(usersRes.data?.data || []).map(r => ({ ...r, user_type: 'User' })),
        ...(driversRes.data?.data || []).map(r => ({ ...r, user_type: 'Driver' }))
      ];
      
      setReferrals(allReferrals);
    } catch (error) {
      console.error('Failed to load referral history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Referral History</h1>

      <div className="bg-white rounded-xl shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referrer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referred User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bonus</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : referrals.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No referrals found</td>
                </tr>
              ) : (
                referrals.map((ref) => (
                  <tr key={ref._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {ref.referrer?.first_name && ref.referrer?.last_name
                        ? `${ref.referrer.first_name} ${ref.referrer.last_name}`
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {ref.referred_user?.first_name && ref.referred_user?.last_name
                        ? `${ref.referred_user.first_name} ${ref.referred_user.last_name}`
                        : ref.referred_driver?.first_name && ref.referred_driver?.last_name
                        ? `${ref.referred_driver.first_name} ${ref.referred_driver.last_name}`
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {ref.user_type || 'Customer'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold">${ref.bonus_amount || 0}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ref.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ref.status ? ref.status.charAt(0).toUpperCase() + ref.status.slice(1) : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {ref.created_at ? new Date(ref.created_at).toLocaleDateString() : 'N/A'}
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
