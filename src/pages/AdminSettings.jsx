import React, { useState, useEffect } from "react";
import joltcab from "@/lib/joltcab-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Bell, Palette, Smartphone, Upload, Save } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function AdminSettings() {
  const [basicSettings, setBasicSettings] = useState({
    countryname: '',
    adminCurrencyCode: '',
    adminCurrency: '',
    adminTimeZone: '',
    timezone_for_display_date: '',
    admin_phone: '',
    admin_email: '',
    contactUsEmail: '',
    latitude: '',
    longitude: '',
    provider_timeout: 60,
    provider_offline_min: 5,
    default_Search_radious: 50,
    scheduled_request_pre_start_minute: 30,
    number_of_try_for_scheduled_request: 3,
    find_nearest_driver_type: 'single',
    request_send_to_no_of_providers: 5
  });

  const [notificationSettings, setNotificationSettings] = useState({
    sms_notification: true,
    email_notification: true,
    userPath: true,
    providerPath: true,
    get_referral_profit_on_card_payment: true,
    get_referral_profit_on_cash_payment: true,
    userEmailVerification: true,
    providerEmailVerification: true,
    userSms: true,
    providerSms: true,
    is_tip: true,
    is_toll: true,
    android_user_app_force_update: false,
    android_provider_app_force_update: false,
    ios_user_app_force_update: false,
    ios_provider_app_force_update: false,
    is_provider_initiate_trip: false,
    twilio_call_masking: false,
    is_show_estimation_in_provider_app: true,
    is_show_estimation_in_user_app: true
  });

  const [iosSettings, setIosSettings] = useState({
    ios_certificate_mode: 'sandbox',
    user_passphrase: '',
    provider_passphrase: ''
  });

  const [countries, setCountries] = useState([]);
  const [timezones, setTimezones] = useState([]);
  

  const queryClient = useQueryClient();

  useEffect(() => {
    loadSettings();
    loadCountries();
    loadTimezones();
  }, []);

  const loadSettings = async () => {
    try {
  const configs = await joltcab.entities.SystemConfiguration.list();
      
      const settingsMap = {};
      configs.forEach(config => {
        settingsMap[config.config_key] = config.config_value;
      });

      setBasicSettings({
        countryname: settingsMap.admin_country || '',
        adminCurrencyCode: settingsMap.admin_currency_code || '',
        adminCurrency: settingsMap.admin_currency_sign || '',
        adminTimeZone: settingsMap.admin_timezone || '',
        timezone_for_display_date: settingsMap.display_timezone || '',
        admin_phone: settingsMap.admin_phone || '',
        admin_email: settingsMap.admin_email || '',
        contactUsEmail: settingsMap.contact_email || '',
        latitude: settingsMap.default_latitude || '',
        longitude: settingsMap.default_longitude || '',
        provider_timeout: parseInt(settingsMap.provider_timeout) || 60,
        provider_offline_min: parseInt(settingsMap.provider_offline_min) || 5,
        default_Search_radious: parseInt(settingsMap.default_search_radius) || 50,
        scheduled_request_pre_start_minute: parseInt(settingsMap.scheduled_pre_start_min) || 30,
        number_of_try_for_scheduled_request: parseInt(settingsMap.scheduled_retry_count) || 3,
        find_nearest_driver_type: settingsMap.find_nearest_driver_type || 'single',
        request_send_to_no_of_providers: parseInt(settingsMap.request_send_to_providers) || 5
      });

      setNotificationSettings({
        sms_notification: settingsMap.sms_notification === 'true',
        email_notification: settingsMap.email_notification === 'true',
        userPath: settingsMap.user_path === 'true',
        providerPath: settingsMap.provider_path === 'true',
        get_referral_profit_on_card_payment: settingsMap.referral_card_payment === 'true',
        get_referral_profit_on_cash_payment: settingsMap.referral_cash_payment === 'true',
        userEmailVerification: settingsMap.user_email_verification === 'true',
        providerEmailVerification: settingsMap.provider_email_verification === 'true',
        userSms: settingsMap.user_sms === 'true',
        providerSms: settingsMap.provider_sms === 'true',
        is_tip: settingsMap.is_tip === 'true',
        is_toll: settingsMap.is_toll === 'true',
        android_user_app_force_update: settingsMap.android_user_force_update === 'true',
        android_provider_app_force_update: settingsMap.android_provider_force_update === 'true',
        ios_user_app_force_update: settingsMap.ios_user_force_update === 'true',
        ios_provider_app_force_update: settingsMap.ios_provider_force_update === 'true',
        is_provider_initiate_trip: settingsMap.provider_initiate_trip === 'true',
        twilio_call_masking: settingsMap.twilio_call_masking === 'true',
        is_show_estimation_in_provider_app: settingsMap.show_estimation_provider === 'true',
        is_show_estimation_in_user_app: settingsMap.show_estimation_user === 'true'
      });

      setIosSettings({
        ios_certificate_mode: settingsMap.ios_cert_mode || 'sandbox',
        user_passphrase: settingsMap.ios_user_passphrase || '',
        provider_passphrase: settingsMap.ios_provider_passphrase || ''
      });

    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadCountries = async () => {
    try {
  const countries = await joltcab.countries.list();
      setCountries(countries);
    } catch (error) {
      console.error('Error loading countries:', error);
    }
  };

  const loadTimezones = () => {
    const tzList = [
      'America/New_York',
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles',
      'America/Anchorage',
      'Pacific/Honolulu',
      'Europe/London',
      'Europe/Paris',
      'Asia/Dubai',
      'Asia/Kolkata',
      'Asia/Singapore',
      'Asia/Tokyo',
      'Australia/Sydney',
      'Pacific/Auckland'
    ];
    setTimezones(tzList);
  };

  // Save Basic Settings
  const saveBasicMutation = useMutation({
    mutationFn: async () => {
      const configUpdates = [
        { key: 'admin_country', value: basicSettings.countryname },
        { key: 'admin_currency_code', value: basicSettings.adminCurrencyCode },
        { key: 'admin_currency_sign', value: basicSettings.adminCurrency },
        { key: 'admin_timezone', value: basicSettings.adminTimeZone },
        { key: 'display_timezone', value: basicSettings.timezone_for_display_date },
        { key: 'admin_phone', value: basicSettings.admin_phone },
        { key: 'admin_email', value: basicSettings.admin_email },
        { key: 'contact_email', value: basicSettings.contactUsEmail },
        { key: 'default_latitude', value: basicSettings.latitude },
        { key: 'default_longitude', value: basicSettings.longitude },
        { key: 'provider_timeout', value: basicSettings.provider_timeout.toString() },
        { key: 'provider_offline_min', value: basicSettings.provider_offline_min.toString() },
        { key: 'default_search_radius', value: basicSettings.default_Search_radious.toString() },
        { key: 'scheduled_pre_start_min', value: basicSettings.scheduled_request_pre_start_minute.toString() },
        { key: 'scheduled_retry_count', value: basicSettings.number_of_try_for_scheduled_request.toString() },
        { key: 'find_nearest_driver_type', value: basicSettings.find_nearest_driver_type },
        { key: 'request_send_to_providers', value: basicSettings.request_send_to_no_of_providers.toString() }
      ];

      for (const update of configUpdates) {
  const existing = await joltcab.entities.SystemConfiguration.filter({ config_key: update.key });
        if (existing[0]) {
  await joltcab.entities.SystemConfiguration.update(existing[0].id, {
            config_value: update.value
          });
        } else {
  await joltcab.entities.SystemConfiguration.create({
            config_key: update.key,
            config_value: update.value,
            config_category: 'operational'
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({
        title: "Settings Saved",
        description: "Basic settings have been updated successfully",
      });
    }
  });

  // Save Notification Settings
  const saveNotificationMutation = useMutation({
    mutationFn: async () => {
      const configUpdates = Object.entries(notificationSettings).map(([key, value]) => ({
        key: key,
        value: value.toString()
      }));

      for (const update of configUpdates) {
  const existing = await joltcab.entities.SystemConfiguration.filter({ config_key: update.key });
        if (existing[0]) {
  await joltcab.entities.SystemConfiguration.update(existing[0].id, {
            config_value: update.value
          });
        } else {
  await joltcab.entities.SystemConfiguration.create({
            config_key: update.key,
            config_value: update.value,
            config_category: 'notification'
          });
        }
      }
    },
    onSuccess: () => {
      toast({
        title: "Notification Settings Saved",
        description: "Notification preferences have been updated",
      });
    }
  });

  // Upload Logo
  const handleLogoUpload = async (fileType, file) => {
    if (!file) return;

    try {
  const { file_url } = await joltcab.integrations.Core.UploadFile({ file });
      
  await joltcab.functions.invoke('uploadLogo', {
        logo_type: fileType,
        file_url: file_url
      });

      toast({
        title: "Logo Uploaded",
        description: `${fileType} has been uploaded successfully`,
      });
      
      // Reload page to show new logo
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Upload iOS Certificate
  

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Settings</h1>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic">
            <Settings className="w-4 h-4 mr-2" />
            Basic Settings
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="theme">
            <Palette className="w-4 h-4 mr-2" />
            Theme
          </TabsTrigger>
          <TabsTrigger value="ios">
            <Smartphone className="w-4 h-4 mr-2" />
            iOS Certificates
          </TabsTrigger>
        </TabsList>

        {/* Basic Settings Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Country</Label>
                  <Select
                    value={basicSettings.countryname}
                    onValueChange={(value) => setBasicSettings(prev => ({ ...prev, countryname: value }))}
                    disabled={!!basicSettings.countryname}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(country => (
                        <SelectItem key={String(country.id || country._id)} value={country.name || country.countryname}>
                          {country.name || country.countryname || 'Unnamed Country'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Currency Code</Label>
                  <Input
                    value={basicSettings.adminCurrencyCode}
                    onChange={(e) => setBasicSettings(prev => ({ ...prev, adminCurrencyCode: e.target.value }))}
                    placeholder="USD"
                    disabled={!!basicSettings.adminCurrencyCode}
                  />
                </div>

                <div>
                  <Label>Currency Symbol</Label>
                  <Input
                    value={basicSettings.adminCurrency}
                    onChange={(e) => setBasicSettings(prev => ({ ...prev, adminCurrency: e.target.value }))}
                    placeholder="$"
                    disabled={!!basicSettings.adminCurrency}
                  />
                </div>

                <div>
                  <Label>Admin Timezone</Label>
                  <Select
                    value={basicSettings.adminTimeZone}
                    onValueChange={(value) => setBasicSettings(prev => ({ ...prev, adminTimeZone: value }))}
                    disabled={!!basicSettings.adminTimeZone}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map(tz => (
                        <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Display Timezone</Label>
                  <Select
                    value={basicSettings.timezone_for_display_date}
                    onValueChange={(value) => setBasicSettings(prev => ({ ...prev, timezone_for_display_date: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map(tz => (
                        <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Admin Phone</Label>
                  <Input
                    type="tel"
                    value={basicSettings.admin_phone}
                    onChange={(e) => setBasicSettings(prev => ({ ...prev, admin_phone: e.target.value }))}
                    placeholder="+1234567890"
                  />
                </div>

                <div>
                  <Label>Admin Email</Label>
                  <Input
                    type="email"
                    value={basicSettings.admin_email}
                    onChange={(e) => setBasicSettings(prev => ({ ...prev, admin_email: e.target.value }))}
                    placeholder="admin@joltcab.com"
                  />
                </div>

                <div>
                  <Label>Contact Email</Label>
                  <Input
                    type="email"
                    value={basicSettings.contactUsEmail}
                    onChange={(e) => setBasicSettings(prev => ({ ...prev, contactUsEmail: e.target.value }))}
                    placeholder="support@joltcab.com"
                  />
                </div>

                <div>
                  <Label>Default Latitude</Label>
                  <Input
                    type="number"
                    step="any"
                    value={basicSettings.latitude}
                    onChange={(e) => setBasicSettings(prev => ({ ...prev, latitude: e.target.value }))}
                    placeholder="40.7128"
                  />
                </div>

                <div>
                  <Label>Default Longitude</Label>
                  <Input
                    type="number"
                    step="any"
                    value={basicSettings.longitude}
                    onChange={(e) => setBasicSettings(prev => ({ ...prev, longitude: e.target.value }))}
                    placeholder="-74.0060"
                  />
                </div>
              </div>

              <div className="border-t pt-4 mt-6">
                <h3 className="font-semibold mb-4">Operational Settings</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Provider Timeout (seconds)</Label>
                    <Input
                      type="number"
                      value={basicSettings.provider_timeout}
                      onChange={(e) => setBasicSettings(prev => ({ ...prev, provider_timeout: parseInt(e.target.value) }))}
                    />
                  </div>

                  <div>
                    <Label>Provider Offline Minutes</Label>
                    <Input
                      type="number"
                      value={basicSettings.provider_offline_min}
                      onChange={(e) => setBasicSettings(prev => ({ ...prev, provider_offline_min: parseInt(e.target.value) }))}
                    />
                  </div>

                  <div>
                    <Label>Default Search Radius (km)</Label>
                    <Input
                      type="number"
                      value={basicSettings.default_Search_radious}
                      onChange={(e) => setBasicSettings(prev => ({ ...prev, default_Search_radious: parseInt(e.target.value) }))}
                    />
                  </div>

                  <div>
                    <Label>Scheduled Pre-Start Minutes</Label>
                    <Input
                      type="number"
                      value={basicSettings.scheduled_request_pre_start_minute}
                      onChange={(e) => setBasicSettings(prev => ({ ...prev, scheduled_request_pre_start_minute: parseInt(e.target.value) }))}
                    />
                  </div>

                  <div>
                    <Label>Scheduled Retry Count</Label>
                    <Input
                      type="number"
                      value={basicSettings.number_of_try_for_scheduled_request}
                      onChange={(e) => setBasicSettings(prev => ({ ...prev, number_of_try_for_scheduled_request: parseInt(e.target.value) }))}
                    />
                  </div>

                  <div>
                    <Label>Find Nearest Driver Type</Label>
                    <Select
                      value={basicSettings.find_nearest_driver_type}
                      onValueChange={(value) => setBasicSettings(prev => ({ ...prev, find_nearest_driver_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="multiple">Multiple</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {basicSettings.find_nearest_driver_type === 'multiple' && (
                    <div>
                      <Label>Send Request to Providers Count</Label>
                      <Input
                        type="number"
                        min="2"
                        max="50"
                        value={basicSettings.request_send_to_no_of_providers}
                        onChange={(e) => setBasicSettings(prev => ({ ...prev, request_send_to_no_of_providers: parseInt(e.target.value) }))}
                      />
                    </div>
                  )}
                </div>
              </div>

              <Button 
                onClick={() => saveBasicMutation.mutate()}
                disabled={saveBasicMutation.isPending}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {saveBasicMutation.isPending ? 'Saving...' : 'Save Basic Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notification</Label>
                    <p className="text-sm text-gray-500">Send SMS notifications to users</p>
                  </div>
                  <Switch
                    checked={notificationSettings.sms_notification}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, sms_notification: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notification</Label>
                    <p className="text-sm text-gray-500">Send email notifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.email_notification}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, email_notification: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>User Path Tracking</Label>
                    <p className="text-sm text-gray-500">Track user location path</p>
                  </div>
                  <Switch
                    checked={notificationSettings.userPath}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, userPath: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Provider Path Tracking</Label>
                    <p className="text-sm text-gray-500">Track provider location path</p>
                  </div>
                  <Switch
                    checked={notificationSettings.providerPath}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, providerPath: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Referral Profit on Card Payment</Label>
                    <p className="text-sm text-gray-500">Cut referral bonus from card payments</p>
                  </div>
                  <Switch
                    checked={notificationSettings.get_referral_profit_on_card_payment}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, get_referral_profit_on_card_payment: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Referral Profit on Cash Payment</Label>
                    <p className="text-sm text-gray-500">Cut referral bonus from cash payments</p>
                  </div>
                  <Switch
                    checked={notificationSettings.get_referral_profit_on_cash_payment}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, get_referral_profit_on_cash_payment: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>User Email Verification</Label>
                    <p className="text-sm text-gray-500">Require email verification for users</p>
                  </div>
                  <Switch
                    checked={notificationSettings.userEmailVerification}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, userEmailVerification: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Provider Email Verification</Label>
                    <p className="text-sm text-gray-500">Require email verification for providers</p>
                  </div>
                  <Switch
                    checked={notificationSettings.providerEmailVerification}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, providerEmailVerification: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>User SMS Verification</Label>
                    <p className="text-sm text-gray-500">Send SMS verification code to users</p>
                  </div>
                  <Switch
                    checked={notificationSettings.userSms}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, userSms: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Provider SMS Verification</Label>
                    <p className="text-sm text-gray-500">Send SMS verification code to providers</p>
                  </div>
                  <Switch
                    checked={notificationSettings.providerSms}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, providerSms: checked }))}
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Feature Toggles</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Tips</Label>
                        <p className="text-sm text-gray-500">Allow tips for trips</p>
                      </div>
                      <Switch
                        checked={notificationSettings.is_tip}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, is_tip: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Tolls</Label>
                        <p className="text-sm text-gray-500">Allow toll charges</p>
                      </div>
                      <Switch
                        checked={notificationSettings.is_toll}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, is_toll: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Android User App Force Update</Label>
                        <p className="text-sm text-gray-500">Force update for Android user app</p>
                      </div>
                      <Switch
                        checked={notificationSettings.android_user_app_force_update}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, android_user_app_force_update: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Android Provider App Force Update</Label>
                        <p className="text-sm text-gray-500">Force update for Android provider app</p>
                      </div>
                      <Switch
                        checked={notificationSettings.android_provider_app_force_update}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, android_provider_app_force_update: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>iOS User App Force Update</Label>
                        <p className="text-sm text-gray-500">Force update for iOS user app</p>
                      </div>
                      <Switch
                        checked={notificationSettings.ios_user_app_force_update}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, ios_user_app_force_update: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>iOS Provider App Force Update</Label>
                        <p className="text-sm text-gray-500">Force update for iOS provider app</p>
                      </div>
                      <Switch
                        checked={notificationSettings.ios_provider_app_force_update}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, ios_provider_app_force_update: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Provider Initiate Trip</Label>
                        <p className="text-sm text-gray-500">Allow providers to initiate trips</p>
                      </div>
                      <Switch
                        checked={notificationSettings.is_provider_initiate_trip}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, is_provider_initiate_trip: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Twilio Call Masking</Label>
                        <p className="text-sm text-gray-500">Mask phone numbers with Twilio</p>
                      </div>
                      <Switch
                        checked={notificationSettings.twilio_call_masking}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, twilio_call_masking: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Show Estimation in Provider App</Label>
                        <p className="text-sm text-gray-500">Show fare estimation to providers</p>
                      </div>
                      <Switch
                        checked={notificationSettings.is_show_estimation_in_provider_app}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, is_show_estimation_in_provider_app: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Show Estimation in User App</Label>
                        <p className="text-sm text-gray-500">Show fare estimation to users</p>
                      </div>
                      <Switch
                        checked={notificationSettings.is_show_estimation_in_user_app}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, is_show_estimation_in_user_app: checked }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => saveNotificationMutation.mutate()}
                disabled={saveNotificationMutation.isPending}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {saveNotificationMutation.isPending ? 'Saving...' : 'Save Notification Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme Settings Tab */}
        <TabsContent value="theme" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme & Branding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Logo Image</Label>
                  <p className="text-sm text-gray-500 mb-2">Recommended: 200 x 60 px, PNG format</p>
                  <Input
                    type="file"
                    accept="image/png"
                    onChange={(e) => handleLogoUpload('logo', e.target.files[0])}
                  />
                  <img 
                    src="/web_images/logo.png" 
                    alt="Current Logo" 
                    className="mt-2 h-12"
                  />
                </div>

                <div>
                  <Label>Title Image</Label>
                  <p className="text-sm text-gray-500 mb-2">Recommended: 32 x 32 px, PNG format</p>
                  <Input
                    type="file"
                    accept="image/png"
                    onChange={(e) => handleLogoUpload('title', e.target.files[0])}
                  />
                  <img 
                    src="/web_images/title_image.png" 
                    alt="Current Title" 
                    className="mt-2 h-8"
                  />
                </div>

                <div>
                  <Label>Mail Title Image</Label>
                  <p className="text-sm text-gray-500 mb-2">Recommended: 600 x 200 px, PNG format</p>
                  <Input
                    type="file"
                    accept="image/png"
                    onChange={(e) => handleLogoUpload('mail_title', e.target.files[0])}
                  />
                  <img 
                    src="/web_images/mail_title_image.png" 
                    alt="Current Mail Title" 
                    className="mt-2 h-12"
                  />
                </div>

                <div>
                  <Label>Authorized Signature</Label>
                  <p className="text-sm text-gray-500 mb-2">Recommended: 200 x 80 px, PNG format</p>
                  <Input
                    type="file"
                    accept="image/png"
                    onChange={(e) => handleLogoUpload('signature', e.target.files[0])}
                  />
                  <img 
                    src="/web_images/authorised_image.png" 
                    alt="Current Signature" 
                    className="mt-2 h-12"
                  />
                </div>

                <div>
                  <Label>User Panel Logo</Label>
                  <p className="text-sm text-gray-500 mb-2">Recommended: 150 x 150 px, PNG format</p>
                  <Input
                    type="file"
                    accept="image/png"
                    onChange={(e) => handleLogoUpload('user_logo', e.target.files[0])}
                  />
                  <img 
                    src="/web_images/user_logo.png" 
                    alt="Current User Logo" 
                    className="mt-2 h-12"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* iOS Certificates Tab */}
        <TabsContent value="ios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>iOS Push Notification Certificates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Certificate Mode</Label>
                <Select
                  value={iosSettings.ios_certificate_mode}
                  onValueChange={(value) => setIosSettings(prev => ({ ...prev, ios_certificate_mode: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sandbox">Sandbox (Development)</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">User App Certificates</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>User Certificate File (.pem)</Label>
                    <Input type="file" accept=".pem" />
                  </div>

                  <div>
                    <Label>User Key File (.pem)</Label>
                    <Input type="file" accept=".pem" />
                  </div>

                  <div>
                    <Label>User Passphrase</Label>
                    <Input
                      type="password"
                      value={iosSettings.user_passphrase}
                      onChange={(e) => setIosSettings(prev => ({ ...prev, user_passphrase: e.target.value }))}
                      placeholder="Enter passphrase"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">Provider App Certificates</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>Provider Certificate File (.pem)</Label>
                    <Input type="file" accept=".pem" />
                  </div>

                  <div>
                    <Label>Provider Key File (.pem)</Label>
                    <Input type="file" accept=".pem" />
                  </div>

                  <div>
                    <Label>Provider Passphrase</Label>
                    <Input
                      type="password"
                      value={iosSettings.provider_passphrase}
                      onChange={(e) => setIosSettings(prev => ({ ...prev, provider_passphrase: e.target.value }))}
                      placeholder="Enter passphrase"
                    />
                  </div>
                </div>
              </div>

              <Button className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Upload Certificates
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}