import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Button, Modal, Input, Textarea, ConfirmModal } from '@/components/ui';

export default function CancellationReasons() {
  const [reasons, setReasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({ isOpen: false, reason: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, reason: null });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadReasons();
  }, []);

  const loadReasons = async () => {
    try {
      const data = await adminService.getCancellationReasons();
      setReasons(data.reasons || generateMockReasons());
    } catch (error) {
      console.error('Failed to load cancellation reasons:', error);
      setReasons(generateMockReasons());
    } finally {
      setLoading(false);
    }
  };

  const generateMockReasons = () => [
    {
      _id: '1',
      reason: 'Driver not arrived',
      user_type: 'user',
      usage_count: 45,
      is_active: true,
    },
    {
      _id: '2',
      reason: 'Found another ride',
      user_type: 'user',
      usage_count: 32,
      is_active: true,
    },
    {
      _id: '3',
      reason: 'Passenger not responding',
      user_type: 'provider',
      usage_count: 28,
      is_active: true,
    },
    {
      _id: '4',
      reason: 'Wrong pickup location',
      user_type: 'provider',
      usage_count: 15,
      is_active: true,
    },
  ];

  const handleSave = async (formData) => {
    if (!formData.reason || !formData.user_type) {
      alert('Please fill all required fields');
      return;
    }

    setSaving(true);
    try {
      if (editModal.reason) {
        await adminService.updateCancellationReason(editModal.reason._id, formData);
        setReasons(reasons.map(r => r._id === editModal.reason._id ? { ...r, ...formData } : r));
      } else {
        const newReason = await adminService.createCancellationReason(formData);
        setReasons([...reasons, { _id: Date.now().toString(), ...formData, usage_count: 0 }]);
      }
      setEditModal({ isOpen: false, reason: null });
    } catch (error) {
      console.error('Failed to save cancellation reason:', error);
      alert('Failed to save cancellation reason. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminService.deleteCancellationReason(deleteModal.reason._id);
      setReasons(reasons.filter(r => r._id !== deleteModal.reason._id));
      setDeleteModal({ isOpen: false, reason: null });
    } catch (error) {
      console.error('Failed to delete cancellation reason:', error);
      alert('Failed to delete cancellation reason. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'reason',
      label: 'Reason',
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>
    },
    {
      key: 'user_type',
      label: 'For',
      sortable: true,
      render: (value) => (
        <span className="text-sm capitalize">{value === 'user' ? 'Customer' : 'Driver'}</span>
      )
    },
    {
      key: 'usage_count',
      label: 'Usage Count',
      sortable: true,
      render: (value) => <span className="font-semibold">{value || 0}</span>
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, reason) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setEditModal({ isOpen: true, reason })}
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setDeleteModal({ isOpen: true, reason })}
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
        <div className="text-gray-500">Loading cancellation reasons...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cancellation Reasons</h1>
          <p className="text-gray-600 mt-1">Manage trip cancellation reasons</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setEditModal({ isOpen: true, reason: null })}
        >
          <PlusIcon className="w-4 h-4" />
          Add Reason
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={reasons}
        pageSize={10}
        searchPlaceholder="Search by reason..."
        emptyMessage="No cancellation reasons found"
      />

      <ReasonModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, reason: null })}
        onSave={handleSave}
        reason={editModal.reason}
        saving={saving}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, reason: null })}
        onConfirm={handleDelete}
        title="Delete Cancellation Reason"
        message={`Are you sure you want to delete the reason "${deleteModal.reason?.reason}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}

function ReasonModal({ isOpen, onClose, onSave, reason, saving }) {
  const [formData, setFormData] = useState({
    reason: '',
    user_type: 'user',
  });

  useEffect(() => {
    if (reason) {
      setFormData({
        reason: reason.reason || '',
        user_type: reason.user_type || 'user',
      });
    } else {
      setFormData({
        reason: '',
        user_type: 'user',
      });
    }
  }, [reason, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={reason ? 'Edit Cancellation Reason' : 'Add Cancellation Reason'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          label="Reason"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          placeholder="Enter cancellation reason"
          required
          rows={2}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Available For
          </label>
          <select
            value={formData.user_type}
            onChange={(e) => setFormData({ ...formData, user_type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-joltcab-400"
          >
            <option value="user">Customer</option>
            <option value="provider">Driver</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : reason ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
