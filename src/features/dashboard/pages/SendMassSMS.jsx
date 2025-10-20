import { useState } from 'react';
import adminService from '@/services/dashboardService';

export default function SendMassSMS() {
  const [sms, setSms] = useState({
    recipient_type: 'all_users',
    message: '',
    send_to_specific: '',
  });
  const [sending, setSending] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!sms.message) {
      alert('Please enter a message');
      return;
    }

    if (confirm(`Send SMS to ${sms.recipient_type}? Estimated cost: $${estimatedCost.toFixed(2)}`)) {
      setSending(true);
      try {
        const response = await adminService.sendMassSMS(sms);
        alert(`SMS sent successfully to ${response.sent_count || 0} recipients`);
        setSms({
          recipient_type: 'all_users',
          message: '',
          send_to_specific: '',
        });
      } catch (error) {
        console.error('Failed to send SMS:', error);
        alert('Failed to send SMS');
      } finally {
        setSending(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSms(prev => ({ ...prev, [name]: value }));
    
    if (name === 'message') {
      const segments = Math.ceil(value.length / 160);
      setEstimatedCost(segments * 0.05 * getRecipientCount());
    }
  };

  const getRecipientCount = () => {
    switch (sms.recipient_type) {
      case 'all_users': return 1000;
      case 'all_drivers': return 500;
      case 'active_users': return 750;
      case 'active_drivers': return 300;
      case 'specific': return 1;
      default: return 0;
    }
  };

  const segments = Math.ceil(sms.message.length / 160);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Send Mass SMS</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send Form */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Compose SMS</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipients
              </label>
              <select
                name="recipient_type"
                value={sms.recipient_type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="all_users">All Users (~1,000)</option>
                <option value="all_drivers">All Drivers (~500)</option>
                <option value="active_users">Active Users (~750)</option>
                <option value="active_drivers">Active Drivers (~300)</option>
                <option value="specific">Specific Phone Number</option>
              </select>
            </div>

            {sms.recipient_type === 'specific' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="send_to_specific"
                  value={sms.send_to_specific}
                  onChange={handleChange}
                  placeholder="+1234567890"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required={sms.recipient_type === 'specific'}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={sms.message}
                onChange={handleChange}
                rows="5"
                placeholder="SMS message (160 characters per segment)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              ></textarea>
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>{sms.message.length} characters</span>
                <span className={segments > 1 ? 'text-orange-600 font-semibold' : ''}>
                  {segments} segment{segments !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Estimated Cost:</strong> ${estimatedCost.toFixed(2)}
                <br />
                <span className="text-xs">
                  {getRecipientCount()} recipient(s) × {segments} segment(s) × $0.05
                </span>
              </p>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send SMS'}
            </button>
          </form>
        </div>

        {/* Preview & Info */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">SMS Preview</h2>
          
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <div className="bg-white rounded-2xl shadow-md p-4 max-w-xs">
              <div className="bg-green-500 text-white rounded-2xl p-3">
                <p className="text-sm">
                  {sms.message || 'Your SMS message will appear here...'}
                </p>
                <p className="text-xs mt-2 opacity-75 text-right">12:34 PM</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>SMS Guidelines:</strong>
              </p>
              <ul className="text-xs text-blue-700 mt-2 space-y-1 list-disc list-inside">
                <li>Each SMS segment is 160 characters</li>
                <li>Messages over 160 chars are sent as multiple segments</li>
                <li>Include opt-out instructions for compliance</li>
                <li>Avoid sending promotional SMS after 9 PM</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Best Practices:</strong>
              </p>
              <ul className="text-xs text-green-700 mt-2 space-y-1 list-disc list-inside">
                <li>Keep messages short and clear</li>
                <li>Include brand name</li>
                <li>Add call-to-action</li>
                <li>Test with small group first</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
