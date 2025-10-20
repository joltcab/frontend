import { useState, useEffect } from 'react';
import adminService from '@/services/dashboardService';

export default function PaymentPending() {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayments, setSelectedPayments] = useState([]);

  useEffect(() => {
    loadPendingPayments();
  }, []);

  const loadPendingPayments = async () => {
    try {
      const data = await adminService.getPendingPayments();
      setPendingPayments(data.payments || []);
    } catch (error) {
      console.error('Failed to load pending payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPayment = (paymentId) => {
    setSelectedPayments(prev => 
      prev.includes(paymentId) 
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPayments.length === pendingPayments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(pendingPayments.map(p => p._id));
    }
  };

  const handleProcessPayments = async () => {
    if (selectedPayments.length === 0) {
      alert('Please select at least one payment to process');
      return;
    }

    if (confirm(`Process ${selectedPayments.length} payment(s)?`)) {
      try {
        await adminService.processPayments({ paymentIds: selectedPayments });
        alert('Payments processed successfully');
        setSelectedPayments([]);
        loadPendingPayments();
      } catch (error) {
        console.error('Failed to process payments:', error);
        alert('Failed to process payments');
      }
    }
  };

  const totalPending = pendingPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const selectedTotal = pendingPayments
    .filter(p => selectedPayments.includes(p._id))
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Pending Payments</h1>
        {selectedPayments.length > 0 && (
          <button
            onClick={handleProcessPayments}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
          >
            Process {selectedPayments.length} Payment(s)
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">
            ${totalPending.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Pending Count</h3>
          <p className="text-3xl font-bold text-gray-900">
            {pendingPayments.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Selected Amount</h3>
          <p className="text-3xl font-bold text-green-600">
            ${selectedTotal.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedPayments.length === pendingPayments.length && pendingPayments.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : pendingPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">No pending payments</td>
                </tr>
              ) : (
                pendingPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPayments.includes(payment._id)}
                        onChange={() => handleSelectPayment(payment._id)}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium">{payment.provider_name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">
                      {payment.bank_name ? (
                        <div>
                          <p>{payment.bank_name}</p>
                          <p className="text-gray-500">****{payment.account_number?.slice(-4)}</p>
                        </div>
                      ) : (
                        <span className="text-red-500">Not configured</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-green-600">${(payment.amount || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">{payment.period || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">View</button>
                      <button className="text-green-600 hover:text-green-800">Process</button>
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
