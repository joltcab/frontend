import { base44 } from "@/api/base44Client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Check, Globe, Image, Loader2, Monitor, Rocket, Save, Settings, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import QuickSetupWizard from "./QuickSetupWizard";
import SetupPrompt from "./SetupPrompt";

export default function BasicSettings() {
  const [settings, setSettings] = useState({});
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const queryClient = useQueryClient();

  // --- DATA FETCHING ---
  const { data: systemConfigs = [], isLoading: isLoadingConfigs } = useQuery({
    queryKey: ['systemConfigurations'],
    queryFn: () => base44.entities.SystemConfiguration.list(),
  });

  const { data: countries = [], isLoading: isLoadingCountries } = useQuery({
    queryKey: ['countries'],
    queryFn: () => base44.countries.list(),
  });

  const { data: cities = [], isLoading: isLoadingCities } = useQuery({
    queryKey: ['cities'],
    queryFn: () => base44.entities.City.list(),
  });

  // --- MUTATION FOR SAVING ---
  const createOrUpdateMutation = useMutation({
    mutationFn: async ({ key, value, category }) => {
      const existing = systemConfigs.find(c => c.config_key === key);
      if (existing) {
        return base44.entities.SystemConfiguration.update(existing.id, { config_value: String(value) });
      } else {
        return base44.entities.SystemConfiguration.create({ 
          config_key: key, 
          config_value: String(value), 
          config_category: category 
        });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['systemConfigurations'] }),
  });

  // --- EFFECTS FOR POPULATING FORM ---
  useEffect(() => {
    if (systemConfigs.length > 0) {
      const configMap = {};
      systemConfigs.forEach(c => { 
        // Parse boolean values
        if (c.config_value === 'true' || c.config_value === 'false') {
          configMap[c.config_key] = c.config_value === 'true';
        } else {
          configMap[c.config_key] = c.config_value;
        }
      });
      setSettings(configMap);
      
      // Set selected country and city if they exist
      if (configMap.default_country_id) {
        setSelectedCountryId(configMap.default_country_id);
      }
      if (configMap.default_city_id) {
        setSelectedCityId(configMap.default_city_id);
      }
    }
  }, [systemConfigs]);
  
  useEffect(() => {
    if (selectedCountryId) {
      const country = countries.find(c => String(c.id || c._id) === String(selectedCountryId));
      if (country) {
        setSettings(prev => ({
          ...prev,
          default_currency: country.currency,
          default_currency_sign: country.currency_sign,
        }));
      }
    }
  }, [selectedCountryId, countries]);

  useEffect(() => {
    if (selectedCityId) {
      const city = cities.find(c => c.id === selectedCityId);
      if (city) {
        setSettings(prev => ({
          ...prev,
          default_timezone: city.timezone || '',
          default_lat: city.latitude || '',
          default_lng: city.longitude || '',
        }));
      }
    }
  }, [selectedCityId, cities]);

  // --- SAVE HANDLER ---
  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    
    const configsToSave = [
      // General
      { key: 'appName', value: settings.appName || 'JoltCab', category: 'general' },
      { key: 'adminEmail', value: settings.adminEmail || '', category: 'general' },
      { key: 'adminPhone', value: settings.adminPhone || '', category: 'general' },
      { key: 'contactEmail', value: settings.contactEmail || '', category: 'general' },
      { key: 'defaultSearchRadius', value: settings.defaultSearchRadius || 10, category: 'general' },
      { key: 'providerTimeout', value: settings.providerTimeout || 30, category: 'general' },
      
      // Regional
      { key: 'default_country_id', value: selectedCountryId || '', category: 'regional' },
      { key: 'default_city_id', value: selectedCityId || '', category: 'regional' },
      { key: 'default_currency', value: settings.default_currency || '', category: 'regional' },
      { key: 'default_currency_sign', value: settings.default_currency_sign || '', category: 'regional' },
      { key: 'default_timezone', value: settings.default_timezone || '', category: 'regional' },
      { key: 'default_lat', value: settings.default_lat || '', category: 'regional' },
      { key: 'default_lng', value: settings.default_lng || '', category: 'regional' },
      
      // Notifications
      { key: 'smsNotifications', value: settings.smsNotifications || false, category: 'notifications' },
      { key: 'emailNotifications', value: settings.emailNotifications || false, category: 'notifications' },
      { key: 'pushNotifications', value: settings.pushNotifications || false, category: 'notifications' },
      { key: 'userEmailVerification', value: settings.userEmailVerification || false, category: 'notifications' },
      
      // Mobile Apps
      { key: 'ios_app_url', value: settings.ios_app_url || '', category: 'app_info' },
      { key: 'ios_client_app_url', value: settings.ios_client_app_url || '', category: 'app_info' },
      { key: 'ios_driver_app_url', value: settings.ios_driver_app_url || '', category: 'app_info' },
      { key: 'android_app_url', value: settings.android_app_url || '', category: 'app_info' },
      { key: 'android_client_app_url', value: settings.android_client_app_url || '', category: 'app_info' },
      { key: 'android_driver_app_url', value: settings.android_driver_app_url || '', category: 'app_info' },
      
      // Panel Names
      { key: 'admin_panel_name', value: settings.admin_panel_name || 'Admin Panel', category: 'app_info' },
      { key: 'partner_panel_name', value: settings.partner_panel_name || 'Partner Panel', category: 'app_info' },
      { key: 'dispatcher_panel_name', value: settings.dispatcher_panel_name || 'Dispatcher Panel', category: 'app_info' },
      { key: 'hotel_panel_name', value: settings.hotel_panel_name || 'Hotel Panel', category: 'app_info' },
      
      // App Versions
      { key: 'android_user_app_version', value: settings.android_user_app_version || '1.0.0', category: 'app_info' },
      { key: 'android_provider_app_version', value: settings.android_provider_app_version || '1.0.0', category: 'app_info' },
      { key: 'ios_user_app_version', value: settings.ios_user_app_version || '1.0.0', category: 'app_info' },
      { key: 'ios_provider_app_version', value: settings.ios_provider_app_version || '1.0.0', category: 'app_info' },
    ];
    
    try {
      for (const config of configsToSave) {
        await createOrUpdateMutation.mutateAsync(config);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving basic settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

  const filteredCities = cities.filter(city => city.country_id === selectedCountryId);

  const isLoading = isLoadingConfigs || isLoadingCountries || isLoadingCities;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#15B46A]" />
        <span className="ml-3 text-gray-600">Loading settings...</span>
      </div>
    );
  }

  if (showSetupWizard) {
    return <QuickSetupWizard />;
  }

  return (
    <div className="space-y-6">
      <SetupPrompt onStartSetup={() => setShowSetupWizard(true)} />
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Basic Settings</h2>
          <p className="text-gray-600 mt-1">Configure your app&apos;s basic settings</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowSetupWizard(true)}
            variant="outline"
            className="border-[#15B46A] text-[#15B46A] hover:bg-[#15B46A] hover:text-white"
          >
            <Rocket className="w-4 h-4 mr-2" />
            Quick Setup
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving} 
            className="bg-[#15B46A] hover:bg-[#0F9456]"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {saved && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="w-4 h-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Settings saved successfully!
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-white">
          <TabsTrigger value="general">
            <Settings className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="regional">
            <Globe className="w-4 h-4 mr-2" />
            Regional
          </TabsTrigger>
          <TabsTrigger value="mobile">
            <Smartphone className="w-4 h-4 mr-2" />
            Mobile Apps
          </TabsTrigger>
          <TabsTrigger value="panels">
            <Monitor className="w-4 h-4 mr-2" />
            Panel Names
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="theme">
            <Image className="w-4 h-4 mr-2" />
            Theme
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>App Name</Label>
                  <Input 
                    value={settings.appName || ''} 
                    onChange={(e) => updateSetting('appName', e.target.value)} 
                    placeholder="JoltCab"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Admin Email</Label>
                  <Input 
                    type="email" 
                    value={settings.adminEmail || ''} 
                    onChange={(e) => updateSetting('adminEmail', e.target.value)} 
                    placeholder="admin@joltcab.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Admin Phone</Label>
                  <Input 
                    value={settings.adminPhone || ''} 
                    onChange={(e) => updateSetting('adminPhone', e.target.value)} 
                    placeholder="+1 470 748 4747"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Email</Label>
                  <Input 
                    type="email" 
                    value={settings.contactEmail || ''} 
                    onChange={(e) => updateSetting('contactEmail', e.target.value)} 
                    placeholder="info@joltcab.com"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Default Search Radius (km)</Label>
                  <Input 
                    type="number" 
                    value={settings.defaultSearchRadius || 10} 
                    onChange={(e) => updateSetting('defaultSearchRadius', e.target.value)} 
                    min="1"
                    max="100"
                  />
                  <p className="text-xs text-gray-500">Radius for finding nearby drivers</p>
                </div>
                <div className="space-y-2">
                  <Label>Provider Timeout (seconds)</Label>
                  <Input 
                    type="number" 
                    value={settings.providerTimeout || 30} 
                    onChange={(e) => updateSetting('providerTimeout', e.target.value)} 
                    min="10"
                    max="120"
                  />
                  <p className="text-xs text-gray-500">Time before ride request expires</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regional">
          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Default Country</Label>
                  <Select 
                    value={selectedCountryId || ''} 
                    onValueChange={(value) => { 
                      setSelectedCountryId(value); 
                      setSelectedCityId(null); 
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a default country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(c => (
                        <SelectItem key={String(c.id || c._id)} value={String(c.id || c._id)}>
                          {c.name || c.countryname || 'Unnamed Country'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Default City</Label>
                  <Select 
                    value={selectedCityId || ''} 
                    onValueChange={setSelectedCityId} 
                    disabled={!selectedCountryId || filteredCities.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a default city" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCities.map(c => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedCountryId && filteredCities.length === 0 && (
                    <p className="text-xs text-orange-600">No cities available for this country. Please add cities first.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <Input 
                    value={settings.default_currency || ''} 
                    readOnly 
                    placeholder="Auto-filled from country"
                    className="bg-gray-50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Currency Symbol</Label>
                  <Input 
                    value={settings.default_currency_sign || ''} 
                    readOnly 
                    placeholder="Auto-filled from country"
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Default Timezone</Label>
                  <Input 
                    value={settings.default_timezone || ''} 
                    readOnly 
                    placeholder="Auto-filled from city"
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Default Map Center</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="number" 
                      step="any" 
                      value={settings.default_lat || ''} 
                      readOnly 
                      placeholder="Latitude"
                      className="bg-gray-50"
                    />
                    <Input 
                      type="number" 
                      step="any" 
                      value={settings.default_lng || ''} 
                      readOnly 
                      placeholder="Longitude"
                      className="bg-gray-50"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Auto-filled from selected city</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mobile">
          <Card>
            <CardHeader>
              <CardTitle>Mobile Apps Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* iOS Apps */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  iOS Apps
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>iOS App Store URL</Label>
                    <Input 
                      value={settings.ios_app_url || ''} 
                      onChange={(e) => updateSetting('ios_app_url', e.target.value)} 
                      placeholder="https://apps.apple.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>iOS Client App URL</Label>
                    <Input 
                      value={settings.ios_client_app_url || ''} 
                      onChange={(e) => updateSetting('ios_client_app_url', e.target.value)} 
                      placeholder="https://apps.apple.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>iOS Driver App URL</Label>
                    <Input 
                      value={settings.ios_driver_app_url || ''} 
                      onChange={(e) => updateSetting('ios_driver_app_url', e.target.value)} 
                      placeholder="https://apps.apple.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>iOS User App Version</Label>
                    <Input 
                      value={settings.ios_user_app_version || ''} 
                      onChange={(e) => updateSetting('ios_user_app_version', e.target.value)} 
                      placeholder="1.0.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>iOS Provider App Version</Label>
                    <Input 
                      value={settings.ios_provider_app_version || ''} 
                      onChange={(e) => updateSetting('ios_provider_app_version', e.target.value)} 
                      placeholder="1.0.0"
                    />
                  </div>
                </div>
              </div>

              {/* Android Apps */}
              <div className="space-y-4 pt-6 border-t">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Android Apps
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Android Play Store URL</Label>
                    <Input 
                      value={settings.android_app_url || ''} 
                      onChange={(e) => updateSetting('android_app_url', e.target.value)} 
                      placeholder="https://play.google.com/store/apps/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Android Client App URL</Label>
                    <Input 
                      value={settings.android_client_app_url || ''} 
                      onChange={(e) => updateSetting('android_client_app_url', e.target.value)} 
                      placeholder="https://play.google.com/store/apps/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Android Driver App URL</Label>
                    <Input 
                      value={settings.android_driver_app_url || ''} 
                      onChange={(e) => updateSetting('android_driver_app_url', e.target.value)} 
                      placeholder="https://play.google.com/store/apps/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Android User App Version</Label>
                    <Input 
                      value={settings.android_user_app_version || ''} 
                      onChange={(e) => updateSetting('android_user_app_version', e.target.value)} 
                      placeholder="1.0.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Android Provider App Version</Label>
                    <Input 
                      value={settings.android_provider_app_version || ''} 
                      onChange={(e) => updateSetting('android_provider_app_version', e.target.value)} 
                      placeholder="1.0.0"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="panels">
          <Card>
            <CardHeader>
              <CardTitle>Panel Names Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Monitor className="h-4 w-4" />
                <AlertDescription>
                  Customize the names of different admin panels in your system
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Admin Panel Name</Label>
                  <Input 
                    value={settings.admin_panel_name || ''} 
                    onChange={(e) => updateSetting('admin_panel_name', e.target.value)} 
                    placeholder="Admin Panel"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Partner Panel Name</Label>
                  <Input 
                    value={settings.partner_panel_name || ''} 
                    onChange={(e) => updateSetting('partner_panel_name', e.target.value)} 
                    placeholder="Partner Panel"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dispatcher Panel Name</Label>
                  <Input 
                    value={settings.dispatcher_panel_name || ''} 
                    onChange={(e) => updateSetting('dispatcher_panel_name', e.target.value)} 
                    placeholder="Dispatcher Panel"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hotel Panel Name</Label>
                  <Input 
                    value={settings.hotel_panel_name || ''} 
                    onChange={(e) => updateSetting('hotel_panel_name', e.target.value)} 
                    placeholder="Hotel Panel"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b">
                <div>
                  <p className="font-semibold text-gray-900">SMS Notifications</p>
                  <p className="text-sm text-gray-600">Send SMS notifications to users</p>
                </div>
                <Switch 
                  checked={settings.smsNotifications || false} 
                  onCheckedChange={(checked) => updateSetting('smsNotifications', checked)} 
                />
              </div>
              
              <div className="flex items-center justify-between py-4 border-b">
                <div>
                  <p className="font-semibold text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">Send email notifications to users</p>
                </div>
                <Switch 
                  checked={settings.emailNotifications || false} 
                  onCheckedChange={(checked) => updateSetting('emailNotifications', checked)} 
                />
              </div>
              
              <div className="flex items-center justify-between py-4 border-b">
                <div>
                  <p className="font-semibold text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-600">Send push notifications to mobile apps</p>
                </div>
                <Switch 
                  checked={settings.pushNotifications || false} 
                  onCheckedChange={(checked) => updateSetting('pushNotifications', checked)} 
                />
              </div>
              
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="font-semibold text-gray-900">User Email Verification</p>
                  <p className="text-sm text-gray-600">Require email verification for new users</p>
                </div>
                <Switch 
                  checked={settings.userEmailVerification || false} 
                  onCheckedChange={(checked) => updateSetting('userEmailVerification', checked)} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">App Logo</Label>
                  <div className="flex items-center gap-4">
                    <img 
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f7eae9d9887c2ac98e6d49/870b77da8_LogoAppjolt26.png" 
                      alt="Logo" 
                      className="h-16 w-16 rounded-lg object-cover border"
                    />
                    <div>
                      <Button variant="outline" disabled>
                        <Image className="w-4 h-4 mr-2" />
                        Upload New Logo
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">Recommended: 250x250px, PNG format</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Favicon</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded border flex items-center justify-center bg-gray-50">
                      <span className="text-2xl">🚕</span>
                    </div>
                    <div>
                      <Button variant="outline" disabled>
                        <Image className="w-4 h-4 mr-2" />
                        Upload Favicon
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">Recommended: 45x45px, PNG format</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Primary Color</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-[#15B46A] border-2 border-gray-300"></div>
                    <Input 
                      type="color" 
                      defaultValue="#15B46A" 
                      className="w-24 h-12"
                      disabled 
                    />
                    <span className="text-sm text-gray-600">#15B46A</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Theme customization coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}