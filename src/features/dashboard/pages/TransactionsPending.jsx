import { useState, useEffect } from 'react';
import adminService from '@/services/dashboardService';

export default function TransactionsPending() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingPayments();
  }, []);

  const loadPendingPayments = async () => {
    try {
      const data = await adminService.getPendingPayments();
      setPending(data.transactions || []);
    } catch (error) {
      console.error('Failed to load pending payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async (id) => {
    try {
      await adminService.processPayment(id, { status: 'processed' });
      loadPendingPayments();
    } catch (error) {
      console.error('Failed to process payment:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pending Payments</h1>
        <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg">
          Process All
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : pending.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No pending payments</td>
                </tr>
              ) : (
                pending.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{payment.provider_name || 'N/A'}</td>
                    <td className="px-6 py-4 font-semibold">${payment.amount || 0}</td>
                    <td className="px-6 py-4">{payment.payment_method || 'Bank Transfer'}</td>
                    <td className="px-6 py-4">{payment.requested_date || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleProcess(payment._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                      >
                        Process
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
