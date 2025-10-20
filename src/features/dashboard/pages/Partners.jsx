import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Button, Badge, Modal } from '@/components/ui';

export default function Partners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    company_name: ''
  });

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      setLoading(true);
      const response = await adminService.getPartners();
      setPartners(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (partner = null) => {
    if (partner) {
      setEditingPartner(partner);
      setFormData({
        first_name: partner.first_name || '',
        last_name: partner.last_name || '',
        email: partner.email || '',
        password: '',
        phone: partner.phone || '',
        company_name: partner.company_name || ''
      });
    } else {
      setEditingPartner(null);
      setFormData({ first_name: '', last_name: '', email: '', password: '', phone: '', company_name: '' });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...formData };
      if (editingPartner && !dataToSubmit.password) {
        delete dataToSubmit.password;
      }
      if (editingPartner) {
        await adminService.updatePartner(editingPartner._id, dataToSubmit);
      } else {
        await adminService.createPartner(dataToSubmit);
      }
      setModalOpen(false);
      loadPartners();
    } catch (error) {
      console.error('Failed to save partner:', error);
      alert(error.response?.data?.message || 'Failed to save partner');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this partner?')) return;
    try {
      await adminService.deletePartner(id);
      loadPartners();
    } catch (error) {
      console.error('Failed to delete partner:', error);
      alert('Failed to delete partner');
    }
  };

  const handleToggleActive = async (partner) => {
    try {
      if (partner.is_active) {
        await adminService.deactivatePartner(partner._id);
      } else {
        await adminService.activatePartner(partner._id);
      }
      loadPartners();
    } catch (error) {
      console.error('Failed to toggle active status:', error);
      alert('Failed to update active status');
    }
  };

  const columns = [
    {
      key: 'first_name',
      label: 'Name',
      sortable: true,
      render: (_, partner) => (
        <div>
          <p className="font-medium text-gray-900">{partner.first_name} {partner.last_name}</p>
          {partner.company_name && <p className="text-xs text-gray-500">{partner.company_name}</p>}
        </div>
      )
    },
    { key: 'email', label: 'Email', sortable: false, render: (value) => <span className="text-sm text-gray-600">{value}</span> },
    { key: 'phone', label: 'Phone', sortable: false, render: (value) => <span className="text-sm text-gray-600">{value}</span> },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
      render: (value) => <Badge variant={value ? 'success' : 'secondary'}>{value ? 'Active' : 'Inactive'}</Badge>
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, partner) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleOpenModal(partner)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleToggleActive(partner)}
            className={`p-1.5 rounded ${partner.is_active ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}
            title={partner.is_active ? 'Deactivate' : 'Activate'}
          >
            {partner.is_active ? <XCircleIcon className="w-5 h-5" /> : <CheckCircleIcon className="w-5 h-5" />}
          </button>
          <button onClick={() => handleDelete(partner._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
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
          <h1 className="text-3xl font-bold text-gray-900">Partners</h1>
          <p className="text-gray-600 mt-1">Manage general partner accounts</p>
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={<PlusIcon className="w-5 h-5" />}>Add Partner</Button>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200">
        <DataTable columns={columns} data={partners} loading={loading} emptyMessage="No partners found" />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingPartner ? 'Edit Partner' : 'Add Partner'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input type="text" required value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joltcab-500 focus:border-transparent" placeholder="John" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input type="text" required value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joltcab-500 focus:border-transparent" placeholder="Doe" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joltcab-500 focus:border-transparent" placeholder="partner@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password {!editingPartner && '*'}</label>
            <input type="password" required={!editingPartner} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joltcab-500 focus:border-transparent" placeholder={editingPartner ? 'Leave blank to keep current' : 'Enter password'} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joltcab-500 focus:border-transparent" placeholder="+1 (555) 123-4567" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input type="text" value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joltcab-500 focus:border-transparent" placeholder="Company Inc." />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingPartner ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
