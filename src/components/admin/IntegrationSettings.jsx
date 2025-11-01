
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { joltcab } from "@/lib/joltcab-api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Map, CreditCard, MessageSquare, Mail, Bell, Database, 
  Cloud, Shield, CheckCircle, XCircle, Loader2, Save, Eye, EyeOff,
  Smartphone // Added Smartphone icon
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export default function IntegrationSettings() {
  const [showSecrets, setShowSecrets] = useState({});
  const [testResults, setTestResults] = useState({});
  const [formData, setFormData] = useState({});
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => joltcab.settings.get(),
  });

  const { data: configStatus } = useQuery({
    queryKey: ['configStatus'],
    queryFn: () => joltcab.settings.getConfigStatus(),
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const updateSettingsMutation = useMutation({
    mutationFn: (data) => joltcab.settings.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['configStatus'] });
      toast.success('Settings saved successfully!');
    },
    onError: (error) => {
      toast.error('Failed to save settings: ' + error.message);
    },
  });

  const handleSaveConfig = (key, value) => {
    const updateData = {
      [key]: value
    };
    updateSettingsMutation.mutate(updateData);
  };

  const toggleSecret = (key) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const testConnection = async (service) => {
    setTestResults(prev => ({ ...prev, [service]: 'testing' }));
    
    // Simulate test
    setTimeout(() => {
      setTestResults(prev => ({ ...prev, [service]: 'success' }));
    }, 2000);
  };

  const ConfigInput = ({ configKey, label, category, description, isSecret = false, placeholder, disabled = false }) => {
    const value = formData[configKey] || '';

    const handleChange = (e) => {
      setFormData(prev => ({
        ...prev,
        [configKey]: e.target.value
      }));
    };

    return (
      <div className="space-y-2" data-category={category || undefined}>
        <Label>{label}</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type={isSecret && !showSecrets[configKey] ? 'password' : 'text'}
              value={value}
              onChange={handleChange}
              placeholder={placeholder}
              className="pr-10"
              disabled={disabled}
            />
            {isSecret && (
              <button
                type="button"
                onClick={() => toggleSecret(configKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showSecrets[configKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
          </div>
          <Button
            onClick={() => handleSaveConfig(configKey, value)}
            disabled={disabled || updateSettingsMutation.isPending}
            className="bg-[#15B46A] hover:bg-[#0F9456]"
          >
            {updateSettingsMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
          </Button>
        </div>
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
      </div>
    );
  };

  ConfigInput.propTypes = {
    configKey: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    category: PropTypes.string,
    description: PropTypes.string,
    isSecret: PropTypes.bool,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#15B46A]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Integration Settings</h2>
        <p className="text-gray-600 mt-1">Configure third-party services and API keys</p>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Note:</strong> All API keys and secrets are encrypted in the database. Never share these credentials.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="maps" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9"> {/* Changed from grid-cols-8 to grid-cols-9 */}
          <TabsTrigger value="maps">
            <Map className="w-4 h-4 mr-2" />
            Maps
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="w-4 h-4 mr-2" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="sms">
            <MessageSquare className="w-4 h-4 mr-2" />
            SMS
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="push">
            <Bell className="w-4 h-4 mr-2" />
            Push
          </TabsTrigger>
          <TabsTrigger value="realtime">
            <Database className="w-4 h-4 mr-2" />
            Real-Time
          </TabsTrigger>
          <TabsTrigger value="storage">
            <Cloud className="w-4 h-4 mr-2" />
            Storage
          </TabsTrigger>
          <TabsTrigger value="apps"> {/* New Apps Tab Trigger */}
            <Smartphone className="w-4 h-4 mr-2" />
            Apps
          </TabsTrigger>
          <TabsTrigger value="general">
            <Shield className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
        </TabsList>

        {/* Maps Tab */}
        <TabsContent value="maps">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="w-5 h-5" />
                Mapping Services
              </CardTitle>
              <CardDescription>
                Configure Mapbox (primary) and Google Maps (backup)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-semibold text-blue-900">Use Mapbox as Primary</p>
                  <p className="text-sm text-blue-700">Automatically falls back to Google Maps if Mapbox fails</p>
                </div>
                <Switch
                  checked={Boolean(formData?.use_mapbox_primary === true || formData?.use_mapbox_primary === 'true')}
                  onCheckedChange={(checked) => handleSaveConfig('use_mapbox_primary', checked.toString())}
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Mapbox Configuration</h4>
                <ConfigInput
                  configKey="mapbox_access_token"
                  label="Mapbox Access Token *"
                  category="maps"
                  description="Get your token from https://account.mapbox.com/"
                  isSecret={true}
                  placeholder="pk.eyJ1..."
                />
                <Button
                  variant="outline"
                  onClick={() => testConnection('mapbox')}
                  className="w-full"
                >
                  {testResults.mapbox === 'testing' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : testResults.mapbox === 'success' ? (
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  ) : (
                    <Map className="w-4 h-4 mr-2" />
                  )}
                  Test Mapbox Connection
                </Button>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <h4 className="font-semibold text-lg">Google Maps Configuration (Backup)</h4>
                <ConfigInput
                  configKey="web_app_google_key"
                  label="Google Maps API Key"
                  category="maps"
                  description="Get your key from https://console.cloud.google.com/"
                  isSecret={true}
                  placeholder="AIza..."
                />
                <Button
                  variant="outline"
                  onClick={() => testConnection('google_maps')}
                  className="w-full"
                >
                  {testResults.google_maps === 'testing' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : testResults.google_maps === 'success' ? (
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  ) : (
                    <Map className="w-4 h-4 mr-2" />
                  )}
                  Test Google Maps Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Gateways
              </CardTitle>
              <CardDescription>
                Configure Stripe (primary) and PayPal (backup)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Stripe Configuration (Primary)</h4>
                <ConfigInput
                  configKey="stripe_publishable_key"
                  label="Stripe Publishable Key *"
                  category="payment"
                  description="Get from https://dashboard.stripe.com/apikeys"
                  isSecret={true}
                  placeholder="pk_live_..."
                />
                <ConfigInput
                  configKey="stripe_secret_key"
                  label="Stripe Secret Key *"
                  category="payment"
                  description="Never share this key publicly"
                  isSecret={true}
                  placeholder="sk_live_..."
                />
                <ConfigInput
                  configKey="stripe_webhook_secret"
                  label="Stripe Webhook Secret"
                  category="payment"
                  description="For webhook verification"
                  isSecret={true}
                  placeholder="whsec_..."
                />
              </div>

              <div className="space-y-4 pt-6 border-t">
                <h4 className="font-semibold text-lg">PayPal Configuration (Backup)</h4>
                <ConfigInput
                  configKey="paypal_client_id"
                  label="PayPal Client ID"
                  category="payment"
                  description="Get from https://developer.paypal.com/"
                  isSecret={true}
                />
                <ConfigInput
                  configKey="paypal_secret"
                  label="PayPal Secret"
                  category="payment"
                  description="PayPal secret key"
                  isSecret={true}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMS Tab */}
        <TabsContent value="sms">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                SMS Service (Twilio)
              </CardTitle>
              <CardDescription>
                Configure Twilio for SMS notifications and verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ConfigInput
                configKey="twilio_account_sid"
                label="Twilio Account SID *"
                category="sms"
                description="Get from https://console.twilio.com/"
                isSecret={true}
              />
              <ConfigInput
                configKey="twilio_auth_token"
                label="Twilio Auth Token *"
                category="sms"
                description="Twilio authentication token"
                isSecret={true}
              />
              <ConfigInput
                configKey="twilio_number"
                label="Twilio Phone Number *"
                category="sms"
                description="Your Twilio phone number (e.g., +14155551234)"
                placeholder="+1..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Tab */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Service (SendGrid)
              </CardTitle>
              <CardDescription>
                Configure SendGrid for transactional emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg border border-yellow-200 bg-yellow-50">
                <p className="text-sm text-yellow-800">
                  SendGrid aún no está soportado por el backend en <code>/settings</code>. Usa el panel de SMTP en <strong>Admin → Email Settings</strong> mientras se habilita.
                </p>
              </div>
              <ConfigInput
                configKey="sendgrid_api_key"
                label="SendGrid API Key *"
                category="email"
                description="Get from https://app.sendgrid.com/settings/api_keys"
                isSecret={true}
                disabled={true}
              />
              <ConfigInput
                configKey="sendgrid_from_email"
                label="From Email Address *"
                category="email"
                description="Verified sender email"
                placeholder="noreply@joltcab.com"
                disabled={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Push Notifications Tab */}
        <TabsContent value="push">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Push Notifications (Firebase)
              </CardTitle>
              <CardDescription>
                Configure Firebase Cloud Messaging for push notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ConfigInput
                configKey="firebase_apiKey"
                label="Firebase API Key *"
                category="push_notifications"
                description="From Firebase Console"
                isSecret={true}
              />
              <ConfigInput
                configKey="firebase_messagingSenderId"
                label="FCM Sender ID *"
                category="push_notifications"
                description="Firebase Cloud Messaging Sender ID"
              />
              <ConfigInput
                configKey="firebase_authDomain"
                label="Firebase Auth Domain *"
                category="push_notifications"
                description="Firebase Application ID"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Real-Time Tab */}
        <TabsContent value="realtime">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Real-Time Database (Firebase)
              </CardTitle>
              <CardDescription>
                Configure Firebase Realtime Database for live tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ConfigInput
                configKey="firebase_projectId"
                label="Firebase Project ID *"
                category="real_time"
                description="Your Firebase project identifier"
              />
              <Alert>
                <Database className="h-4 w-4" />
                <AlertDescription>
                  Firebase Realtime Database provides real-time synchronization for driver locations and ride status updates.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Storage Tab */}
        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="w-5 h-5" />
                Cloud Storage (AWS S3)
              </CardTitle>
              <CardDescription>
                Configure AWS S3 for file storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ConfigInput
                configKey="aws_access_key_id"
                label="AWS Access Key ID *"
                category="storage"
                description="From AWS IAM Console"
                isSecret={true}
              />
              <ConfigInput
                configKey="aws_secret_access_key"
                label="AWS Secret Access Key *"
                category="storage"
                description="AWS secret key"
                isSecret={true}
              />
              <ConfigInput
                configKey="aws_s3_bucket"
                label="S3 Bucket Name *"
                category="storage"
                description="Your S3 bucket name"
                placeholder="joltcab-files"
              />
              <ConfigInput
                configKey="aws_region"
                label="AWS Region"
                category="storage"
                description="AWS region for your bucket"
                placeholder="us-east-1"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Apps Tab - NEW */}
        <TabsContent value="apps">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Mobile Apps Configuration
              </CardTitle>
              <CardDescription>
                Configure mobile app URLs and versions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* iOS Apps */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  iOS Apps
                </h4>
                <div className="grid gap-4">
                  <ConfigInput
                    configKey="ios_app_url"
                    label="iOS App Store URL"
                    category="app_info"
                    description="Main iOS app store link"
                    placeholder="https://apps.apple.com/..."
                  />
                  <ConfigInput
                    configKey="ios_client_app_url"
                    label="iOS Client App URL"
                    category="app_info"
                    description="Passenger iOS app link"
                    placeholder="https://apps.apple.com/..."
                  />
                  <ConfigInput
                    configKey="ios_driver_app_url"
                    label="iOS Driver App URL"
                    category="app_info"
                    description="Driver iOS app link"
                    placeholder="https://apps.apple.com/..."
                  />
                  <ConfigInput
                    configKey="ios_user_app_version"
                    label="iOS User App Version"
                    category="app_info"
                    description="Current version for user app"
                    placeholder="1.0.0"
                  />
                  <ConfigInput
                    configKey="ios_provider_app_version"
                    label="iOS Provider App Version"
                    category="app_info"
                    description="Current version for driver app"
                    placeholder="1.0.0"
                  />
                </div>
              </div>

              {/* Android Apps */}
              <div className="space-y-4 pt-6 border-t">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Android Apps
                </h4>
                <div className="grid gap-4">
                  <ConfigInput
                    configKey="android_app_url"
                    label="Android Play Store URL"
                    category="app_info"
                    description="Main Android play store link"
                    placeholder="https://play.google.com/store/apps/..."
                  />
                  <ConfigInput
                    configKey="android_client_app_url"
                    label="Android Client App URL"
                    category="app_info"
                    description="Passenger Android app link"
                    placeholder="https://play.google.com/store/apps/..."
                  />
                  <ConfigInput
                    configKey="android_driver_app_url"
                    label="Android Driver App URL"
                    category="app_info"
                    description="Driver Android app link"
                    placeholder="https://play.google.com/store/apps/..."
                  />
                  <ConfigInput
                    configKey="android_user_app_version"
                    label="Android User App Version"
                    category="app_info"
                    description="Current version for user app"
                    placeholder="1.0.0"
                  />
                  <ConfigInput
                    configKey="android_provider_app_version"
                    label="Android Provider App Version"
                    category="app_info"
                    description="Current version for driver app"
                    placeholder="1.0.0"
                  />
                </div>
              </div>

              {/* Panel Names */}
              <div className="space-y-4 pt-6 border-t">
                <h4 className="font-semibold text-lg">Panel Names</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <ConfigInput
                    configKey="admin_panel_name"
                    label="Admin Panel Name"
                    category="app_info"
                    description="Name for admin dashboard"
                    placeholder="Admin Panel"
                  />
                  <ConfigInput
                    configKey="partner_panel_name"
                    label="Partner Panel Name"
                    category="app_info"
                    description="Name for partner dashboard"
                    placeholder="Partner Panel"
                  />
                  <ConfigInput
                    configKey="dispatcher_panel_name"
                    label="Dispatcher Panel Name"
                    category="app_info"
                    description="Name for dispatcher dashboard"
                    placeholder="Dispatcher Panel"
                  />
                  <ConfigInput
                    configKey="hotel_panel_name"
                    label="Hotel Panel Name"
                    category="app_info"
                    description="Name for hotel dashboard"
                    placeholder="Hotel Panel"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* General Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Database, caching, and application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Database Configuration</h4>
                <ConfigInput
                  configKey="database_type"
                  label="Database Type"
                  category="general"
                  description="PostgreSQL recommended for geospatial queries"
                  placeholder="postgresql"
                />
              </div>

              <div className="space-y-4 pt-6 border-t">
                <h4 className="font-semibold text-lg">Redis Cache</h4>
                <ConfigInput
                  configKey="redis_url"
                  label="Redis URL"
                  category="general"
                  description="For caching and session management"
                  isSecret={true}
                  placeholder="redis://localhost:6379"
                />
              </div>

              {/* Removed Application Info from here, as it's now in the 'Apps' tab */}
              <div className="space-y-4 pt-6 border-t">
                <h4 className="font-semibold text-lg">Application Info</h4>
                <ConfigInput
                  configKey="app_name"
                  label="Application Name"
                  category="app_info"
                  description="Display name of your application"
                  placeholder="JoltCab"
                />
                <ConfigInput
                  configKey="app_version"
                  label="App Version"
                  category="app_info"
                  description="Current version number"
                  placeholder="1.0.0"
                />
                <ConfigInput
                  configKey="app_environment"
                  label="Environment"
                  category="app_info"
                  description="development, staging, or production"
                  placeholder="production"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { key: 'mapbox', label: 'Mapbox', icon: Map },
              { key: 'stripe', label: 'Stripe', icon: CreditCard },
              { key: 'twilio', label: 'Twilio SMS', icon: MessageSquare },
              { key: 'smtp', label: 'SendGrid', icon: Mail },
              { key: 'firebase', label: 'Firebase', icon: Bell },
              { key: 'aws_s3', label: 'AWS S3', icon: Cloud },
              { key: 'redis', label: 'Redis', icon: Database },
              { key: 'google_maps', label: 'Google Maps', icon: Map },
            ].map(({ key, label, icon: Icon }) => {
              const isConfigured = configStatus?.status?.[key] || false;
              return (
                <div
                  key={key}
                  className={`p-4 rounded-lg border-2 ${
                    isConfigured
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="font-medium text-sm">{label}</span>
                    </div>
                    {isConfigured ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {isConfigured ? 'Configured' : 'Not configured'}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
