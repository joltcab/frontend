import { useState, useEffect } from 'react';
import adminService from '@/services/dashboardService';

export default function EarningsWeekly() {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeeklyEarnings();
  }, []);

  const loadWeeklyEarnings = async () => {
    try {
      const data = await adminService.getEarnings({ period: 'weekly' });
      setEarnings(data.earnings || []);
    } catch (error) {
      console.error('Failed to load weekly earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Weekly Earnings Report</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium mb-2">This Week</h3>
          <p className="text-3xl font-bold text-gray-900">$0</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Last Week</h3>
          <p className="text-3xl font-bold text-gray-900">$0</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Average</h3>
          <p className="text-3xl font-bold text-gray-900">$0</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Week</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trips</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : earnings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No weekly earnings data</td>
                </tr>
              ) : (
                earnings.map((week, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{week.week_label || `Week ${index + 1}`}</td>
                    <td className="px-6 py-4">{week.total_trips || 0}</td>
                    <td className="px-6 py-4">${week.total_revenue || 0}</td>
                    <td className="px-6 py-4">${week.commission || 0}</td>
                    <td className="px-6 py-4 font-semibold">${week.net_earnings || 0}</td>
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
