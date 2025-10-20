import { useState, useEffect } from 'react';
import { PlusIcon, ChatBubbleLeftRightIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Badge, StatCard, Modal, Input, Textarea, Button } from '@/components/ui';

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState({ isOpen: false, ticket: null });
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    pending: 0,
    closed: 0
  });
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadTickets();
  }, [statusFilter]);

  const loadTickets = async () => {
    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await adminService.getSupportTickets(params);
      const ticketData = response.data?.data || [];
      
      setTickets(ticketData);
      
      setStats({
        total: ticketData.length,
        open: ticketData.filter(t => t.status === 'open').length,
        pending: ticketData.filter(t => t.status === 'pending').length,
        closed: ticketData.filter(t => t.status === 'closed').length
      });
    } catch (error) {
      console.error('Failed to load support tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseTicket = async (ticketId) => {
    try {
      await adminService.closeSupportTicket(ticketId);
      await loadTickets();
      setViewModal({ isOpen: false, ticket: null });
    } catch (error) {
      console.error('Failed to close ticket:', error);
      alert('Failed to close ticket. Please try again.');
    }
  };

  const handleReopenTicket = async (ticketId) => {
    try {
      await adminService.reopenSupportTicket(ticketId);
      await loadTickets();
      setViewModal({ isOpen: false, ticket: null });
    } catch (error) {
      console.error('Failed to reopen ticket:', error);
      alert('Failed to reopen ticket. Please try again.');
    }
  };

  const columns = [
    {
      key: 'ticket_id',
      label: 'Ticket ID',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm font-semibold text-gray-700">#{value || 'N/A'}</span>
      )
    },
    {
      key: 'user',
      label: 'User',
      sortable: true,
      render: (value, ticket) => (
        <div>
          <p className="font-medium text-gray-900">
            {value?.first_name && value?.last_name 
              ? `${value.first_name} ${value.last_name}`
              : ticket.user_name || 'N/A'}
          </p>
          {value?.email && (
            <p className="text-xs text-gray-500">{value.email}</p>
          )}
        </div>
      )
    },
    {
      key: 'subject',
      label: 'Subject',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-900">{value || 'No subject'}</span>
      )
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (value) => {
        const category = value ? value.charAt(0).toUpperCase() + value.slice(1) : 'General';
        return (
          <Badge variant="default">{category}</Badge>
        );
      }
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (value) => {
        const priority = value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Normal';
        const variant = 
          value === 'high' ? 'danger' :
          value === 'medium' ? 'warning' :
          'default';
        return <Badge variant={variant}>{priority}</Badge>;
      }
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => {
        const status = value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Open';
        const variant = 
          value === 'closed' ? 'success' :
          value === 'pending' ? 'warning' :
          value === 'open' ? 'primary' :
          'default';
        return <Badge variant={variant}>{status}</Badge>;
      }
    },
    {
      key: 'created_at',
      label: 'Created',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600">
          {value ? new Date(value).toLocaleDateString() : 'N/A'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, ticket) => (
        <Button
          variant="ghost"
          size="xs"
          onClick={() => setViewModal({ isOpen: true, ticket })}
        >
          View
        </Button>
      )
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-500 mt-1">Manage customer support requests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Tickets"
          value={stats.total}
          icon={ChatBubbleLeftRightIcon}
        />
        <StatCard
          title="Open"
          value={stats.open}
          icon={ClockIcon}
          iconColor="text-blue-500"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={ClockIcon}
          iconColor="text-yellow-500"
        />
        <StatCard
          title="Closed"
          value={stats.closed}
          icon={CheckCircleIcon}
          iconColor="text-green-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 mb-6">
        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joltcab-green-500 focus:border-transparent"
            >
              <option value="all">All Tickets</option>
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={tickets}
          loading={loading}
          emptyMessage="No support tickets found"
          pageSize={10}
          searchPlaceholder="Search by ticket ID, user, or subject..."
        />
      </div>

      {viewModal.isOpen && viewModal.ticket && (
        <Modal
          isOpen={viewModal.isOpen}
          onClose={() => setViewModal({ isOpen: false, ticket: null })}
          title={`Ticket #${viewModal.ticket.ticket_id || 'N/A'}`}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <Badge variant={
                  viewModal.ticket.status === 'closed' ? 'success' :
                  viewModal.ticket.status === 'pending' ? 'warning' :
                  'primary'
                }>
                  {viewModal.ticket.status ? viewModal.ticket.status.charAt(0).toUpperCase() + viewModal.ticket.status.slice(1) : 'Open'}
                </Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <Badge variant={
                  viewModal.ticket.priority === 'high' ? 'danger' :
                  viewModal.ticket.priority === 'medium' ? 'warning' :
                  'default'
                }>
                  {viewModal.ticket.priority ? viewModal.ticket.priority.charAt(0).toUpperCase() + viewModal.ticket.priority.slice(1) : 'Normal'}
                </Badge>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
              <p className="text-gray-900">
                {viewModal.ticket.user?.first_name && viewModal.ticket.user?.last_name
                  ? `${viewModal.ticket.user.first_name} ${viewModal.ticket.user.last_name}`
                  : viewModal.ticket.user_name || 'N/A'}
              </p>
              {viewModal.ticket.user?.email && (
                <p className="text-sm text-gray-500">{viewModal.ticket.user.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <p className="text-gray-900">{viewModal.ticket.subject || 'No subject'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {viewModal.ticket.message || viewModal.ticket.description || 'No message'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
              <p className="text-gray-900">
                {viewModal.ticket.created_at ? new Date(viewModal.ticket.created_at).toLocaleString() : 'N/A'}
              </p>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              {viewModal.ticket.status !== 'closed' ? (
                <Button
                  variant="success"
                  onClick={() => handleCloseTicket(viewModal.ticket._id)}
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  Close Ticket
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => handleReopenTicket(viewModal.ticket._id)}
                >
                  Reopen Ticket
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => setViewModal({ isOpen: false, ticket: null })}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
