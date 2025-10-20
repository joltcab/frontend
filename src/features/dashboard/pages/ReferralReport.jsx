import { useState, useEffect } from 'react';
import adminService from '@/services/dashboardService';

export default function ReferralReport() {
  const [stats, setStats] = useState({
    totalReferrals: 0,
    completedReferrals: 0,
    totalBonus: 0,
    pendingBonus: 0,
  });
  const [topReferrers, setTopReferrers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferralReport();
  }, []);

  const loadReferralReport = async () => {
    try {
      const data = await adminService.getReferralReport();
      setStats({
        totalReferrals: data.totalReferrals || 0,
        completedReferrals: data.completedReferrals || 0,
        totalBonus: data.totalBonus || 0,
        pendingBonus: data.pendingBonus || 0,
      });
      setTopReferrers(data.topReferrers || []);
    } catch (error) {
      console.error('Failed to load referral report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Referral Report</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Referrals</h3>
          <p className="text-3xl font-bold text-gray-900">
            {loading ? '-' : (stats.totalReferrals || 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Completed</h3>
          <p className="text-3xl font-bold text-green-600">
            {loading ? '-' : (stats.completedReferrals || 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Bonus Paid</h3>
          <p className="text-3xl font-bold text-gray-900">
            {loading ? '-' : `$${(stats.totalBonus || 0).toLocaleString()}`}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Pending Bonus</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {loading ? '-' : `$${(stats.pendingBonus || 0).toLocaleString()}`}
          </p>
        </div>
      </div>

      {/* Top Referrers Table */}
      <div className="bg-white rounded-xl shadow border border-gray-200">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Top Referrers</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referrals</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : topReferrers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No data available</td>
                </tr>
              ) : (
                topReferrers.map((referrer, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold">{index + 1}</td>
                    <td className="px-6 py-4">{referrer.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {referrer.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">{referrer.count}</td>
                    <td className="px-6 py-4 font-semibold text-green-600">${referrer.earned}</td>
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
