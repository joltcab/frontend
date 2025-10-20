import { useState, useEffect } from 'react';
import { EyeIcon, PhoneIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Button, Badge, ConfirmModal } from '@/components/ui';

export default function BlockedUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unblockModal, setUnblockModal] = useState({ isOpen: false, user: null });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await adminService.getBlockedUsers();
      setUsers(data.users || generateMockUsers());
    } catch (error) {
      console.error('Failed to load blocked users:', error);
      setUsers(generateMockUsers());
    } finally {
      setLoading(false);
    }
  };

  const generateMockUsers = () => [
    {
      _id: '1',
      first_name: 'Paul',
      last_name: 'Anderson',
      email: 'paul.anderson@example.com',
      phone: '+1 (555) 777-8888',
      total_trips: 12,
      blocked_at: '2024-10-10T15:30:00Z',
      blocked_reason: 'Multiple payment disputes',
      is_blocked: true
    },
    {
      _id: '2',
      first_name: 'Jennifer',
      last_name: 'White',
      email: 'jennifer.white@example.com',
      phone: '+1 (555) 888-9999',
      total_trips: 8,
      blocked_at: '2024-10-12T09:15:00Z',
      blocked_reason: 'Inappropriate behavior',
      is_blocked: true
    },
  ];

  const handleUnblock = async () => {
    setProcessing(true);
    try {
      await adminService.unblockUser(unblockModal.user._id);
      setUsers(users.filter(u => u._id !== unblockModal.user._id));
      setUnblockModal({ isOpen: false, user: null });
    } catch (error) {
      console.error('Failed to unblock user:', error);
      alert('Failed to unblock user. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const columns = [
    {
      key: 'first_name',
      label: 'Customer',
      sortable: true,
      render: (value, user) => (
        <div>
          <p className="font-medium text-gray-900">{value} {user.last_name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
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
      key: 'total_trips',
      label: 'Trips',
      sortable: true,
      render: (value) => <span className="font-semibold text-gray-900">{value || 0}</span>
    },
    {
      key: 'blocked_reason',
      label: 'Reason',
      render: (value) => (
        <span className="text-sm text-gray-700 max-w-xs truncate block">{value || 'N/A'}</span>
      )
    },
    {
      key: 'blocked_at',
      label: 'Blocked',
      sortable: true,
      render: (value) => value ? (
        <div className="text-xs text-gray-600">
          {new Date(value).toLocaleDateString()}
        </div>
      ) : 'N/A'
    },
    {
      key: 'is_blocked',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <Badge variant="danger">
          <XCircleIcon className="w-3 h-3 mr-1" />
          Blocked
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, user) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => console.log('View user:', user._id)}
          >
            <EyeIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="primary"
            size="xs"
            onClick={() => setUnblockModal({ isOpen: true, user })}
          >
            <ArrowPathIcon className="w-4 h-4" />
            Unblock
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading blocked users...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blocked Users</h1>
          <p className="text-gray-600 mt-1">Manage blocked customers</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Blocked</p>
          <p className="text-2xl font-bold text-red-600">{users.length}</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={users}
        pageSize={10}
        searchPlaceholder="Search by name, phone, or email..."
        emptyMessage="No blocked users found"
        defaultSort={{ key: 'blocked_at', direction: 'desc' }}
      />

      <ConfirmModal
        isOpen={unblockModal.isOpen}
        onClose={() => setUnblockModal({ isOpen: false, user: null })}
        onConfirm={handleUnblock}
        title="Unblock User"
        message={`Are you sure you want to unblock ${unblockModal.user?.first_name} ${unblockModal.user?.last_name}? They will be able to book trips again.`}
        confirmText="Unblock"
        variant="primary"
        loading={processing}
      />
    </div>
  );
}
