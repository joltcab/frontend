import { useState, useEffect } from 'react';
import adminService from '@/services/dashboardService';

export default function DriversPending() {
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingDrivers();
  }, []);

  const loadPendingDrivers = async () => {
    try {
      const response = await adminService.getDrivers({ status: 'pending' });
      setPendingDrivers(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load pending drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminService.approveDriver(id);
      loadPendingDrivers();
    } catch (error) {
      console.error('Failed to approve driver:', error);
      alert(error.response?.data?.message || 'Failed to approve driver');
    }
  };

  const handleReject = async (id) => {
    try {
      await adminService.suspendDriver(id);
      loadPendingDrivers();
    } catch (error) {
      console.error('Failed to reject driver:', error);
      alert(error.response?.data?.message || 'Failed to reject driver');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Pending Provider Approval</h1>

      <div className="bg-white rounded-xl shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documents</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : pendingDrivers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No pending approvals</td>
                </tr>
              ) : (
                pendingDrivers.map((driver) => (
                  <tr key={driver._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{driver.first_name} {driver.last_name}</td>
                    <td className="px-6 py-4">{driver.email}</td>
                    <td className="px-6 py-4">{driver.phone}</td>
                    <td className="px-6 py-4">
                      <span className="text-blue-600 hover:underline cursor-pointer">View Documents</span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button 
                        onClick={() => handleApprove(driver._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReject(driver._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                      >
                        Reject
                      </button>
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
