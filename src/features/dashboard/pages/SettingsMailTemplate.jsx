import { useState, useEffect } from 'react';
import { PencilIcon, EnvelopeIcon, EyeIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Button, Modal, Input, Textarea, Badge } from '@/components/ui';

export default function SettingsMailTemplate() {
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
      const data = await adminService.getMailTemplates();
      setTemplates(data.templates || generateMockTemplates());
    } catch (error) {
      console.error('Failed to load mail templates:', error);
      setTemplates(generateMockTemplates());
    } finally {
      setLoading(false);
    }
  };

  const generateMockTemplates = () => [
    {
      _id: '1',
      name: 'Welcome Email',
      slug: 'welcome_email',
      subject: 'Welcome to JoltCab!',
      body: 'Hi {{user_name}}, welcome to JoltCab. We are excited to have you on board!',
      variables: ['user_name', 'app_name'],
      is_active: true,
    },
    {
      _id: '2',
      name: 'Trip Confirmation',
      slug: 'trip_confirmation',
      subject: 'Trip Confirmed - {{trip_id}}',
      body: 'Your trip {{trip_id}} has been confirmed. Driver: {{driver_name}}, Pickup: {{pickup_location}}',
      variables: ['trip_id', 'driver_name', 'pickup_location', 'user_name'],
      is_active: true,
    },
    {
      _id: '3',
      name: 'Password Reset',
      slug: 'password_reset',
      subject: 'Reset Your Password',
      body: 'Hi {{user_name}}, click here to reset your password: {{reset_link}}',
      variables: ['user_name', 'reset_link'],
      is_active: true,
    },
  ];

  const handleSave = async (formData) => {
    if (!formData.subject || !formData.body) {
      alert('Please fill all required fields');
      return;
    }

    setSaving(true);
    try {
      await adminService.updateMailTemplate(editModal.template._id, formData);
      setTemplates(templates.map(t => t._id === editModal.template._id ? { ...t, ...formData } : t));
      setEditModal({ isOpen: false, template: null });
    } catch (error) {
      console.error('Failed to save mail template:', error);
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
          <EnvelopeIcon className="w-5 h-5 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{template.slug}</p>
          </div>
        </div>
      )
    },
    {
      key: 'subject',
      label: 'Subject',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-700">{value}</span>
      )
    },
    {
      key: 'variables',
      label: 'Variables',
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value?.slice(0, 3).map((variable, idx) => (
            <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
              {`{{${variable}}}`}
            </span>
          ))}
          {value?.length > 3 && (
            <span className="text-xs text-gray-500">+{value.length - 3} more</span>
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
        <div className="text-gray-500">Loading mail templates...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mail Template</h1>
        <p className="text-gray-600 mt-1">Manage email notification templates</p>
      </div>

      <DataTable
        columns={columns}
        data={templates}
        pageSize={10}
        searchPlaceholder="Search by template name..."
        emptyMessage="No mail templates found"
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
    subject: '',
    body: '',
    is_active: true,
  });

  useEffect(() => {
    if (template) {
      setFormData({
        subject: template.subject || '',
        body: template.body || '',
        is_active: template.is_active ?? true,
      });
    }
  }, [template, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Template: ${template?.name}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="Email subject line"
          required
        />

        <Textarea
          label="Body"
          value={formData.body}
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          placeholder="Email body content"
          rows={8}
          required
        />

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
          <Button variant="primary" type="submit" disabled={saving}>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-900">{template?.subject}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Body:</label>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{template?.body}</p>
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
