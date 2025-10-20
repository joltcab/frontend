import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Button, Badge, Modal } from '@/components/ui';

export default function Dispatchers() {
  const [dispatchers, setDispatchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDispatcher, setEditingDispatcher] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: ''
  });

  useEffect(() => {
    loadDispatchers();
  }, []);

  const loadDispatchers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDispatchers();
      setDispatchers(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load dispatchers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (dispatcher = null) => {
    if (dispatcher) {
      setEditingDispatcher(dispatcher);
      setFormData({
        first_name: dispatcher.first_name || '',
        last_name: dispatcher.last_name || '',
        email: dispatcher.email || '',
        password: '',
        phone: dispatcher.phone || ''
      });
    } else {
      setEditingDispatcher(null);
      setFormData({ first_name: '', last_name: '', email: '', password: '', phone: '' });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...formData };
      if (editingDispatcher && !dataToSubmit.password) {
        delete dataToSubmit.password;
      }
      if (editingDispatcher) {
        await adminService.updateDispatcher(editingDispatcher._id, dataToSubmit);
      } else {
        await adminService.createDispatcher(dataToSubmit);
      }
      setModalOpen(false);
      loadDispatchers();
    } catch (error) {
      console.error('Failed to save dispatcher:', error);
      alert(error.response?.data?.message || 'Failed to save dispatcher');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this dispatcher?')) return;
    try {
      await adminService.deleteDispatcher(id);
      loadDispatchers();
    } catch (error) {
      console.error('Failed to delete dispatcher:', error);
      alert('Failed to delete dispatcher');
    }
  };

  const handleToggleActive = async (dispatcher) => {
    try {
      if (dispatcher.is_active) {
        await adminService.deactivateDispatcher(dispatcher._id);
      } else {
        await adminService.activateDispatcher(dispatcher._id);
      }
      loadDispatchers();
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
      render: (_, dispatcher) => (
        <div className="font-medium text-gray-900">{dispatcher.first_name} {dispatcher.last_name}</div>
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
      render: (_, dispatcher) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleOpenModal(dispatcher)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleToggleActive(dispatcher)}
            className={`p-1.5 rounded ${dispatcher.is_active ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}
            title={dispatcher.is_active ? 'Deactivate' : 'Activate'}
          >
            {dispatcher.is_active ? <XCircleIcon className="w-5 h-5" /> : <CheckCircleIcon className="w-5 h-5" />}
          </button>
          <button onClick={() => handleDelete(dispatcher._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
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
          <h1 className="text-3xl font-bold text-gray-900">Dispatchers</h1>
          <p className="text-gray-600 mt-1">Manage dispatcher accounts</p>
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={<PlusIcon className="w-5 h-5" />}>Add Dispatcher</Button>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200">
        <DataTable columns={columns} data={dispatchers} loading={loading} emptyMessage="No dispatchers found" />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingDispatcher ? 'Edit Dispatcher' : 'Add Dispatcher'}>
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
            <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joltcab-500 focus:border-transparent" placeholder="dispatcher@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password {!editingDispatcher && '*'}</label>
            <input type="password" required={!editingDispatcher} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joltcab-500 focus:border-transparent" placeholder={editingDispatcher ? 'Leave blank to keep current' : 'Enter password'} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joltcab-500 focus:border-transparent" placeholder="+1 (555) 123-4567" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingDispatcher ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
