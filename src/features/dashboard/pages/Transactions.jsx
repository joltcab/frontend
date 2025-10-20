import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, CreditCardIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Badge, StatCard, Input } from '@/components/ui';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    successfulPayments: 0,
    failedPayments: 0
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    payment_method: 'all',
    date_from: '',
    date_to: ''
  });

  useEffect(() => {
    loadTransactions();
  }, [filters]);

  const loadTransactions = async () => {
    try {
      const [transactionsRes, statsRes] = await Promise.all([
        adminService.getPaymentTransactions(filters),
        adminService.getPaymentStatistics(filters)
      ]);
      
      setTransactions(transactionsRes.data?.data || []);
      setStats(statsRes.data?.stats || {
        totalTransactions: 0,
        totalAmount: 0,
        successfulPayments: 0,
        failedPayments: 0
      });
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const columns = [
    {
      key: 'transaction_id',
      label: 'Transaction ID',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-xs text-gray-700">{value || 'N/A'}</span>
      )
    },
    {
      key: 'created_at',
      label: 'Date',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1 text-sm text-gray-700">
          <CalendarIcon className="w-4 h-4 text-gray-400" />
          {value ? new Date(value).toLocaleDateString() : 'N/A'}
        </div>
      )
    },
    {
      key: 'user',
      label: 'User',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">
              {value?.first_name && value?.last_name 
                ? `${value.first_name} ${value.last_name}`
                : 'N/A'}
            </p>
            {value?.email && (
              <p className="text-xs text-gray-500">{value.email}</p>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'payment_method',
      label: 'Payment Method',
      sortable: true,
      render: (value) => {
        const method = value ? value.charAt(0).toUpperCase() + value.slice(1) : 'N/A';
        const variant = value === 'card' ? 'primary' : value === 'cash' ? 'success' : 'default';
        return (
          <div className="flex items-center gap-2">
            <CreditCardIcon className="w-5 h-5 text-gray-400" />
            <Badge variant={variant}>{method}</Badge>
          </div>
        );
      }
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-gray-900">
          ${value ? value.toFixed(2) : '0.00'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => {
        const status = value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Unknown';
        const variant = 
          value === 'completed' || value === 'success' ? 'success' :
          value === 'pending' ? 'warning' :
          value === 'failed' ? 'danger' :
          'default';
        return <Badge variant={variant}>{status}</Badge>;
      }
    },
    {
      key: 'trip_id',
      label: 'Trip ID',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-xs text-gray-500">{value || '-'}</span>
      )
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-500 mt-1">View and manage all payment transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Transactions"
          value={stats.totalTransactions}
          icon={CreditCardIcon}
          trend={null}
        />
        <StatCard
          title="Total Amount"
          value={`$${stats.totalAmount?.toLocaleString() || '0'}`}
          icon={CreditCardIcon}
          iconColor="text-green-500"
          trend={null}
        />
        <StatCard
          title="Successful"
          value={stats.successfulPayments}
          icon={CreditCardIcon}
          iconColor="text-blue-500"
          trend={null}
        />
        <StatCard
          title="Failed"
          value={stats.failedPayments}
          icon={CreditCardIcon}
          iconColor="text-red-500"
          trend={null}
        />
      </div>

      <div className="bg-white rounded-xl shadow p-6 border border-gray-200 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FunnelIcon className="w-5 h-5 text-gray-400" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input
            type="text"
            placeholder="Search by ID, user..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            icon={MagnifyingGlassIcon}
          />
          
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joltcab-green-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={filters.payment_method}
            onChange={(e) => handleFilterChange('payment_method', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joltcab-green-500 focus:border-transparent"
          >
            <option value="all">All Methods</option>
            <option value="card">Card</option>
            <option value="cash">Cash</option>
            <option value="wallet">Wallet</option>
          </select>

          <input
            type="date"
            value={filters.date_from}
            onChange={(e) => handleFilterChange('date_from', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joltcab-green-500 focus:border-transparent"
            placeholder="From Date"
          />

          <input
            type="date"
            value={filters.date_to}
            onChange={(e) => handleFilterChange('date_to', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joltcab-green-500 focus:border-transparent"
            placeholder="To Date"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200">
        <DataTable
          columns={columns}
          data={transactions}
          loading={loading}
          emptyMessage="No transactions found"
        />
      </div>
    </div>
  );
}
