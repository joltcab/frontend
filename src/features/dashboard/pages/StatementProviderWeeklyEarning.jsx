import { useState, useEffect } from 'react';
import adminService from '@/services/dashboardService';

export default function StatementProviderWeeklyEarning() {
  const [weekStart, setWeekStart] = useState(getMonday(new Date()).toISOString().split('T')[0]);
  const [earnings, setEarnings] = useState([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalTrips: 0,
    totalCommission: 0,
  });
  const [loading, setLoading] = useState(false);

  function getMonday(d) {
    d = new Date(d);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  useEffect(() => {
    loadWeeklyEarnings();
  }, [weekStart]);

  const loadWeeklyEarnings = async () => {
    setLoading(true);
    try {
      const data = await adminService.getProviderWeeklyEarnings({ weekStart });
      setEarnings(data.earnings || []);
      setStats({
        totalEarnings: data.totalEarnings || 0,
        totalTrips: data.totalTrips || 0,
        totalCommission: data.totalCommission || 0,
      });
    } catch (error) {
      console.error('Failed to load weekly earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Provider Weekly Earnings</h1>
        <input
          type="date"
          value={weekStart}
          onChange={(e) => setWeekStart(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Earnings</h3>
          <p className="text-3xl font-bold text-green-600">
            ${(stats.totalEarnings || 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Trips</h3>
          <p className="text-3xl font-bold text-blue-600">
            {(stats.totalTrips || 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Platform Commission</h3>
          <p className="text-3xl font-bold text-gray-900">
            ${(stats.totalCommission || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Earnings Table */}
      <div className="bg-white rounded-xl shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trips</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gross Earning</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Earning</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg/Trip</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : earnings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">No earnings for this week</td>
                </tr>
              ) : (
                earnings.map((earning) => (
                  <tr key={earning._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{earning.provider_name || 'N/A'}</td>
                    <td className="px-6 py-4">{earning.trips_count || 0}</td>
                    <td className="px-6 py-4 font-semibold">${(earning.gross_earning || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-red-600">-${(earning.commission || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 font-bold text-green-600">${(earning.net_earning || 0).toFixed(2)}</td>
                    <td className="px-6 py-4">${(earning.avg_per_trip || 0).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-800">View Details</button>
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
