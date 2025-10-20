import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, LockClosedIcon, LockOpenIcon, UsersIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Button, Badge, Modal } from '@/components/ui';

export default function Corporate() {
  const [corporates, setCorporates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCorporate, setEditingCorporate] = useState(null);
  const [formData, setFormData] = useState({
    company_name: '',
    email: '',
    phone: '',
    contact_person: '',
    address: '',
    credit_limit: ''
  });

  useEffect(() => {
    loadCorporates();
  }, []);

  const loadCorporates = async () => {
    try {
      setLoading(true);
      const response = await adminService.getCorporates();
      setCorporates(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load corporates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (corporate = null) => {
    if (corporate) {
      setEditingCorporate(corporate);
      setFormData({
        company_name: corporate.company_name || '',
        email: corporate.email || '',
        phone: corporate.phone || '',
        contact_person: corporate.contact_person || '',
        address: corporate.address || '',
        credit_limit: corporate.credit_limit || ''
      });
    } else {
      setEditingCorporate(null);
      setFormData({
        company_name: '',
        email: '',
        phone: '',
        contact_person: '',
        address: '',
        credit_limit: ''
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCorporate) {
        await adminService.updateCorporate(editingCorporate._id, formData);
      } else {
        await adminService.createCorporate(formData);
      }
      setModalOpen(false);
      loadCorporates();
    } catch (error) {
      console.error('Failed to save corporate:', error);
      alert(error.response?.data?.message || 'Failed to save corporate');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this corporate?')) return;
    
    try {
      await adminService.deleteCorporate(id);
      loadCorporates();
    } catch (error) {
      console.error('Failed to delete corporate:', error);
      alert('Failed to delete corporate');
    }
  };

  const handleBlock = async (corporate) => {
    try {
      if (corporate.is_blocked) {
        await adminService.unblockCorporate(corporate._id);
      } else {
        await adminService.blockCorporate(corporate._id);
      }
      loadCorporates();
    } catch (error) {
      console.error('Failed to toggle block status:', error);
      alert('Failed to update block status');
    }
  };

  const columns = [
    {
      key: 'company_name',
      label: 'Company',
      sortable: true,
      render: (value) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    {
      key: 'contact_person',
      label: 'Contact Person',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: false,
      render: (value) => (
        <span className="text-sm text-gray-600">{value}</span>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: false,
      render: (value) => (
        <span className="text-sm text-gray-600">{value}</span>
      )
    },
    {
      key: 'credit_limit',
      label: 'Credit Limit',
      sortable: true,
      render: (value) => (
        <span className="text-sm font-semibold text-gray-700">
          ${value ? parseFloat(value).toFixed(2) : '0.00'}
        </span>
      )
    },
    {
      key: 'is_blocked',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <Badge variant={value ? 'danger' : 'success'}>
          {value ? 'Blocked' : 'Active'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, corporate) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenModal(corporate)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleBlock(corporate)}
            className={`p-1.5 rounded transition-colors ${
              corporate.is_blocked
                ? 'text-green-600 hover:bg-green-50'
                : 'text-orange-600 hover:bg-orange-50'
            }`}
            title={corporate.is_blocked ? 'Unblock' : 'Block'}
          >
            {corporate.is_blocked ? (
              <LockOpenIcon className="w-5 h-5" />
            ) : (
              <LockClosedIcon className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => handleDelete(corporate._id)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Corporate Accounts</h1>
          <p className="text-gray-600 mt-1">Manage corporate partners and their credit limits</p>
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={<PlusIcon className="w-5 h-5" />}>
          Add Corporate
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200">
        <DataTable
          columns={columns}
          data={corporates}
          loading={loading}
          emptyMessage="No corporate accounts found"
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCorporate ? 'Edit Corporate Account' : 'Add Corporate Account'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              required
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joltcab-500 focus:border-transparent"
              placeholder="Enter company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joltcab-500 focus:border-transparent"
              placeholder="company@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person
            </label>
            <input
              type="text"
              value={formData.contact_person}
              onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joltcab-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joltcab-500 focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joltcab-500 focus:border-transparent"
              placeholder="123 Business St, City, State 12345"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Credit Limit ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.credit_limit}
              onChange={(e) => setFormData({ ...formData, credit_limit: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joltcab-500 focus:border-transparent"
              placeholder="5000.00"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingCorporate ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
