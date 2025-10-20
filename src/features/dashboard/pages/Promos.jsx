import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, TicketIcon, CalendarIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Button, Badge, Modal, Input, Textarea, ConfirmModal } from '@/components/ui';

export default function Promos() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({ isOpen: false, promo: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, promo: null });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadPromos();
  }, []);

  const loadPromos = async () => {
    try {
      const response = await adminService.getPromos();
      setPromos(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load promos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    if (!formData.promo_code || !formData.promo_code_type || !formData.discount_value) {
      alert('Please fill all required fields');
      return;
    }

    if (isNaN(formData.discount_value) || formData.discount_value <= 0) {
      alert('Discount value must be a positive number');
      return;
    }

    setSaving(true);
    try {
      if (editModal.promo) {
        await adminService.updatePromo(editModal.promo._id, formData);
      } else {
        await adminService.createPromo(formData);
      }
      setEditModal({ isOpen: false, promo: null });
      await loadPromos();
    } catch (error) {
      console.error('Failed to save promo:', error);
      alert('Failed to save promo. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminService.deletePromo(deleteModal.promo._id);
      setDeleteModal({ isOpen: false, promo: null });
      await loadPromos();
    } catch (error) {
      console.error('Failed to delete promo:', error);
      alert('Failed to delete promo. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const getFilteredPromos = () => {
    if (statusFilter === 'all') return promos;
    return promos.filter(p => statusFilter === 'active' ? p.is_active : !p.is_active);
  };

  const columns = [
    {
      key: 'promo_code',
      label: 'Promo Code',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <TicketIcon className="w-4 h-4 text-joltcab-600" />
          <span className="font-mono font-semibold text-joltcab-700">{value}</span>
        </div>
      )
    },
    {
      key: 'description',
      label: 'Description',
      render: (value) => <span className="text-sm text-gray-600">{value || 'No description'}</span>
    },
    {
      key: 'promo_code_type',
      label: 'Type',
      sortable: true,
      render: (value, promo) => (
        <span className="font-medium">
          {value === 'PERCENTAGE' 
            ? `${promo.discount_value}%` 
            : `$${promo.discount_value}`}
        </span>
      )
    },
    {
      key: 'used_count',
      label: 'Usage',
      sortable: true,
      render: (value, promo) => (
        <div className="text-sm">
          <span className="font-semibold">{value || 0}</span>
          <span className="text-gray-500"> / {promo.max_use_count || 'Unlimited'}</span>
        </div>
      )
    },
    {
      key: 'expiry_date',
      label: 'Expiry',
      sortable: true,
      render: (value) => value ? (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <CalendarIcon className="w-4 h-4" />
          {new Date(value).toLocaleDateString()}
        </div>
      ) : 'No expiry'
    },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <Badge variant={value ? 'success' : 'default'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, promo) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setEditModal({ isOpen: true, promo })}
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setDeleteModal({ isOpen: true, promo })}
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
        <div className="text-gray-500">Loading promos...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promo Codes</h1>
          <p className="text-gray-600 mt-1">Manage promotional codes and discounts</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setEditModal({ isOpen: true, promo: null })}
        >
          <PlusIcon className="w-4 h-4" />
          Add Promo Code
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={getFilteredPromos()}
        pageSize={10}
        searchPlaceholder="Search by code or description..."
        emptyMessage="No promo codes found"
        defaultSort={{ key: 'created_at', direction: 'desc' }}
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
                <option value="inactive">Inactive</option>
              </select>
            </div>
            {statusFilter !== 'all' && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setStatusFilter('all')}
              >
                Clear Filters
              </Button>
            )}
          </>
        }
      />

      <PromoModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, promo: null })}
        onSave={handleSave}
        promo={editModal.promo}
        saving={saving}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, promo: null })}
        onConfirm={handleDelete}
        title="Delete Promo Code"
        message={`Are you sure you want to delete the promo code "${deleteModal.promo?.promo_code}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}

function PromoModal({ isOpen, onClose, onSave, promo, saving }) {
  const [formData, setFormData] = useState({
    promo_code: '',
    description: '',
    promo_code_type: 'PERCENTAGE',
    discount_value: '',
    max_discount: '',
    min_order: '',
    max_use_count: '',
    expiry_date: '',
    is_active: true
  });

  useEffect(() => {
    if (promo) {
      setFormData({
        promo_code: promo.promo_code || '',
        description: promo.description || '',
        promo_code_type: promo.promo_code_type || 'PERCENTAGE',
        discount_value: promo.discount_value || '',
        max_discount: promo.max_discount || '',
        min_order: promo.min_order || '',
        max_use_count: promo.max_use_count || '',
        expiry_date: promo.expiry_date || '',
        is_active: promo.is_active ?? true
      });
    } else {
      setFormData({
        promo_code: '',
        description: '',
        promo_code_type: 'PERCENTAGE',
        discount_value: '',
        max_discount: '',
        min_order: '',
        max_use_count: '',
        expiry_date: '',
        is_active: true
      });
    }
  }, [promo, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={promo ? 'Edit Promo Code' : 'Add Promo Code'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Promo Code"
            value={formData.promo_code}
            onChange={(e) => setFormData({ ...formData, promo_code: e.target.value.toUpperCase() })}
            placeholder="SUMMER25"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Type
            </label>
            <select
              value={formData.promo_code_type}
              onChange={(e) => setFormData({ ...formData, promo_code_type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-joltcab-400"
            >
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="AMOUNT">Fixed Amount ($)</option>
            </select>
          </div>
        </div>

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe this promo code"
          rows={2}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Discount Value"
            type="number"
            value={formData.discount_value}
            onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
            placeholder={formData.promo_code_type === 'PERCENTAGE' ? '25' : '10'}
            required
          />
          <Input
            label="Max Discount ($)"
            type="number"
            value={formData.max_discount}
            onChange={(e) => setFormData({ ...formData, max_discount: e.target.value })}
            placeholder="10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Min Order ($)"
            type="number"
            value={formData.min_order}
            onChange={(e) => setFormData({ ...formData, min_order: e.target.value })}
            placeholder="5"
          />
          <Input
            label="Usage Limit"
            type="number"
            value={formData.max_use_count}
            onChange={(e) => setFormData({ ...formData, max_use_count: e.target.value })}
            placeholder="100"
            required
          />
        </div>

        <Input
          label="Expiry Date"
          type="date"
          value={formData.expiry_date}
          onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
          required
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="w-4 h-4 text-joltcab-600 rounded focus:ring-joltcab-400"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
            Active
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : promo ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
