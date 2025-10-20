import { useState, useEffect } from 'react';
import { PencilIcon, ChatBubbleLeftIcon, EyeIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Button, Modal, Textarea, Badge } from '@/components/ui';

export default function SettingsSMSTemplate() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({ isOpen: false, template: null });
  const [previewModal, setPreviewModal] = useState({ isOpen: false, template: null });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await adminService.getSMSTemplates();
      setTemplates(data.templates || generateMockTemplates());
    } catch (error) {
      console.error('Failed to load SMS templates:', error);
      setTemplates(generateMockTemplates());
    } finally {
      setLoading(false);
    }
  };

  const generateMockTemplates = () => [
    {
      _id: '1',
      name: 'Trip Confirmation',
      slug: 'trip_confirmation_sms',
      message: 'JoltCab: Trip {{trip_id}} confirmed. Driver {{driver_name}} will pick you up at {{pickup_location}}.',
      variables: ['trip_id', 'driver_name', 'pickup_location'],
      character_count: 95,
      is_active: true,
    },
    {
      _id: '2',
      name: 'Driver Arrived',
      slug: 'driver_arrived_sms',
      message: 'JoltCab: Your driver {{driver_name}} has arrived at {{pickup_location}}.',
      variables: ['driver_name', 'pickup_location'],
      character_count: 68,
      is_active: true,
    },
    {
      _id: '3',
      name: 'Trip Completed',
      slug: 'trip_completed_sms',
      message: 'JoltCab: Trip completed. Total fare: ${{fare}}. Thank you for riding with us!',
      variables: ['fare'],
      character_count: 72,
      is_active: true,
    },
    {
      _id: '4',
      name: 'OTP Verification',
      slug: 'otp_verification_sms',
      message: 'JoltCab: Your verification code is {{otp}}. Do not share this code with anyone.',
      variables: ['otp'],
      character_count: 75,
      is_active: true,
    },
  ];

  const handleSave = async (formData) => {
    if (!formData.message) {
      alert('Please fill the message field');
      return;
    }

    if (formData.message.length > 160) {
      alert('SMS message should not exceed 160 characters');
      return;
    }

    setSaving(true);
    try {
      await adminService.updateSMSTemplate(editModal.template._id, formData);
      setTemplates(templates.map(t => 
        t._id === editModal.template._id 
          ? { ...t, ...formData, character_count: formData.message.length } 
          : t
      ));
      setEditModal({ isOpen: false, template: null });
    } catch (error) {
      console.error('Failed to save SMS template:', error);
      alert('Failed to save template. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Template Name',
      sortable: true,
      render: (value, template) => (
        <div className="flex items-center gap-2">
          <ChatBubbleLeftIcon className="w-5 h-5 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{template.slug}</p>
          </div>
        </div>
      )
    },
    {
      key: 'message',
      label: 'Message Preview',
      render: (value) => (
        <span className="text-sm text-gray-700 line-clamp-2">{value}</span>
      )
    },
    {
      key: 'character_count',
      label: 'Length',
      sortable: true,
      render: (value) => (
        <div>
          <span className={`text-sm font-medium ${value > 160 ? 'text-red-600' : 'text-gray-900'}`}>
            {value}
          </span>
          <span className="text-xs text-gray-500"> / 160</span>
        </div>
      )
    },
    {
      key: 'variables',
      label: 'Variables',
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value?.slice(0, 2).map((variable, idx) => (
            <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
              {`{{${variable}}}`}
            </span>
          ))}
          {value?.length > 2 && (
            <span className="text-xs text-gray-500">+{value.length - 2}</span>
          )}
        </div>
      )
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
      render: (_, template) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setPreviewModal({ isOpen: true, template })}
          >
            <EyeIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setEditModal({ isOpen: true, template })}
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading SMS templates...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">SMS Template</h1>
        <p className="text-gray-600 mt-1">Manage SMS notification templates</p>
      </div>

      <DataTable
        columns={columns}
        data={templates}
        pageSize={10}
        searchPlaceholder="Search by template name..."
        emptyMessage="No SMS templates found"
      />

      <TemplateModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, template: null })}
        onSave={handleSave}
        template={editModal.template}
        saving={saving}
      />

      <PreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ isOpen: false, template: null })}
        template={previewModal.template}
      />
    </div>
  );
}

function TemplateModal({ isOpen, onClose, onSave, template, saving }) {
  const [formData, setFormData] = useState({
    message: '',
    is_active: true,
  });

  useEffect(() => {
    if (template) {
      setFormData({
        message: template.message || '',
        is_active: template.is_active ?? true,
      });
    }
  }, [template, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const characterCount = formData.message.length;
  const isOverLimit = characterCount > 160;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Template: ${template?.name}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <Textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="SMS message content"
            rows={4}
            required
          />
          <div className="flex items-center justify-between mt-1">
            <p className={`text-sm ${isOverLimit ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
              {characterCount} / 160 characters
            </p>
            {isOverLimit && (
              <p className="text-xs text-red-600">Message exceeds SMS limit</p>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800 font-medium mb-1">Available Variables:</p>
          <div className="flex flex-wrap gap-2">
            {template?.variables?.map((variable, idx) => (
              <code key={idx} className="text-xs bg-white px-2 py-1 rounded border border-blue-200">
                {`{{${variable}}}`}
              </code>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="w-4 h-4 text-joltcab-600 rounded focus:ring-joltcab-500"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
            Active
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={saving || isOverLimit}>
            {saving ? 'Saving...' : 'Update'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function PreviewModal({ isOpen, onClose, template }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Preview: ${template?.name}`}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-start gap-3">
              <ChatBubbleLeftIcon className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{template?.message}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Length: {template?.character_count} characters
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
