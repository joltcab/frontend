import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import adminService from '@/services/dashboardService';
import { DataTable, Button, Badge, ConfirmModal } from '@/components/ui';

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });
  const [deleting, setDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [minTrips, setMinTrips] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await adminService.getUsers();
      setUsers(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminService.deleteUser(deleteModal.user._id);
      setUsers(users.filter(u => u._id !== deleteModal.user._id));
      setDeleteModal({ isOpen: false, user: null });
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const getFilteredUsers = () => {
    let filtered = [...users];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(u => 
        statusFilter === 'active' ? u.is_approved : !u.is_approved
      );
    }

    if (minTrips !== '') {
      const min = parseInt(minTrips);
      if (!isNaN(min)) {
        filtered = filtered.filter(u => u.trips_count >= min);
      }
    }

    return filtered;
  };

  const columns = [
    { 
      key: 'first_name', 
      label: 'Name',
      sortable: true,
      render: (_, user) => (
        <div>
          <p className="font-medium text-gray-900">{user.first_name} {user.last_name}</p>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            <EnvelopeIcon className="w-3 h-3" />
            {user.email}
          </p>
        </div>
      )
    },
    { 
      key: 'phone', 
      label: 'Phone',
      sortable: false,
      render: (value) => (
        <span className="flex items-center gap-1 text-sm text-gray-600">
          <PhoneIcon className="w-4 h-4" />
          {value}
        </span>
      )
    },
    { 
      key: 'trips_count', 
      label: 'Trips',
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>
    },
    { 
      key: 'rating', 
      label: 'Rating',
      sortable: true,
      render: (value) => value > 0 ? (
        <span className="text-sm">⭐ {value.toFixed(1)}</span>
      ) : (
        <span className="text-xs text-gray-400">No ratings</span>
      )
    },
    { 
      key: 'is_approved', 
      label: 'Status',
      sortable: true,
      render: (value) => (
        <Badge variant={value ? 'success' : 'warning'} size="sm">
          {value ? 'Active' : 'Pending'}
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
            onClick={() => navigate(`/admin/dashboard/users/${user._id}/edit`)}
          >
            <PencilIcon className="w-4 h-4" />
            Edit
          </Button>
          <Button 
            variant="ghost" 
            size="xs"
            onClick={() => setDeleteModal({ isOpen: true, user })}
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading customers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers List</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all registered customers</p>
        </div>
        <Button 
          variant="primary" 
          size="md"
          onClick={() => navigate('/admin/dashboard/users/add')}
        >
          <PlusIcon className="w-4 h-4" />
          Add Customer
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={getFilteredUsers()}
        pageSize={10}
        searchPlaceholder="Search by name, email, or phone..."
        emptyMessage="No customers found"
        defaultSort={{ key: 'first_name', direction: 'asc' }}
        filters={
          <>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-joltcab-400"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Min Trips:</label>
              <input
                type="number"
                value={minTrips}
                onChange={(e) => setMinTrips(e.target.value)}
                placeholder="0"
                className="w-24 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-joltcab-400"
              />
            </div>
            {(statusFilter !== 'all' || minTrips !== '') && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  setStatusFilter('all');
                  setMinTrips('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </>
        }
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        onConfirm={handleDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete ${deleteModal.user?.first_name} ${deleteModal.user?.last_name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
