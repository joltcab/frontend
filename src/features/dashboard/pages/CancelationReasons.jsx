import { useState, useEffect } from 'react';
import adminService from '@/services/dashboardService';

export default function CancelationReasons() {
  const [reasons, setReasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReason, setNewReason] = useState({
    reason: '',
    for_user: true,
    for_driver: true,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadReasons();
  }, []);

  const loadReasons = async () => {
    try {
      const data = await adminService.getCancelationReasons();
      setReasons(data.reasons || []);
    } catch (error) {
      console.error('Failed to load reasons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newReason.reason) return;

    try {
      await adminService.createCancelationReason(newReason);
      setNewReason({ reason: '', for_user: true, for_driver: true });
      loadReasons();
      alert('Reason added successfully');
    } catch (error) {
      console.error('Failed to add reason:', error);
      alert('Failed to add reason');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this cancelation reason?')) {
      try {
        await adminService.deleteCancelationReason(id);
        loadReasons();
        alert('Reason deleted successfully');
      } catch (error) {
        console.error('Failed to delete reason:', error);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Cancelation Reasons</h1>

      {/* Add New Reason */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-200 mb-6">
        <h2 className="text-xl font-bold mb-4">Add New Reason</h2>
        <form onSubmit={handleAdd} className="flex items-end space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={newReason.reason}
              onChange={(e) => setNewReason(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Enter cancelation reason"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newReason.for_user}
                onChange={(e) => setNewReason(prev => ({ ...prev, for_user: e.target.checked }))}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="ml-2 text-sm">For User</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newReason.for_driver}
                onChange={(e) => setNewReason(prev => ({ ...prev, for_driver: e.target.checked }))}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="ml-2 text-sm">For Driver</span>
            </label>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
          >
            Add Reason
          </button>
        </form>
      </div>

      {/* Reasons List */}
      <div className="bg-white rounded-xl shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">For User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">For Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : reasons.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No cancelation reasons found</td>
                </tr>
              ) : (
                reasons.map((reason) => (
                  <tr key={reason._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{reason.reason}</td>
                    <td className="px-6 py-4">
                      {reason.for_user ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-gray-300">✗</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {reason.for_driver ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-gray-300">✗</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(reason._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
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
