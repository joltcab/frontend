import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, LanguageIcon, CheckIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Button, Badge, Modal, Input, ConfirmModal } from '@/components/ui';

export default function SettingsLanguages() {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({ isOpen: false, language: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, language: null });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadLanguages();
  }, []);

  const loadLanguages = async () => {
    try {
      const data = await adminService.getLanguages();
      setLanguages(data.languages || generateMockLanguages());
    } catch (error) {
      console.error('Failed to load languages:', error);
      setLanguages(generateMockLanguages());
    } finally {
      setLoading(false);
    }
  };

  const generateMockLanguages = () => [
    {
      _id: '1',
      name: 'English',
      code: 'en',
      is_default: true,
      is_active: true,
      translation_progress: 100,
    },
    {
      _id: '2',
      name: 'Spanish',
      code: 'es',
      is_default: false,
      is_active: true,
      translation_progress: 95,
    },
    {
      _id: '3',
      name: 'French',
      code: 'fr',
      is_default: false,
      is_active: true,
      translation_progress: 88,
    },
  ];

  const handleSetDefault = async (languageId) => {
    try {
      await adminService.setDefaultLanguage(languageId);
      setLanguages(languages.map(l => ({
        ...l,
        is_default: l._id === languageId
      })));
    } catch (error) {
      console.error('Failed to set default language:', error);
      alert('Failed to set default language. Please try again.');
    }
  };

  const handleSave = async (formData) => {
    if (!formData.name || !formData.code) {
      alert('Please fill all required fields');
      return;
    }

    setSaving(true);
    try {
      if (editModal.language) {
        await adminService.updateLanguage(editModal.language._id, formData);
        setLanguages(languages.map(l => l._id === editModal.language._id ? { ...l, ...formData } : l));
      } else {
        await adminService.createLanguage(formData);
        setLanguages([...languages, { _id: Date.now().toString(), ...formData, translation_progress: 0 }]);
      }
      setEditModal({ isOpen: false, language: null });
    } catch (error) {
      console.error('Failed to save language:', error);
      alert('Failed to save language. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminService.deleteLanguage(deleteModal.language._id);
      setLanguages(languages.filter(l => l._id !== deleteModal.language._id));
      setDeleteModal({ isOpen: false, language: null });
    } catch (error) {
      console.error('Failed to delete language:', error);
      alert('Failed to delete language. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Language',
      sortable: true,
      render: (value, lang) => (
        <div className="flex items-center gap-2">
          <LanguageIcon className="w-5 h-5 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">Code: {lang.code}</p>
          </div>
        </div>
      )
    },
    {
      key: 'translation_progress',
      label: 'Progress',
      sortable: true,
      render: (value) => (
        <div className="w-full">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">{value}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-joltcab-500 h-2 rounded-full transition-all"
              style={{ width: `${value}%` }}
            ></div>
          </div>
        </div>
      )
    },
    {
      key: 'is_default',
      label: 'Default',
      sortable: true,
      render: (value, lang) => (
        value ? (
          <div className="flex items-center gap-1 text-green-600">
            <CheckIcon className="w-4 h-4" />
            <span className="text-sm">Default</span>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => handleSetDefault(lang._id)}
          >
            Set Default
          </Button>
        )
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
      render: (_, lang) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setEditModal({ isOpen: true, language: lang })}
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
          {!lang.is_default && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setDeleteModal({ isOpen: true, language: lang })}
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          )}
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading languages...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Languages</h1>
          <p className="text-gray-600 mt-1">Manage application languages and translations</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setEditModal({ isOpen: true, language: null })}
        >
          <PlusIcon className="w-4 h-4" />
          Add Language
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={languages}
        pageSize={10}
        searchPlaceholder="Search by language name or code..."
        emptyMessage="No languages found"
      />

      <LanguageModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, language: null })}
        onSave={handleSave}
        language={editModal.language}
        saving={saving}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, language: null })}
        onConfirm={handleDelete}
        title="Delete Language"
        message={`Are you sure you want to delete "${deleteModal.language?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}

function LanguageModal({ isOpen, onClose, onSave, language, saving }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    is_active: true,
  });

  useEffect(() => {
    if (language) {
      setFormData({
        name: language.name || '',
        code: language.code || '',
        is_active: language.is_active ?? true,
      });
    } else {
      setFormData({
        name: '',
        code: '',
        is_active: true,
      });
    }
  }, [language, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language ? 'Edit Language' : 'Add Language'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Language Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., English, Spanish, French"
          required
        />

        <Input
          label="Language Code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase() })}
          placeholder="e.g., en, es, fr"
          maxLength={5}
          required
        />

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
            {saving ? 'Saving...' : language ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
