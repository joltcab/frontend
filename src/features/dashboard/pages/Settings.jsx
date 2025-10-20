import { useState } from 'react';
import { 
  Cog6ToothIcon, 
  DocumentTextIcon, 
  BellIcon, 
  CurrencyDollarIcon,
  GlobeAltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input, Select, Textarea } from '@/components/ui';

export default function Settings() {
  const [settings, setSettings] = useState({
    siteName: 'JoltCab',
    siteEmail: 'support@joltcab.com',
    sitePhone: '+1 (555) 000-0000',
    currency: 'USD',
    timezone: 'America/New_York',
    language: 'en',
    taxRate: '8.5',
    commissionRate: '15',
    cancellationFee: '5',
    notificationsEnabled: true,
    smsEnabled: true,
    emailEnabled: true,
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">General Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your application configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-joltcab-100 rounded-lg flex items-center justify-center">
                <Cog6ToothIcon className="w-5 h-5 text-joltcab-600" />
              </div>
              <div>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Configure basic platform settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Site Name"
              value={settings.siteName}
              onChange={(e) => handleChange('siteName', e.target.value)}
              placeholder="Enter site name"
            />
            <Input
              label="Support Email"
              type="email"
              value={settings.siteEmail}
              onChange={(e) => handleChange('siteEmail', e.target.value)}
              placeholder="support@example.com"
            />
            <Input
              label="Support Phone"
              type="tel"
              value={settings.sitePhone}
              onChange={(e) => handleChange('sitePhone', e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <GlobeAltIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle>Regional Settings</CardTitle>
                <CardDescription>Configure currency, timezone, and language</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Currency"
              value={settings.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
            </Select>
            <Select
              label="Timezone"
              value={settings.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
            </Select>
            <Select
              label="Language"
              value={settings.language}
              onChange={(e) => handleChange('language', e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle>Financial Settings</CardTitle>
                <CardDescription>Configure pricing and fees</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Tax Rate (%)"
              type="number"
              value={settings.taxRate}
              onChange={(e) => handleChange('taxRate', e.target.value)}
              placeholder="8.5"
              helperText="Applied to all trips"
            />
            <Input
              label="Commission Rate (%)"
              type="number"
              value={settings.commissionRate}
              onChange={(e) => handleChange('commissionRate', e.target.value)}
              placeholder="15"
              helperText="Platform commission from drivers"
            />
            <Input
              label="Cancellation Fee ($)"
              type="number"
              value={settings.cancellationFee}
              onChange={(e) => handleChange('cancellationFee', e.target.value)}
              placeholder="5"
              helperText="Fee charged for cancelled trips"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BellIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure notification channels</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                <p className="text-xs text-gray-500">Send mobile push notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.notificationsEnabled}
                  onChange={(e) => handleChange('notificationsEnabled', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-joltcab-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-joltcab-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">SMS Notifications</p>
                <p className="text-xs text-gray-500">Send SMS to users</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.smsEnabled}
                  onChange={(e) => handleChange('smsEnabled', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-joltcab-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-joltcab-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                <p className="text-xs text-gray-500">Send email to users</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.emailEnabled}
                  onChange={(e) => handleChange('emailEnabled', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-joltcab-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-joltcab-600"></div>
              </label>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" size="md">
          Reset to Defaults
        </Button>
        <Button variant="primary" size="md" onClick={handleSave} loading={loading}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
