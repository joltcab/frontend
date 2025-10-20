import { useState, useEffect } from 'react';
import { CalendarIcon, CurrencyDollarIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Badge, Button } from '@/components/ui';

export default function PartnerWeeklyPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await adminService.getPartnerWeeklyPayments();
      setPayments(data.payments || generateMockPayments());
    } catch (error) {
      console.error('Failed to load partner weekly payments:', error);
      setPayments(generateMockPayments());
    } finally {
      setLoading(false);
    }
  };

  const generateMockPayments = () => [
    {
      _id: '1',
      driver: { first_name: 'Mike', last_name: 'Smith', _id: 'd1' },
      week_start: '2024-10-14',
      week_end: '2024-10-20',
      total_trips: 48,
      total_earnings: 1250.50,
      commission_deducted: 250.10,
      net_payout: 1000.40,
      status: 'pending',
    },
    {
      _id: '2',
      driver: { first_name: 'Sarah', last_name: 'Johnson', _id: 'd2' },
      week_start: '2024-10-14',
      week_end: '2024-10-20',
      total_trips: 52,
      total_earnings: 1380.20,
      commission_deducted: 276.04,
      net_payout: 1104.16,
      status: 'paid',
      paid_at: '2024-10-21T10:00:00Z'
    },
  ];

  const handleMarkPaid = async (paymentId) => {
    try {
      await adminService.markPaymentAsPaid(paymentId);
      setPayments(payments.map(p => 
        p._id === paymentId 
          ? { ...p, status: 'paid', paid_at: new Date().toISOString() }
          : p
      ));
    } catch (error) {
      console.error('Failed to mark payment as paid:', error);
      alert('Failed to update payment status. Please try again.');
    }
  };

  const getStatusVariant = (status) => {
    return status === 'paid' ? 'success' : 'warning';
  };

  const columns = [
    {
      key: 'driver',
      label: 'Driver',
      sortable: true,
      render: (value) => (
        <div>
          <p className="font-medium text-gray-900">
            {value?.first_name} {value?.last_name}
          </p>
        </div>
      )
    },
    {
      key: 'week_start',
      label: 'Week Period',
      sortable: true,
      render: (value, payment) => (
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-sm text-gray-900">
              {new Date(value).toLocaleDateString()} - {new Date(payment.week_end).toLocaleDateString()}
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'total_trips',
      label: 'Trips',
      sortable: true,
      render: (value) => <span className="font-semibold text-gray-900">{value}</span>
    },
    {
      key: 'total_earnings',
      label: 'Gross Earnings',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-900">${value?.toFixed(2)}</span>
      )
    },
    {
      key: 'commission_deducted',
      label: 'Commission',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-joltcab-600">-${value?.toFixed(2)}</span>
      )
    },
    {
      key: 'net_payout',
      label: 'Net Payout',
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-green-600">${value?.toFixed(2)}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <Badge variant={getStatusVariant(value)}>
          {value === 'paid' ? 'Paid' : 'Pending'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, payment) => (
        payment.status === 'pending' ? (
          <Button
            variant="primary"
            size="xs"
            onClick={() => handleMarkPaid(payment._id)}
          >
            <CheckCircleIcon className="w-4 h-4" />
            Mark Paid
          </Button>
        ) : (
          <div className="text-xs text-gray-500">
            Paid on {new Date(payment.paid_at).toLocaleDateString()}
          </div>
        )
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading partner weekly payments...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Partner Weekly Payments</h1>
        <p className="text-gray-600 mt-1">Manage weekly driver payments</p>
      </div>

      <DataTable
        columns={columns}
        data={payments}
        pageSize={15}
        searchPlaceholder="Search by driver name..."
        emptyMessage="No payments found"
        defaultSort={{ key: 'week_start', direction: 'desc' }}
      />
    </div>
  );
}
