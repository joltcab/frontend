import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, LockClosedIcon, LockOpenIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Button, Badge, Modal } from '@/components/ui';

export default function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [formData, setFormData] = useState({
    hotel_name: '',
    email: '',
    phone: '',
    contact_person: '',
    address: ''
  });

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      setLoading(true);
      const response = await adminService.getHotels();
      setHotels(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (hotel = null) => {
    if (hotel) {
      setEditingHotel(hotel);
      setFormData({
        hotel_name: hotel.hotel_name || '',
        email: hotel.email || '',
        phone: hotel.phone || '',
        contact_person: hotel.contact_person || '',
        address: hotel.address || ''
      });
    } else {
      setEditingHotel(null);
      setFormData({ hotel_name: '', email: '', phone: '', contact_person: '', address: '' });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHotel) {
        await adminService.updateHotel(editingHotel._id, formData);
      } else {
        await adminService.createHotel(formData);
      }
      setModalOpen(false);
      loadHotels();
    } catch (error) {
      console.error('Failed to save hotel:', error);
      alert(error.response?.data?.message || 'Failed to save hotel');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this hotel?')) return;
    try {
      await adminService.deleteHotel(id);
      loadHotels();
    } catch (error) {
      console.error('Failed to delete hotel:', error);
      alert('Failed to delete hotel');
    }
  };

  const handleBlock = async (hotel) => {
    try {
      if (hotel.is_blocked) {
        await adminService.unblockHotel(hotel._id);
      } else {
        await adminService.blockHotel(hotel._id);
      }
      loadHotels();
    } catch (error) {
      console.error('Failed to toggle block status:', error);
      alert('Failed to update block status');
    }
  };

  const columns = [
    {
      key: 'hotel_name',
      label: 'Hotel Name',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
          <span className="font-medium text-gray-900">{value}</span>
        </div>
      )
    },
    { key: 'contact_person', label: 'Contact Person', sortable: true },
    { key: 'email', label: 'Email', sortable: false, render: (value) => <span className="text-sm text-gray-600">{value}</span> },
    { key: 'phone', label: 'Phone', sortable: false, render: (value) => <span className="text-sm text-gray-600">{value}</span> },
    {
      key: 'is_blocked',
      label: 'Status',
      sortable: true,
      render: (value) => <Badge variant={value ? 'danger' : 'success'}>{value ? 'Blocked' : 'Active'}</Badge>
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, hotel) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleOpenModal(hotel)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleBlock(hotel)}
            className={`p-1.5 rounded ${hotel.is_blocked ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'}`}
            title={hotel.is_blocked ? 'Unblock' : 'Block'}
          >
            {hotel.is_blocked ? <LockOpenIcon className="w-5 h-5" /> : <LockClosedIcon className="w-5 h-5" />}
          </button>
          <button onClick={() => handleDelete(hotel._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
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
          <h1 className="text-3xl font-bold text-gray-900">Hotel Partners</h1>
          <p className="text-gray-600 mt-1">Manage hotel partner accounts</p>
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={<PlusIcon className="w-5 h-5" />}>Add Hotel</Button>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200">
        <DataTable columns={columns} data={hotels} loading={loading} emptyMessage="No hotel partners found" />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingHotel ? 'Edit Hotel Partner' : 'Add Hotel Partner'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name *</label>
            <input
              type="text"
              required
              value={formData.hotel_name}
              onChange={(e) => setFormData({ ...formData, hotel_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joltcab-500 focus:border-transparent"
              placeholder="Enter hotel name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joltcab-500 focus:border-transparent"
              placeholder="hotel@example.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
              <input
                type="text"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joltcab-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joltcab-500 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joltcab-500 focus:border-transparent"
              placeholder="123 Hotel Ave, City, State 12345"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingHotel ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
