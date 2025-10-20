import { useState, useEffect } from 'react';
import adminService from '@/services/dashboardService';

export default function StatementProviderEarning() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [providerId, setProviderId] = useState('');
  const [earnings, setEarnings] = useState([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalTrips: 0,
    totalCommission: 0,
  });
  const [loading, setLoading] = useState(false);

  const loadEarnings = async () => {
    if (!startDate || !endDate) {
      alert('Please select start and end dates');
      return;
    }

    setLoading(true);
    try {
      const data = await adminService.getProviderEarnings({
        startDate,
        endDate,
        providerId,
      });
      setEarnings(data.earnings || []);
      setStats({
        totalEarnings: data.totalEarnings || 0,
        totalTrips: data.totalTrips || 0,
        totalCommission: data.totalCommission || 0,
      });
    } catch (error) {
      console.error('Failed to load earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Provider Earnings Statement</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Provider ID (Optional)</label>
            <input
              type="text"
              value={providerId}
              onChange={(e) => setProviderId(e.target.value)}
              placeholder="Leave empty for all"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={loadEarnings}
              className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
            >
              Generate Report
            </button>
          </div>
        </div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trips</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gross Earning</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Earning</th>
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
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    {startDate && endDate ? 'No earnings found for selected period' : 'Select dates and click Generate Report'}
                  </td>
                </tr>
              ) : (
                earnings.map((earning) => (
                  <tr key={earning._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{earning.provider_name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">{earning.period || 'N/A'}</td>
                    <td className="px-6 py-4">{earning.trips_count || 0}</td>
                    <td className="px-6 py-4 font-semibold">${(earning.gross_earning || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-red-600">-${(earning.commission || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 font-bold text-green-600">${(earning.net_earning || 0).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-800">Export PDF</button>
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
