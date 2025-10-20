import { useState } from 'react';
import adminService from '@/services/dashboardService';

export default function SendMassNotification() {
  const [notification, setNotification] = useState({
    recipient_type: 'all_users',
    title: '',
    message: '',
    send_to_specific: '',
  });
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!notification.title || !notification.message) {
      alert('Please fill in title and message');
      return;
    }

    if (confirm(`Send notification to ${notification.recipient_type}?`)) {
      setSending(true);
      try {
        const response = await adminService.sendMassNotification(notification);
        alert(`Notification sent successfully to ${response.sent_count || 0} recipients`);
        setNotification({
          recipient_type: 'all_users',
          title: '',
          message: '',
          send_to_specific: '',
        });
      } catch (error) {
        console.error('Failed to send notification:', error);
        alert('Failed to send notification');
      } finally {
        setSending(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotification(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Send Mass Notification</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send Form */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Compose Notification</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipients
              </label>
              <select
                name="recipient_type"
                value={notification.recipient_type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="all_users">All Users</option>
                <option value="all_drivers">All Drivers</option>
                <option value="active_users">Active Users</option>
                <option value="active_drivers">Active Drivers</option>
                <option value="specific">Specific User/Driver</option>
              </select>
            </div>

            {notification.recipient_type === 'specific' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User/Driver ID or Email
                </label>
                <input
                  type="text"
                  name="send_to_specific"
                  value={notification.send_to_specific}
                  onChange={handleChange}
                  placeholder="Enter ID or email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required={notification.recipient_type === 'specific'}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={notification.title}
                onChange={handleChange}
                placeholder="Notification title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={notification.message}
                onChange={handleChange}
                rows="5"
                placeholder="Notification message"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              ></textarea>
              <p className="text-sm text-gray-500 mt-1">
                {notification.message.length} characters
              </p>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send Notification'}
            </button>
          </form>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Preview</h2>
          
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="bg-white rounded-lg shadow-md p-4 max-w-sm">
              <div className="flex items-start space-x-3">
                <div className="bg-green-500 text-white p-2 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">
                    {notification.title || 'Notification Title'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message || 'Your notification message will appear here...'}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">Just now</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This notification will be sent via push notification to all devices registered to the selected recipients.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
