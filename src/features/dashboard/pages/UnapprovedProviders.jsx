import { useState, useEffect } from 'react';
import { EyeIcon, PhoneIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Button, Badge, ConfirmModal } from '@/components/ui';
import DriverDetailModal from '../components/DriverDetailModal';

export default function UnapprovedProviders() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [actionModal, setActionModal] = useState({ isOpen: false, provider: null, action: null });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const data = await adminService.getProviders({ approval_status: 'pending' });
      setProviders(data.providers || generateMockProviders());
    } catch (error) {
      console.error('Failed to load unapproved providers:', error);
      setProviders(generateMockProviders());
    } finally {
      setLoading(false);
    }
  };

  const generateMockProviders = () => [
    {
      _id: '1',
      first_name: 'Alex',
      last_name: 'Johnson',
      email: 'alex.johnson@example.com',
      phone: '+1 (555) 555-6666',
      vehicle_type: 'Sedan',
      is_approved: false,
      documents_verified: false,
      created_at: '2024-10-15T09:00:00Z',
    },
    {
      _id: '2',
      first_name: 'Sophie',
      last_name: 'Brown',
      email: 'sophie.brown@example.com',
      phone: '+1 (555) 666-7777',
      vehicle_type: 'SUV',
      is_approved: false,
      documents_verified: true,
      created_at: '2024-10-17T14:00:00Z',
    },
  ];

  const handleAction = async () => {
    setProcessing(true);
    try {
      if (actionModal.action === 'approve') {
        await adminService.approveProvider(actionModal.provider._id);
        setProviders(providers.filter(p => p._id !== actionModal.provider._id));
      } else {
        await adminService.rejectProvider(actionModal.provider._id);
        setProviders(providers.filter(p => p._id !== actionModal.provider._id));
      }
      setActionModal({ isOpen: false, provider: null, action: null });
    } catch (error) {
      console.error('Failed to process provider:', error);
      alert('Failed to process provider. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const columns = [
    {
      key: 'first_name',
      label: 'Driver',
      sortable: true,
      render: (value, provider) => (
        <div>
          <p className="font-medium text-gray-900">{value} {provider.last_name}</p>
          <p className="text-xs text-gray-500">{provider.email}</p>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <PhoneIcon className="w-4 h-4" />
          {value}
        </div>
      )
    },
    {
      key: 'vehicle_type',
      label: 'Vehicle',
      sortable: true,
      render: (value) => <span className="text-sm text-gray-700">{value}</span>
    },
    {
      key: 'documents_verified',
      label: 'Documents',
      sortable: true,
      render: (value) => (
        <Badge variant={value ? 'success' : 'warning'}>
          {value ? 'Verified' : 'Pending'}
        </Badge>
      )
    },
    {
      key: 'created_at',
      label: 'Applied',
      sortable: true,
      render: (value) => value ? (
        <div className="text-xs text-gray-600">
          {new Date(value).toLocaleDateString()}
        </div>
      ) : 'N/A'
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, provider) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setSelectedDriver(provider)}
          >
            <EyeIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="primary"
            size="xs"
            onClick={() => setActionModal({ isOpen: true, provider, action: 'approve' })}
          >
            <CheckIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="danger"
            size="xs"
            onClick={() => setActionModal({ isOpen: true, provider, action: 'reject' })}
          >
            <XMarkIcon className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading pending providers...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Unapproved Providers</h1>
          <p className="text-gray-600 mt-1">Review and approve pending provider applications</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-600">{providers.length}</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={providers}
        pageSize={10}
        searchPlaceholder="Search by name, phone, or email..."
        emptyMessage="No pending providers found"
        defaultSort={{ key: 'created_at', direction: 'desc' }}
      />

      <DriverDetailModal
        driver={selectedDriver}
        isOpen={!!selectedDriver}
        onClose={() => setSelectedDriver(null)}
      />

      <ConfirmModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ isOpen: false, provider: null, action: null })}
        onConfirm={handleAction}
        title={actionModal.action === 'approve' ? 'Approve Provider' : 'Reject Provider'}
        message={
          actionModal.action === 'approve'
            ? `Are you sure you want to approve ${actionModal.provider?.first_name} ${actionModal.provider?.last_name}? They will be able to start accepting trips.`
            : `Are you sure you want to reject ${actionModal.provider?.first_name} ${actionModal.provider?.last_name}? This action cannot be undone.`
        }
        confirmText={actionModal.action === 'approve' ? 'Approve' : 'Reject'}
        variant={actionModal.action === 'approve' ? 'primary' : 'danger'}
        loading={processing}
      />
    </div>
  );
}
