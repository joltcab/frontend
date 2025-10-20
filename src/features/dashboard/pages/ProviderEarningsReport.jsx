import { useState, useEffect } from 'react';
import adminService from '@/services/dashboardService';

export default function ProviderEarningsReport() {
  const [reportType, setReportType] = useState('monthly');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await adminService.getProviderAnalytics({
        period: reportType,
        year,
        month: reportType === 'monthly' ? month : undefined,
      });
      setReport(response.data?.data || null);
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateReport();
  }, [reportType, year, month]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Provider Earnings Report</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {reportType === 'monthly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-end">
            <button
              onClick={generateReport}
              className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
            >
              Refresh Report
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {report && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Total Earnings</h3>
              <p className="text-3xl font-bold text-green-600">
                ${(report.totalEarnings || 0).toLocaleString()}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Total Commission</h3>
              <p className="text-3xl font-bold text-gray-900">
                ${(report.totalCommission || 0).toLocaleString()}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Total Trips</h3>
              <p className="text-3xl font-bold text-blue-600">
                {(report.totalTrips || 0).toLocaleString()}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Active Providers</h3>
              <p className="text-3xl font-bold text-purple-600">
                {(report.activeProviders || 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Top Earners */}
          <div className="bg-white rounded-xl shadow border border-gray-200 mb-6">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Top 10 Earners</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trips</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gross Earning</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Earning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading...</td>
                    </tr>
                  ) : !report.topEarners || report.topEarners.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No data available</td>
                    </tr>
                  ) : (
                    report.topEarners.slice(0, 10).map((earner, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold">{index + 1}</td>
                        <td className="px-6 py-4">{earner.provider_name}</td>
                        <td className="px-6 py-4">{earner.trips_count}</td>
                        <td className="px-6 py-4 font-semibold">${earner.gross_earning.toFixed(2)}</td>
                        <td className="px-6 py-4 text-red-600">-${earner.commission.toFixed(2)}</td>
                        <td className="px-6 py-4 font-bold text-green-600">${earner.net_earning.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
