import { useState, useEffect, useRef } from 'react';
import { adminService } from '@/services/dashboardService';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

export default function AdminInstallationSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [settings, setSettings] = useState({});
  const [installationSettings, setInstallationSettings] = useState({});
  
  const fileInputRefs = {
    site_logo: useRef(null),
    title_icon: useRef(null),
    mail_title_image: useRef(null),
    authorised_signature: useRef(null),
    secondary_logo: useRef(null)
  };

  useEffect(() => {
    loadSettings();
    loadInstallationSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await adminService.getSettings();
      setSettings(response.data?.settings || {});
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInstallationSettings = async () => {
    try {
      const response = await adminService.getInstallationSettings();
      setInstallationSettings(response.data?.installationSettings || {});
    } catch (error) {
      console.error('Failed to load installation settings:', error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminService.updateSettings(settings);
      alert('Settings updated successfully');
    } catch (error) {
      console.error('Failed to update settings:', error);
      alert('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveInstallation = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminService.updateInstallationSettings(installationSettings);
      alert('Installation settings updated successfully');
    } catch (error) {
      console.error('Failed to update installation settings:', error);
      alert('Failed to update installation settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked :
              type === 'number' ? parseFloat(value) || 0 :
              value
    }));
  };

  const handleInstallationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInstallationSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked :
              type === 'number' ? parseFloat(value) || 0 :
              value
    }));
  };

  const handleImageUpload = async (fieldName, file) => {
    if (!file) return;
    
    setUploading(prev => ({ ...prev, [fieldName]: true }));
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await adminService.uploadImage(formData);
      
      if (response.data?.success) {
        setSettings(prev => ({
          ...prev,
          [fieldName]: response.data.imageUrl
        }));
        alert('Image uploaded successfully');
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading settings...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Installation Settings</h1>
        <p className="text-gray-600 mt-2">Configure your application settings and integrations</p>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200">
        <Tabs defaultValue="basic">
          <div className="p-6 border-b border-gray-200">
            <TabsList>
              <TabsTrigger value="basic">Basic Settings</TabsTrigger>
              <TabsTrigger value="theme">Theme Settings</TabsTrigger>
              <TabsTrigger value="installation">Installation Settings</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="twilio">Twilio (SMS)</TabsTrigger>
              <TabsTrigger value="payment">Payment Gateway</TabsTrigger>
              <TabsTrigger value="email">Email (SMTP)</TabsTrigger>
              <TabsTrigger value="firebase">Firebase</TabsTrigger>
              <TabsTrigger value="maps">Google Maps</TabsTrigger>
              <TabsTrigger value="apps">App URLs & Versions</TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            {/* Basic Settings Tab */}
            <TabsContent value="basic">
              <form onSubmit={handleSave}>
                <div className="space-y-8">
                  {/* App Information Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">App Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          App Name
                        </label>
                        <input
                          type="text"
                          name="app_name"
                          value={settings.app_name || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Site Description
                        </label>
                        <textarea
                          name="site_description"
                          value={settings.site_description || ''}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Admin Panel Name
                        </label>
                        <input
                          type="text"
                          name="admin_panel_name"
                          value={settings.admin_panel_name || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Partner Panel Name
                        </label>
                        <input
                          type="text"
                          name="partner_panel_name"
                          value={settings.partner_panel_name || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dispatcher Panel Name
                        </label>
                        <input
                          type="text"
                          name="dispatcher_panel_name"
                          value={settings.dispatcher_panel_name || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hotel Panel Name
                        </label>
                        <input
                          type="text"
                          name="hotel_panel_name"
                          value={settings.hotel_panel_name || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website URL
                        </label>
                        <input
                          type="url"
                          name="website_url"
                          value={settings.website_url || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="https://joltcab.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Branding Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Branding</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Site Logo URL
                        </label>
                        <input
                          type="url"
                          name="site_logo"
                          value={settings.site_logo || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="https://example.com/logo.png"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Site Favicon URL
                        </label>
                        <input
                          type="url"
                          name="site_favicon"
                          value={settings.site_favicon || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="https://example.com/favicon.ico"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Copyright Text
                        </label>
                        <input
                          type="text"
                          name="copyright_text"
                          value={settings.copyright_text || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="© 2025 JoltCab. All rights reserved."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country Code
                        </label>
                        <input
                          type="text"
                          name="country_code"
                          value={settings.country_code || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="+1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Number
                        </label>
                        <input
                          type="tel"
                          name="contact_number"
                          value={settings.contact_number || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SOS / Emergency Number
                        </label>
                        <input
                          type="tel"
                          name="sos_number"
                          value={settings.sos_number || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="+1 (555) 999-9999"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Admin Phone
                        </label>
                        <input
                          type="tel"
                          name="admin_phone"
                          value={settings.admin_phone || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Admin Email
                        </label>
                        <input
                          type="email"
                          name="admin_email"
                          value={settings.admin_email || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="admin@joltcab.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Us Email
                        </label>
                        <input
                          type="email"
                          name="contactUsEmail"
                          value={settings.contactUsEmail || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="contact@joltcab.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location Settings Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Default Location (Map Center)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Latitude
                        </label>
                        <input
                          type="number"
                          name="latitude"
                          value={(settings.location && settings.location[0]) || ''}
                          onChange={(e) => {
                            const newLocation = [...(settings.location || [0, 0])];
                            newLocation[0] = parseFloat(e.target.value) || 0;
                            handleChange({ target: { name: 'location', value: newLocation } });
                          }}
                          step="0.000001"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="40.7128"
                        />
                        <p className="text-xs text-gray-500 mt-1">Default latitude for map center</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Longitude
                        </label>
                        <input
                          type="number"
                          name="longitude"
                          value={(settings.location && settings.location[1]) || ''}
                          onChange={(e) => {
                            const newLocation = [...(settings.location || [0, 0])];
                            newLocation[1] = parseFloat(e.target.value) || 0;
                            handleChange({ target: { name: 'location', value: newLocation } });
                          }}
                          step="0.000001"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="-74.0060"
                        />
                        <p className="text-xs text-gray-500 mt-1">Default longitude for map center</p>
                      </div>
                    </div>
                  </div>

                  {/* Operational Settings Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Operational Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Driver Search Radius (km)
                        </label>
                        <input
                          type="number"
                          name="driver_search_radius"
                          value={settings.driver_search_radius || 5}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          min="1"
                        />
                        <p className="text-xs text-gray-500 mt-1">How far drivers can see ride requests</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Driver Request Timeout (seconds)
                        </label>
                        <input
                          type="number"
                          name="driver_request_timeout"
                          value={settings.driver_request_timeout || 30}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          min="10"
                        />
                        <p className="text-xs text-gray-500 mt-1">Time before request expires</p>
                      </div>
                    </div>
                  </div>

                  {/* Commission & Tax Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Commission & Tax</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Site Commission (%)
                        </label>
                        <input
                          type="number"
                          name="commission_percentage"
                          value={settings.commission_percentage || 0}
                          onChange={handleChange}
                          step="0.1"
                          min="0"
                          max="100"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Driver Commission (%)
                        </label>
                        <input
                          type="number"
                          name="driver_commission_percentage"
                          value={settings.driver_commission_percentage || 0}
                          onChange={handleChange}
                          step="0.1"
                          min="0"
                          max="100"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tax Percentage (%)
                        </label>
                        <input
                          type="number"
                          name="tax_percentage"
                          value={settings.tax_percentage || 0}
                          onChange={handleChange}
                          step="0.1"
                          min="0"
                          max="100"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing Configuration Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Pricing Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Base Fare ($)
                        </label>
                        <input
                          type="number"
                          name="base_fare"
                          value={settings.base_fare || 0}
                          onChange={handleChange}
                          step="0.01"
                          min="0"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cost per KM ($)
                        </label>
                        <input
                          type="number"
                          name="cost_per_km"
                          value={settings.cost_per_km || 0}
                          onChange={handleChange}
                          step="0.01"
                          min="0"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cost per Mile ($)
                        </label>
                        <input
                          type="number"
                          name="cost_per_mile"
                          value={settings.cost_per_mile || 0}
                          onChange={handleChange}
                          step="0.01"
                          min="0"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cost per Minute ($)
                        </label>
                        <input
                          type="number"
                          name="cost_per_minute"
                          value={settings.cost_per_minute || 0}
                          onChange={handleChange}
                          step="0.01"
                          min="0"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Distance ({settings.distance_unit || 'km'})
                        </label>
                        <input
                          type="number"
                          name="minimum_distance"
                          value={settings.minimum_distance || 0}
                          onChange={handleChange}
                          step="0.1"
                          min="0"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Waiting Fare per Minute ($)
                        </label>
                        <input
                          type="number"
                          name="waiting_fare_per_minute"
                          value={settings.waiting_fare_per_minute || 0}
                          onChange={handleChange}
                          step="0.01"
                          min="0"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Night Surcharge (%)
                        </label>
                        <input
                          type="number"
                          name="night_surcharge_percentage"
                          value={settings.night_surcharge_percentage || 0}
                          onChange={handleChange}
                          step="0.1"
                          min="0"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Night Surcharge Start Time
                        </label>
                        <input
                          type="time"
                          name="night_surcharge_start_time"
                          value={settings.night_surcharge_start_time || '22:00'}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Night Surcharge End Time
                        </label>
                        <input
                          type="time"
                          name="night_surcharge_end_time"
                          value={settings.night_surcharge_end_time || '06:00'}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Modes Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Payment Modes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="cash_payment_enabled"
                          checked={settings.cash_payment_enabled !== false}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Cash Payment</span>
                          <p className="text-xs text-gray-500">Allow customers to pay with cash</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="card_payment_enabled"
                          checked={settings.card_payment_enabled !== false}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Card Payment</span>
                          <p className="text-xs text-gray-500">Allow customers to pay with credit/debit card</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="wallet_payment_enabled"
                          checked={settings.wallet_payment_enabled !== false}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Wallet Payment</span>
                          <p className="text-xs text-gray-500">Allow customers to pay from their wallet balance</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="corporate_payment_enabled"
                          checked={settings.corporate_payment_enabled !== false}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Corporate Payment</span>
                          <p className="text-xs text-gray-500">Allow corporate/business account payments</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Verification & Features Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Verification & Features</h3>
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="otp_verification_enabled"
                          checked={settings.otp_verification_enabled !== false}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">OTP Verification</span>
                          <p className="text-xs text-gray-500">Require phone/email OTP verification for new users</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="driver_approval_required"
                          checked={settings.driver_approval_required !== false}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Driver Approval Required</span>
                          <p className="text-xs text-gray-500">Manually approve drivers before they can accept rides</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="referral_program_enabled"
                          checked={settings.referral_program_enabled !== false}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Referral Program</span>
                          <p className="text-xs text-gray-500">Enable user and driver referral rewards</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="surge_pricing_enabled"
                          checked={settings.surge_pricing_enabled || false}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Surge Pricing</span>
                          <p className="text-xs text-gray-500">Enable dynamic pricing during high demand</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Company Information Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Company Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          name="company_name"
                          value={settings.company_name || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tax ID / Registration Number
                        </label>
                        <input
                          type="text"
                          name="tax_id"
                          value={settings.tax_id || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Address
                        </label>
                        <textarea
                          name="company_address"
                          value={settings.company_address || ''}
                          onChange={handleChange}
                          rows="2"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Phone
                        </label>
                        <input
                          type="tel"
                          name="company_phone"
                          value={settings.company_phone || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Email
                        </label>
                        <input
                          type="email"
                          name="contact_email"
                          value={settings.contact_email || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Support Email
                        </label>
                        <input
                          type="email"
                          name="support_email"
                          value={settings.support_email || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Regional Settings Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Regional Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Currency Code
                        </label>
                        <input
                          type="text"
                          name="currency"
                          value={settings.currency || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="USD"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Currency Symbol
                        </label>
                        <input
                          type="text"
                          name="currency_symbol"
                          value={settings.currency_symbol || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="$"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Language
                        </label>
                        <select
                          name="language"
                          value={settings.language || 'en'}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="ar">Arabic</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timezone
                        </label>
                        <input
                          type="text"
                          name="timezone"
                          value={settings.timezone || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="America/New_York"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date Format
                        </label>
                        <select
                          name="date_format"
                          value={settings.date_format || 'MM/DD/YYYY'}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Time Format
                        </label>
                        <select
                          name="time_format"
                          value={settings.time_format || '12h'}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                          <option value="12h">12 Hour</option>
                          <option value="24h">24 Hour</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Distance Unit
                        </label>
                        <select
                          name="distance_unit"
                          value={settings.distance_unit || 'miles'}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                          <option value="miles">Miles</option>
                          <option value="km">Kilometers</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* App Configuration Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">App Configuration</h3>
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="maintenance_mode"
                          checked={settings.maintenance_mode || false}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Maintenance Mode</span>
                          <p className="text-xs text-gray-500">Temporarily disable access to the platform</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="allow_new_registrations"
                          checked={settings.allow_new_registrations !== false}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Allow New Registrations</span>
                          <p className="text-xs text-gray-500">Enable new users to register accounts</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="require_email_verification"
                          checked={settings.require_email_verification !== false}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Require Email Verification</span>
                          <p className="text-xs text-gray-500">Users must verify email before using the platform</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="require_phone_verification"
                          checked={settings.require_phone_verification !== false}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Require Phone Verification</span>
                          <p className="text-xs text-gray-500">Users must verify phone number before using the platform</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="auto_assign_drivers"
                          checked={settings.auto_assign_drivers !== false}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Auto-Assign Drivers</span>
                          <p className="text-xs text-gray-500">Automatically assign nearest available driver to trip requests</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Social Media Links Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Social Media Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Facebook URL
                        </label>
                        <input
                          type="url"
                          name="facebook_url"
                          value={settings.facebook_url || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="https://facebook.com/joltcab"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Twitter URL
                        </label>
                        <input
                          type="url"
                          name="twitter_url"
                          value={settings.twitter_url || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="https://twitter.com/joltcab"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Instagram URL
                        </label>
                        <input
                          type="url"
                          name="instagram_url"
                          value={settings.instagram_url || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="https://instagram.com/joltcab"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          LinkedIn URL
                        </label>
                        <input
                          type="url"
                          name="linkedin_url"
                          value={settings.linkedin_url || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="https://linkedin.com/company/joltcab"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Advanced Operational Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Advanced Operational Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Provider Timeout (seconds)
                        </label>
                        <input
                          type="number"
                          name="provider_timeout"
                          value={settings.provider_timeout || 30}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Time to wait for provider response</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Provider Offline Minutes
                        </label>
                        <input
                          type="number"
                          name="provider_offline_min"
                          value={settings.provider_offline_min || 3}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Minutes before marking provider as offline</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default Search Radius (km/miles)
                        </label>
                        <input
                          type="number"
                          name="default_Search_radious"
                          value={settings.default_Search_radious || 5}
                          onChange={handleChange}
                          step="0.1"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Scheduled Request Pre-Start Minutes
                        </label>
                        <input
                          type="number"
                          name="scheduled_request_pre_start_minute"
                          value={settings.scheduled_request_pre_start_minute || 15}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Minutes before scheduled trip to start matching</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Tries for Scheduled Requests
                        </label>
                        <input
                          type="number"
                          name="number_of_try_for_scheduled_request"
                          value={settings.number_of_try_for_scheduled_request || 3}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Find Nearest Driver Type
                        </label>
                        <select
                          name="find_nearest_driver_type"
                          value={settings.find_nearest_driver_type || 1}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                          <option value={1}>Closest Driver First</option>
                          <option value={2}>Broadcast to All</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Request Send to Number of Providers
                        </label>
                        <input
                          type="number"
                          name="request_send_to_no_of_providers"
                          value={settings.request_send_to_no_of_providers || 10}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Maximum providers to notify per request</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Change Provider Tolerance
                        </label>
                        <input
                          type="number"
                          name="change_provider_tolerance"
                          value={settings.change_provider_tolerance || 0}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Regional Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Additional Regional Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country Name
                        </label>
                        <input
                          type="text"
                          name="countryname"
                          value={settings.countryname || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="United States"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Admin Currency Code
                        </label>
                        <input
                          type="text"
                          name="adminCurrencyCode"
                          value={settings.adminCurrencyCode || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="USD"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Admin Currency Symbol
                        </label>
                        <input
                          type="text"
                          name="adminCurrency"
                          value={settings.adminCurrency || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="$"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Admin Timezone
                        </label>
                        <input
                          type="text"
                          name="adminTimeZone"
                          value={settings.adminTimeZone || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="America/New_York"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timezone for Display Date
                        </label>
                        <input
                          type="text"
                          name="timezone_for_display_date"
                          value={settings.timezone_for_display_date || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="America/New_York"
                        />
                      </div>
                    </div>
                  </div>

                  {/* App Security */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">App Security Passphrases</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          User App Passphrase
                        </label>
                        <input
                          type="password"
                          name="user_passphrase"
                          value={settings.user_passphrase || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="********************************"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Provider App Passphrase
                        </label>
                        <input
                          type="password"
                          name="provider_passphrase"
                          value={settings.provider_passphrase || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="********************************"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Verification & Notification Toggles */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Verification & Notification Settings</h3>
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="userEmailVerification"
                          checked={settings.userEmailVerification === true}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">User Email Verification</span>
                          <p className="text-xs text-gray-500">Enable email verification for user accounts</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="providerEmailVerification"
                          checked={settings.providerEmailVerification === true}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Provider Email Verification</span>
                          <p className="text-xs text-gray-500">Enable email verification for provider accounts</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="userSms"
                          checked={settings.userSms === true}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">User SMS Notifications</span>
                          <p className="text-xs text-gray-500">Send SMS notifications to users</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="providerSms"
                          checked={settings.providerSms === true}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Provider SMS Notifications</span>
                          <p className="text-xs text-gray-500">Send SMS notifications to providers</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="sms_notification"
                          checked={settings.sms_notification !== false}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">SMS Notification System</span>
                          <p className="text-xs text-gray-500">Global SMS notification toggle</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="email_notification"
                          checked={settings.email_notification !== false}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Email Notification System</span>
                          <p className="text-xs text-gray-500">Global email notification toggle</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="userPath"
                          checked={settings.userPath === true}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">User Path Tracking</span>
                          <p className="text-xs text-gray-500">Track and display user trip path</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="providerPath"
                          checked={settings.providerPath === true}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Provider Path Tracking</span>
                          <p className="text-xs text-gray-500">Track and display provider trip path</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Referral Program Advanced Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Referral Program Advanced Settings</h3>
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="get_referral_profit_on_card_payment"
                          checked={settings.get_referral_profit_on_card_payment !== false}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Referral Profit on Card Payment</span>
                          <p className="text-xs text-gray-500">Award referral rewards on card payments</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="get_referral_profit_on_cash_payment"
                          checked={settings.get_referral_profit_on_cash_payment !== false}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Referral Profit on Cash Payment</span>
                          <p className="text-xs text-gray-500">Award referral rewards on cash payments</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Saving Changes...' : 'Save Basic Settings'}
                  </button>
                </div>
              </form>
            </TabsContent>

            {/* Theme Settings Tab */}
            <TabsContent value="theme">
              <form onSubmit={handleSave}>
                <div className="space-y-8">
                  {/* Logo */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Logo</h4>
                    
                    {settings.site_logo && (
                      <div className="mb-4">
                        <img 
                          src={settings.site_logo} 
                          alt="Logo"
                          className="max-h-32 border border-gray-300 rounded"
                        />
                      </div>
                    )}
                    
                    {!settings.site_logo && (
                      <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded">
                        <p className="text-sm text-gray-600">Not upload any image</p>
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-600 mb-4">
                      Please Upload image in .png format (dimension: 250 x 250).
                    </p>
                    
                    <div className="flex gap-3 items-center">
                      <input
                        type="file"
                        ref={fileInputRefs.site_logo}
                        onChange={(e) => setSelectedFiles(prev => ({ ...prev, site_logo: e.target.files[0] }))}
                        accept=".png,.jpg,.jpeg,.gif,.webp"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRefs.site_logo.current?.click()}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                      >
                        Browse
                      </button>
                      <button
                        type="button"
                        onClick={() => handleImageUpload('site_logo', selectedFiles.site_logo)}
                        disabled={!selectedFiles.site_logo || uploading.site_logo}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
                      >
                        {uploading.site_logo ? 'Uploading...' : 'Upload'}
                      </button>
                      {selectedFiles.site_logo && (
                        <span className="text-sm text-gray-600">
                          {selectedFiles.site_logo.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title Icon */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Title Icon</h4>
                    
                    {settings.title_icon && (
                      <div className="mb-4">
                        <img 
                          src={settings.title_icon} 
                          alt="Title Icon"
                          className="max-h-32 border border-gray-300 rounded"
                        />
                      </div>
                    )}
                    
                    {!settings.title_icon && (
                      <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded">
                        <p className="text-sm text-gray-600">Not upload any image</p>
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-600 mb-4">
                      Please Upload image in .png format (dimension: 45 x 45).
                    </p>
                    
                    <div className="flex gap-3 items-center">
                      <input
                        type="file"
                        ref={fileInputRefs.title_icon}
                        onChange={(e) => setSelectedFiles(prev => ({ ...prev, title_icon: e.target.files[0] }))}
                        accept=".png,.jpg,.jpeg,.gif,.webp"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRefs.title_icon.current?.click()}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                      >
                        Browse
                      </button>
                      <button
                        type="button"
                        onClick={() => handleImageUpload('title_icon', selectedFiles.title_icon)}
                        disabled={!selectedFiles.title_icon || uploading.title_icon}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
                      >
                        {uploading.title_icon ? 'Uploading...' : 'Upload'}
                      </button>
                      {selectedFiles.title_icon && (
                        <span className="text-sm text-gray-600">
                          {selectedFiles.title_icon.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mail Title Image */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Mail Title Image</h4>
                    
                    {settings.mail_title_image && (
                      <div className="mb-4">
                        <img 
                          src={settings.mail_title_image} 
                          alt="Mail Title Image"
                          className="max-h-32 border border-gray-300 rounded"
                        />
                      </div>
                    )}
                    
                    {!settings.mail_title_image && (
                      <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded">
                        <p className="text-sm text-gray-600">Not upload any image</p>
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-600 mb-4">
                      Please Upload image in .png format (dimension: 1024 x 265).
                    </p>
                    
                    <div className="flex gap-3 items-center">
                      <input
                        type="file"
                        ref={fileInputRefs.mail_title_image}
                        onChange={(e) => setSelectedFiles(prev => ({ ...prev, mail_title_image: e.target.files[0] }))}
                        accept=".png,.jpg,.jpeg,.gif,.webp"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRefs.mail_title_image.current?.click()}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                      >
                        Browse
                      </button>
                      <button
                        type="button"
                        onClick={() => handleImageUpload('mail_title_image', selectedFiles.mail_title_image)}
                        disabled={!selectedFiles.mail_title_image || uploading.mail_title_image}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
                      >
                        {uploading.mail_title_image ? 'Uploading...' : 'Upload'}
                      </button>
                      {selectedFiles.mail_title_image && (
                        <span className="text-sm text-gray-600">
                          {selectedFiles.mail_title_image.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Authorised Signature */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Authorised Signature</h4>
                    
                    {settings.authorised_signature && (
                      <div className="mb-4">
                        <img 
                          src={settings.authorised_signature} 
                          alt="Authorised Signature"
                          className="max-h-32 border border-gray-300 rounded"
                        />
                      </div>
                    )}
                    
                    {!settings.authorised_signature && (
                      <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded">
                        <p className="text-sm text-gray-600">Not upload any image</p>
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-600 mb-4">
                      Please Upload image in .png format (dimension: 45 x 45).
                    </p>
                    
                    <div className="flex gap-3 items-center">
                      <input
                        type="file"
                        ref={fileInputRefs.authorised_signature}
                        onChange={(e) => setSelectedFiles(prev => ({ ...prev, authorised_signature: e.target.files[0] }))}
                        accept=".png,.jpg,.jpeg,.gif,.webp"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRefs.authorised_signature.current?.click()}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                      >
                        Browse
                      </button>
                      <button
                        type="button"
                        onClick={() => handleImageUpload('authorised_signature', selectedFiles.authorised_signature)}
                        disabled={!selectedFiles.authorised_signature || uploading.authorised_signature}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
                      >
                        {uploading.authorised_signature ? 'Uploading...' : 'Upload'}
                      </button>
                      {selectedFiles.authorised_signature && (
                        <span className="text-sm text-gray-600">
                          {selectedFiles.authorised_signature.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Secondary Logo */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Secondary Logo</h4>
                    
                    {settings.secondary_logo && (
                      <div className="mb-4">
                        <img 
                          src={settings.secondary_logo} 
                          alt="Secondary Logo"
                          className="max-h-32 border border-gray-300 rounded"
                        />
                      </div>
                    )}
                    
                    {!settings.secondary_logo && (
                      <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded">
                        <p className="text-sm text-gray-600">Not upload any image</p>
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-600 mb-4">
                      Please Upload image in .png format (dimension: 121 x 45).
                    </p>
                    
                    <div className="flex gap-3 items-center">
                      <input
                        type="file"
                        ref={fileInputRefs.secondary_logo}
                        onChange={(e) => setSelectedFiles(prev => ({ ...prev, secondary_logo: e.target.files[0] }))}
                        accept=".png,.jpg,.jpeg,.gif,.webp"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRefs.secondary_logo.current?.click()}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                      >
                        Browse
                      </button>
                      <button
                        type="button"
                        onClick={() => handleImageUpload('secondary_logo', selectedFiles.secondary_logo)}
                        disabled={!selectedFiles.secondary_logo || uploading.secondary_logo}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
                      >
                        {uploading.secondary_logo ? 'Uploading...' : 'Upload'}
                      </button>
                      {selectedFiles.secondary_logo && (
                        <span className="text-sm text-gray-600">
                          {selectedFiles.secondary_logo.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Saving Changes...' : 'Save Theme Settings'}
                  </button>
                </div>
              </form>
            </TabsContent>

            {/* Installation Settings Tab */}
            <TabsContent value="installation">
              <form onSubmit={handleSaveInstallation}>
                <div className="space-y-8">
                  {/* Twilio Configuration */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Twilio SMS Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Twilio Account SID
                        </label>
                        <input
                          type="text"
                          name="twilio_account_sid"
                          value={installationSettings.twilio_account_sid || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Twilio Auth Token
                        </label>
                        <input
                          type="password"
                          name="twilio_auth_token"
                          value={installationSettings.twilio_auth_token || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="********************************"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Twilio Phone Number
                        </label>
                        <input
                          type="text"
                          name="twilio_phone_number"
                          value={installationSettings.twilio_phone_number || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="+1234567890"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stripe Payment Gateway */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Stripe Payment Gateway</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stripe Publishable Key
                        </label>
                        <input
                          type="text"
                          name="stripe_publishable_key"
                          value={installationSettings.stripe_publishable_key || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="pk_test_xxxxxxxxxxxxx"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stripe Secret Key
                        </label>
                        <input
                          type="password"
                          name="stripe_secret_key"
                          value={installationSettings.stripe_secret_key || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="sk_test_xxxxxxxxxxxxx"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Google Maps API Keys */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Google Maps API Keys</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Web API Key
                        </label>
                        <input
                          type="text"
                          name="google_maps_api_key_web"
                          value={installationSettings.google_maps_api_key_web || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Road/Directions API Key
                        </label>
                        <input
                          type="text"
                          name="google_maps_api_key_road"
                          value={installationSettings.google_maps_api_key_road || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Android User App API Key
                        </label>
                        <input
                          type="text"
                          name="google_maps_api_key_android_user"
                          value={installationSettings.google_maps_api_key_android_user || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Android Provider App API Key
                        </label>
                        <input
                          type="text"
                          name="google_maps_api_key_android_provider"
                          value={installationSettings.google_maps_api_key_android_provider || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          iOS User App API Key
                        </label>
                        <input
                          type="text"
                          name="google_maps_api_key_ios_user"
                          value={installationSettings.google_maps_api_key_ios_user || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          iOS Provider App API Key
                        </label>
                        <input
                          type="text"
                          name="google_maps_api_key_ios_provider"
                          value={installationSettings.google_maps_api_key_ios_provider || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Firebase Configuration */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Firebase Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Firebase API Key
                        </label>
                        <input
                          type="text"
                          name="firebase_api_key"
                          value={installationSettings.firebase_api_key || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Firebase Auth Domain
                        </label>
                        <input
                          type="text"
                          name="firebase_auth_domain"
                          value={installationSettings.firebase_auth_domain || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="yourapp.firebaseapp.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Firebase Database URL
                        </label>
                        <input
                          type="text"
                          name="firebase_database_url"
                          value={installationSettings.firebase_database_url || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="https://yourapp.firebaseio.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Firebase Project ID
                        </label>
                        <input
                          type="text"
                          name="firebase_project_id"
                          value={installationSettings.firebase_project_id || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="yourapp-12345"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Firebase Storage Bucket
                        </label>
                        <input
                          type="text"
                          name="firebase_storage_bucket"
                          value={installationSettings.firebase_storage_bucket || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="yourapp.appspot.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Firebase Messaging Sender ID
                        </label>
                        <input
                          type="text"
                          name="firebase_messaging_sender_id"
                          value={installationSettings.firebase_messaging_sender_id || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="123456789012"
                        />
                      </div>
                    </div>
                  </div>

                  {/* GCM/FCM Push Notification Keys */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Push Notification Server Keys (GCM/FCM)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          User Android App Server Key
                        </label>
                        <input
                          type="text"
                          name="gcm_sender_key_user_android"
                          value={installationSettings.gcm_sender_key_user_android || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="AAAAxxxxxxxx:APA91bFXXXXXXXXXXXXXXXX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          User iOS App Server Key
                        </label>
                        <input
                          type="text"
                          name="gcm_sender_key_user_ios"
                          value={installationSettings.gcm_sender_key_user_ios || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="AAAAxxxxxxxx:APA91bFXXXXXXXXXXXXXXXX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Provider Android App Server Key
                        </label>
                        <input
                          type="text"
                          name="gcm_sender_key_provider_android"
                          value={installationSettings.gcm_sender_key_provider_android || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="AAAAxxxxxxxx:APA91bFXXXXXXXXXXXXXXXX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Provider iOS App Server Key
                        </label>
                        <input
                          type="text"
                          name="gcm_sender_key_provider_ios"
                          value={installationSettings.gcm_sender_key_provider_ios || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="AAAAxxxxxxxx:APA91bFXXXXXXXXXXXXXXXX"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mobile App URLs */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Mobile App Store URLs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Android User App URL
                        </label>
                        <input
                          type="url"
                          name="android_user_app_url"
                          value={installationSettings.android_user_app_url || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="https://play.google.com/store/apps/details?id=..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Android Provider App URL
                        </label>
                        <input
                          type="url"
                          name="android_provider_app_url"
                          value={installationSettings.android_provider_app_url || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="https://play.google.com/store/apps/details?id=..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          iOS User App URL
                        </label>
                        <input
                          type="url"
                          name="ios_user_app_url"
                          value={installationSettings.ios_user_app_url || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="https://apps.apple.com/app/..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          iOS Provider App URL
                        </label>
                        <input
                          type="url"
                          name="ios_provider_app_url"
                          value={installationSettings.ios_provider_app_url || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="https://apps.apple.com/app/..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          App Store Link (General)
                        </label>
                        <input
                          type="url"
                          name="app_store_link"
                          value={installationSettings.app_store_link || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="https://apps.apple.com/app/..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Google Play Link (General)
                        </label>
                        <input
                          type="url"
                          name="google_play_link"
                          value={installationSettings.google_play_link || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="https://play.google.com/store/apps/details?id=..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* App Security Passphrases */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">App Security Passphrases</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          User Android App Passphrase
                        </label>
                        <input
                          type="password"
                          name="user_android_app_passphrase"
                          value={installationSettings.user_android_app_passphrase || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="********************************"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Provider Android App Passphrase
                        </label>
                        <input
                          type="password"
                          name="provider_android_app_passphrase"
                          value={installationSettings.provider_android_app_passphrase || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="********************************"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          User iOS App Passphrase
                        </label>
                        <input
                          type="password"
                          name="user_ios_app_passphrase"
                          value={installationSettings.user_ios_app_passphrase || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="********************************"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Provider iOS App Passphrase
                        </label>
                        <input
                          type="password"
                          name="provider_ios_app_passphrase"
                          value={installationSettings.provider_ios_app_passphrase || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="********************************"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Website & Panel Configuration */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Website & Admin Panel</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Main Website URL
                        </label>
                        <input
                          type="url"
                          name="main_website_url"
                          value={installationSettings.main_website_url || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="https://joltcab.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Admin Panel URL
                        </label>
                        <input
                          type="url"
                          name="main_panel_url"
                          value={installationSettings.main_panel_url || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="https://admin.joltcab.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Miscellaneous Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Miscellaneous Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Invoice Prefix
                        </label>
                        <input
                          type="text"
                          name="invoice_prefix"
                          value={installationSettings.invoice_prefix || ''}
                          onChange={handleInstallationChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="INV-"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Referral Wallet Amount ($)
                        </label>
                        <input
                          type="number"
                          name="referral_wallet_amount"
                          value={installationSettings.referral_wallet_amount || 0}
                          onChange={handleInstallationChange}
                          step="0.01"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="10.00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Referral Bonus ($)
                        </label>
                        <input
                          type="number"
                          name="referral_bonus"
                          value={installationSettings.referral_bonus || 0}
                          onChange={handleInstallationChange}
                          step="0.01"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="5.00"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button for Installation Settings */}
                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold disabled:opacity-50 transition-colors"
                    >
                      {saving ? 'Saving Installation Settings...' : 'Save Installation Settings'}
                    </button>
                  </div>
                </div>
              </form>
            </TabsContent>

            {/* Financial Settings Tab */}
            <TabsContent value="financial">
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission Percentage (%)
                    </label>
                    <input
                      type="number"
                      name="commission_percentage"
                      value={settings.commission_percentage || 0}
                      onChange={handleChange}
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cancellation Fee ($)
                    </label>
                    <input
                      type="number"
                      name="cancellation_fee"
                      value={settings.cancellation_fee || 0}
                      onChange={handleChange}
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Wallet Balance ($)
                    </label>
                    <input
                      type="number"
                      name="min_wallet_balance"
                      value={settings.min_wallet_balance || 0}
                      onChange={handleChange}
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Referral Reward Amount ($)
                    </label>
                    <input
                      type="number"
                      name="referral_reward_amount"
                      value={settings.referral_reward_amount || 0}
                      onChange={handleChange}
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Driver Referral Reward ($)
                    </label>
                    <input
                      type="number"
                      name="driver_referral_reward"
                      value={settings.driver_referral_reward || 0}
                      onChange={handleChange}
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Driver Referral Trips Required
                    </label>
                    <input
                      type="number"
                      name="driver_referral_trips_required"
                      value={settings.driver_referral_trips_required || 0}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User Referral Reward ($)
                    </label>
                    <input
                      type="number"
                      name="user_referral_reward"
                      value={settings.user_referral_reward || 0}
                      onChange={handleChange}
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Saving Changes...' : 'Save Financial Settings'}
                  </button>
                </div>
              </form>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <form onSubmit={handleSave}>
                <div className="space-y-6">
                  {/* Communication Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Communication Notifications</h3>
                    <div className="space-y-4">
                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          name="sms_notification"
                          checked={settings.sms_notification !== false}
                          onChange={handleChange}
                          className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">SMS Notification</span>
                          <p className="text-xs text-gray-500">Send SMS Notification.</p>
                        </div>
                      </label>

                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          name="email_notification"
                          checked={settings.email_notification !== false}
                          onChange={handleChange}
                          className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">E-mail Notification</span>
                          <p className="text-xs text-gray-500">Send E-mail Notification.</p>
                        </div>
                      </label>

                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          name="push_notifications"
                          checked={settings.push_notifications !== false}
                          onChange={handleChange}
                          className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Push Notifications</span>
                          <p className="text-xs text-gray-500">Enable push notifications for mobile apps.</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Path Tracking */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Path Tracking</h3>
                    <div className="space-y-4">
                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          name="userPath"
                          checked={settings.userPath === true}
                          onChange={handleChange}
                          className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Draw road path in User app</span>
                          <p className="text-xs text-gray-500">User Path.</p>
                        </div>
                      </label>

                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          name="providerPath"
                          checked={settings.providerPath === true}
                          onChange={handleChange}
                          className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Draw road path in Provider app</span>
                          <p className="text-xs text-gray-500">Provider Path.</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Referral Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Referral Program</h3>
                    <div className="space-y-4">
                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          name="get_referral_profit_on_card_payment"
                          checked={settings.get_referral_profit_on_card_payment !== false}
                          onChange={handleChange}
                          className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Get referral profit on card payment</span>
                          <p className="text-xs text-gray-500">Referral bonus can be cut while card payment.</p>
                        </div>
                      </label>

                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          name="get_referral_profit_on_cash_payment"
                          checked={settings.get_referral_profit_on_cash_payment !== false}
                          onChange={handleChange}
                          className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Get referral profit on cash payment</span>
                          <p className="text-xs text-gray-500">Referral bonus can be cut while cash payment.</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Verification Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Verification Settings</h3>
                    <div className="space-y-4">
                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          name="userEmailVerification"
                          checked={settings.userEmailVerification === true}
                          onChange={handleChange}
                          className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">User Email Verification</span>
                          <p className="text-xs text-gray-500">Send Email Verification Code.</p>
                        </div>
                      </label>

                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          name="providerEmailVerification"
                          checked={settings.providerEmailVerification === true}
                          onChange={handleChange}
                          className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Provider Email Verification</span>
                          <p className="text-xs text-gray-500">Send Email Verification Code.</p>
                        </div>
                      </label>

                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          name="userSms"
                          checked={settings.userSms === true}
                          onChange={handleChange}
                          className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">User Mobile Number Verification</span>
                          <p className="text-xs text-gray-500">Send SMS Verification Code For User Mobile Number Verification.</p>
                        </div>
                      </label>

                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          name="providerSms"
                          checked={settings.providerSms === true}
                          onChange={handleChange}
                          className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Provider Mobile Number Verification</span>
                          <p className="text-xs text-gray-500">Send SMS Verification Code For Provider Mobile Number Verification.</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Trip Features */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Trip Features</h3>
                    <div className="space-y-4">
                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          name="tip_enabled"
                          checked={settings.tip_enabled !== false}
                          onChange={handleChange}
                          className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Tip</span>
                          <p className="text-xs text-gray-500">Tip On/Off for Trip.</p>
                        </div>
                      </label>

                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          name="toll_enabled"
                          checked={settings.toll_enabled !== false}
                          onChange={handleChange}
                          className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Toll</span>
                          <p className="text-xs text-gray-500">Toll On/Off for Trip.</p>
                        </div>
                      </label>

                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          name="provider_initiate_trip"
                          checked={settings.provider_initiate_trip !== false}
                          onChange={handleChange}
                          className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Provider Initiate Trip</span>
                          <p className="text-xs text-gray-500">Provider Initiate Trip</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Force Update Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Force Update</h3>
                    <div className="space-y-4">
                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          name="android_user_app_force_update"
                          checked={settings.android_user_app_force_update === true}
                          onChange={handleChange}
                          className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Android User App Force Update</span>
                          <p className="text-xs text-gray-500">Android User App Force Update.</p>
                        </div>
                      </label>

                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          name="android_provider_app_force_update"
                          checked={settings.android_provider_app_force_update === true}
                          onChange={handleChange}
                          className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Android Provider App Force Update</span>
                          <p className="text-xs text-gray-500">Android Provider App Force Update.</p>
                        </div>
                      </label>

                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          name="ios_user_app_force_update"
                          checked={settings.ios_user_app_force_update === true}
                          onChange={handleChange}
                          className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">IOS User App Force Update</span>
                          <p className="text-xs text-gray-500">IOS User App Force Update.</p>
                        </div>
                      </label>

                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          name="ios_provider_app_force_update"
                          checked={settings.ios_provider_app_force_update === true}
                          onChange={handleChange}
                          className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">IOS Provider App Force Update</span>
                          <p className="text-xs text-gray-500">IOS Provider App Force Update.</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Advanced Features */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Advanced Features</h3>
                    <div className="space-y-4">
                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          name="twilio_call_masking"
                          checked={settings.twilio_call_masking === true}
                          onChange={handleChange}
                          className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Twilio Call Masking</span>
                          <p className="text-xs text-gray-500">Twilio Call Masking</p>
                        </div>
                      </label>

                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          name="show_estimation_provider_app"
                          checked={settings.show_estimation_provider_app !== false}
                          onChange={handleChange}
                          className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Show Estimation in Provider App</span>
                          <p className="text-xs text-gray-500">Show Estimation in Provider App</p>
                        </div>
                      </label>

                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          name="show_estimation_user_app"
                          checked={settings.show_estimation_user_app !== false}
                          onChange={handleChange}
                          className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Show Estimation in User App</span>
                          <p className="text-xs text-gray-500">Show Estimation in User App</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Saving Changes...' : 'Save Notification Settings'}
                  </button>
                </div>
              </form>
            </TabsContent>

            {/* Twilio Tab */}
            <TabsContent value="twilio">
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twilio Account SID
                    </label>
                    <input
                      type="text"
                      name="twilio_account_sid"
                      value={settings.twilio_account_sid || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twilio Auth Token
                    </label>
                    <input
                      type="password"
                      name="twilio_auth_token"
                      value={settings.twilio_auth_token || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twilio Phone Number
                    </label>
                    <input
                      type="text"
                      name="twilio_phone_number"
                      value={settings.twilio_phone_number || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twilio Call URL
                    </label>
                    <input
                      type="text"
                      name="twilio_call_url"
                      value={settings.twilio_call_url || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Saving Changes...' : 'Save Twilio Settings'}
                  </button>
                </div>
              </form>
            </TabsContent>

            {/* Payment Gateway Tab */}
            <TabsContent value="payment">
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Payment Gateway
                    </label>
                    <select
                      name="default_payment_gateway"
                      value={settings.default_payment_gateway || 'stripe'}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="stripe">Stripe</option>
                      <option value="paypal">PayPal</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stripe Secret Key
                    </label>
                    <input
                      type="password"
                      name="stripe_secret_key"
                      value={settings.stripe_secret_key || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stripe Publishable Key
                    </label>
                    <input
                      type="text"
                      name="stripe_publishable_key"
                      value={settings.stripe_publishable_key || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Saving Changes...' : 'Save Payment Gateway Settings'}
                  </button>
                </div>
              </form>
            </TabsContent>

            {/* Email (SMTP) Tab */}
            <TabsContent value="email">
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Domain
                    </label>
                    <input
                      type="text"
                      name="email_domain"
                      value={settings.email_domain || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email_address"
                      value={settings.email_address || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Password
                    </label>
                    <input
                      type="password"
                      name="email_password"
                      value={settings.email_password || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Host
                    </label>
                    <input
                      type="text"
                      name="smtp_host"
                      value={settings.smtp_host || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Port
                    </label>
                    <input
                      type="number"
                      name="smtp_port"
                      value={settings.smtp_port || 587}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Saving Changes...' : 'Save Email Settings'}
                  </button>
                </div>
              </form>
            </TabsContent>

            {/* Firebase Tab */}
            <TabsContent value="firebase">
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Firebase API Key
                    </label>
                    <input
                      type="text"
                      name="firebase_api_key"
                      value={settings.firebase_api_key || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Auth Domain
                    </label>
                    <input
                      type="text"
                      name="firebase_auth_domain"
                      value={settings.firebase_auth_domain || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Database URL
                    </label>
                    <input
                      type="text"
                      name="firebase_database_url"
                      value={settings.firebase_database_url || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project ID
                    </label>
                    <input
                      type="text"
                      name="firebase_project_id"
                      value={settings.firebase_project_id || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Storage Bucket
                    </label>
                    <input
                      type="text"
                      name="firebase_storage_bucket"
                      value={settings.firebase_storage_bucket || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Messaging Sender ID
                    </label>
                    <input
                      type="text"
                      name="firebase_messaging_sender_id"
                      value={settings.firebase_messaging_sender_id || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <h4 className="font-medium text-gray-900 mb-4 mt-6">GCM API Keys</h4>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Android User App GCM Key
                    </label>
                    <input
                      type="text"
                      name="android_user_app_gcm_key"
                      value={settings.android_user_app_gcm_key || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Android Provider App GCM Key
                    </label>
                    <input
                      type="text"
                      name="android_provider_app_gcm_key"
                      value={settings.android_provider_app_gcm_key || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Saving Changes...' : 'Save Firebase Settings'}
                  </button>
                </div>
              </form>
            </TabsContent>

            {/* Google Maps Tab */}
            <TabsContent value="maps">
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Android User App Key
                    </label>
                    <input
                      type="text"
                      name="google_maps_key_android_user"
                      value={settings.google_maps_key_android_user || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Android Provider App Key
                    </label>
                    <input
                      type="text"
                      name="google_maps_key_android_provider"
                      value={settings.google_maps_key_android_provider || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      iOS User App Key
                    </label>
                    <input
                      type="text"
                      name="google_maps_key_ios_user"
                      value={settings.google_maps_key_ios_user || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      iOS Provider App Key
                    </label>
                    <input
                      type="text"
                      name="google_maps_key_ios_provider"
                      value={settings.google_maps_key_ios_provider || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Web Key
                    </label>
                    <input
                      type="text"
                      name="google_maps_key_web"
                      value={settings.google_maps_key_web || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Road/Directions Key
                    </label>
                    <input
                      type="text"
                      name="google_maps_key_road"
                      value={settings.google_maps_key_road || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Saving Changes...' : 'Save Maps Settings'}
                  </button>
                </div>
              </form>
            </TabsContent>

            {/* App URLs & Versions Tab */}
            <TabsContent value="apps">
              <form onSubmit={handleSave}>
                <div className="space-y-8">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">App Store URLs</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          iOS Client App URL
                        </label>
                        <input
                          type="text"
                          name="ios_client_app_url"
                          value={settings.ios_client_app_url || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          iOS Driver App URL
                        </label>
                        <input
                          type="text"
                          name="ios_driver_app_url"
                          value={settings.ios_driver_app_url || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Android Client App URL
                        </label>
                        <input
                          type="text"
                          name="android_client_app_url"
                          value={settings.android_client_app_url || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Android Driver App URL
                        </label>
                        <input
                          type="text"
                          name="android_driver_app_url"
                          value={settings.android_driver_app_url || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">App Versions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Android User App Version
                        </label>
                        <input
                          type="text"
                          name="android_user_app_version"
                          value={settings.android_user_app_version || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="1.0.0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Android Provider App Version
                        </label>
                        <input
                          type="text"
                          name="android_provider_app_version"
                          value={settings.android_provider_app_version || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="1.0.0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          iOS User App Version
                        </label>
                        <input
                          type="text"
                          name="ios_user_app_version"
                          value={settings.ios_user_app_version || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="1.0.0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          iOS Provider App Version
                        </label>
                        <input
                          type="text"
                          name="ios_provider_app_version"
                          value={settings.ios_provider_app_version || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="1.0.0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Saving Changes...' : 'Save App Settings'}
                  </button>
                </div>
              </form>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
