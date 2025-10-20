import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EnvelopeIcon, PhoneIcon, DocumentTextIcon, TruckIcon, CheckCircleIcon, XCircleIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import adminService from '@/services/dashboardService';
import { DataTable, Button, Badge, ConfirmModal, Card } from '@/components/ui';
import DriverDetailModal from '../components/DriverDetailModal';

export default function Drivers() {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, driver: null });
  const [detailModal, setDetailModal] = useState({ isOpen: false, driver: null });
  const [deleting, setDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [approvalFilter, setApprovalFilter] = useState('all');

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      const response = await adminService.getDrivers();
      setDrivers(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminService.deleteDriver(deleteModal.driver._id);
      setDrivers(drivers.filter(d => d._id !== deleteModal.driver._id));
      setDeleteModal({ isOpen: false, driver: null });
    } catch (error) {
      console.error('Failed to delete driver:', error);
      alert('Failed to delete driver. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const getFilteredDrivers = () => {
    let filtered = [...drivers];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(d => 
        statusFilter === 'active' ? d.is_active : !d.is_active
      );
    }

    if (approvalFilter !== 'all') {
      filtered = filtered.filter(d => 
        approvalFilter === 'approved' ? d.is_approved : !d.is_approved
      );
    }

    return filtered;
  };

  const columns = [
    { 
      key: 'first_name', 
      label: 'Driver',
      sortable: true,
      render: (_, driver) => (
        <div>
          <p className="font-medium text-gray-900">{driver.first_name} {driver.last_name}</p>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            <EnvelopeIcon className="w-3 h-3" />
            {driver.email}
          </p>
        </div>
      )
    },
    { 
      key: 'phone', 
      label: 'Contact',
      sortable: false,
      render: (value) => (
        <span className="flex items-center gap-1 text-sm text-gray-600">
          <PhoneIcon className="w-4 h-4" />
          {value}
        </span>
      )
    },
    { 
      key: 'vehicle_type', 
      label: 'Vehicle',
      sortable: true,
      render: (value) => (
        <span className="flex items-center gap-1 text-sm text-gray-700">
          <TruckIcon className="w-4 h-4" />
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
      key: 'documents_verified', 
      label: 'Documents',
      sortable: true,
      render: (value) => (
        <span className="flex items-center gap-1">
          {value ? (
            <>
              <CheckCircleIcon className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600">Verified</span>
            </>
          ) : (
            <>
              <XCircleIcon className="w-4 h-4 text-yellow-600" />
              <span className="text-xs text-yellow-600">Pending</span>
            </>
          )}
        </span>
      )
    },
    { 
      key: 'is_approved', 
      label: 'Status',
      sortable: true,
      render: (value, driver) => (
        <div className="flex flex-col gap-1">
          <Badge variant={value ? 'success' : 'warning'} size="sm">
            {value ? 'Approved' : 'Pending'}
          </Badge>
          {value && (
            <Badge variant={driver.is_active ? 'primary' : 'default'} size="sm">
              {driver.is_active ? 'Online' : 'Offline'}
            </Badge>
          )}
        </div>
      )
    },
    { 
      key: 'actions', 
      label: 'Actions',
      sortable: false,
      render: (_, driver) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="xs"
            onClick={() => setDetailModal({ isOpen: true, driver: {
              name: `${driver.first_name} ${driver.last_name}`,
              email: driver.email,
              phone: driver.phone,
              totalTrips: driver.trips_count,
              rating: driver.rating,
              earnings: driver.earnings || '0',
              isApproved: driver.is_approved,
              isOnline: driver.is_active,
              documentsVerified: driver.documents_verified,
              vehicleType: driver.vehicle_type,
              vehicleMake: driver.vehicle_make,
              vehicleModel: driver.vehicle_model
            }})}
          >
            <EyeIcon className="w-4 h-4" />
            View
          </Button>
          <Button 
            variant="ghost" 
            size="xs"
            onClick={() => navigate(`/admin/dashboard/drivers/${driver._id}/edit`)}
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="xs"
            onClick={() => setDeleteModal({ isOpen: true, driver })}
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
        <div className="text-gray-500">Loading drivers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Providers Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all registered drivers and their vehicles</p>
        </div>
        <Button 
          variant="primary" 
          size="md"
          onClick={() => navigate('/admin/dashboard/drivers/add')}
        >
          <PlusIcon className="w-4 h-4" />
          Add Driver
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={getFilteredDrivers()}
        pageSize={10}
        searchPlaceholder="Search by name, email, or phone..."
        emptyMessage="No drivers found"
        defaultSort={{ key: 'first_name', direction: 'asc' }}
        filters={
          <>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Approval:</label>
              <select
                value={approvalFilter}
                onChange={(e) => setApprovalFilter(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-joltcab-400"
              >
                <option value="all">All</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-joltcab-400"
              >
                <option value="all">All</option>
                <option value="active">Online</option>
                <option value="inactive">Offline</option>
              </select>
            </div>
            {(statusFilter !== 'all' || approvalFilter !== 'all') && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  setStatusFilter('all');
                  setApprovalFilter('all');
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
        onClose={() => setDeleteModal({ isOpen: false, driver: null })}
        onConfirm={handleDelete}
        title="Delete Driver"
        message={`Are you sure you want to delete ${deleteModal.driver?.first_name} ${deleteModal.driver?.last_name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />

      <DriverDetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, driver: null })}
        driver={detailModal.driver}
      />
    </div>
  );
}
