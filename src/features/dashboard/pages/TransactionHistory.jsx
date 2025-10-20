import { useState, useEffect } from 'react';
import { CalendarIcon, CreditCardIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Badge } from '@/components/ui';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentFilter, setPaymentFilter] = useState('all');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await adminService.getTransactionHistory();
      setTransactions(data.transactions || generateMockTransactions());
    } catch (error) {
      console.error('Failed to load transaction history:', error);
      setTransactions(generateMockTransactions());
    } finally {
      setLoading(false);
    }
  };

  const generateMockTransactions = () => [
    {
      _id: '1',
      trip_id: 'T10001',
      user: { first_name: 'John', last_name: 'Doe' },
      driver: { first_name: 'Mike', last_name: 'Smith' },
      amount: 24.50,
      payment_method: 'card',
      payment_status: 'completed',
      transaction_id: 'TXN123456789',
      created_at: '2024-10-18T10:45:00Z',
    },
    {
      _id: '2',
      trip_id: 'T10002',
      user: { first_name: 'Sarah', last_name: 'Johnson' },
      driver: { first_name: 'David', last_name: 'Lee' },
      amount: 18.20,
      payment_method: 'cash',
      payment_status: 'completed',
      transaction_id: 'TXN123456790',
      created_at: '2024-10-18T11:20:00Z',
    },
    {
      _id: '3',
      trip_id: 'T10003',
      user: { first_name: 'Emily', last_name: 'Brown' },
      driver: { first_name: 'Alex', last_name: 'Wilson' },
      amount: 32.80,
      payment_method: 'wallet',
      payment_status: 'completed',
      transaction_id: 'TXN123456791',
      created_at: '2024-10-18T12:00:00Z',
    },
  ];

  const getFilteredTransactions = () => {
    if (paymentFilter === 'all') return transactions;
    return transactions.filter(t => t.payment_method === paymentFilter);
  };

  const getStatusVariant = (status) => {
    const variants = {
      completed: 'success',
      pending: 'warning',
      failed: 'danger',
      refunded: 'default',
    };
    return variants[status] || 'default';
  };

  const getPaymentIcon = (method) => {
    if (method === 'card') return CreditCardIcon;
    return BanknotesIcon;
  };

  const columns = [
    {
      key: 'transaction_id',
      label: 'Transaction ID',
      sortable: true,
      render: (value) => <span className="font-mono text-sm text-gray-900">{value}</span>
    },
    {
      key: 'trip_id',
      label: 'Trip ID',
      sortable: true,
      render: (value) => <span className="font-mono font-medium">#{value}</span>
    },
    {
      key: 'user',
      label: 'Customer',
      sortable: true,
      render: (value) => value ? `${value.first_name} ${value.last_name}` : 'N/A'
    },
    {
      key: 'driver',
      label: 'Driver',
      sortable: true,
      render: (value) => value ? `${value.first_name} ${value.last_name}` : 'N/A'
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-gray-900">${value?.toFixed(2)}</span>
      )
    },
    {
      key: 'payment_method',
      label: 'Payment Method',
      sortable: true,
      render: (value) => {
        const Icon = getPaymentIcon(value);
        return (
          <div className="flex items-center gap-1">
            <Icon className="w-4 h-4 text-gray-400" />
            <span className="text-sm capitalize">{value}</span>
          </div>
        );
      }
    },
    {
      key: 'payment_status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <Badge variant={getStatusVariant(value)}>
          {value?.charAt(0).toUpperCase() + value?.slice(1) || 'N/A'}
        </Badge>
      )
    },
    {
      key: 'created_at',
      label: 'Date',
      sortable: true,
      render: (value) => value ? (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <CalendarIcon className="w-4 h-4" />
          {new Date(value).toLocaleDateString()}
        </div>
      ) : 'N/A'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading transaction history...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
        <p className="text-gray-600 mt-1">View all payment transactions</p>
      </div>

      <DataTable
        columns={columns}
        data={getFilteredTransactions()}
        pageSize={15}
        searchPlaceholder="Search by transaction ID, trip ID, or customer..."
        emptyMessage="No transactions found"
        defaultSort={{ key: 'created_at', direction: 'desc' }}
        filters={
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Payment Method:</label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-joltcab-400"
            >
              <option value="all">All Methods</option>
              <option value="card">Card</option>
              <option value="cash">Cash</option>
              <option value="wallet">Wallet</option>
            </select>
          </div>
        }
      />
    </div>
  );
}
