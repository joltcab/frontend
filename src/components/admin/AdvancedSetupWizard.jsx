import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { joltcab } from "@/lib/joltcab-api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin,
  CreditCard,
  MessageSquare,
  Mail,
  Bell,
  Zap,
  Database,
  Smartphone,
  Settings,
  CheckCircle,
  XCircle,
  Loader2,
  Save
} from "lucide-react";
import { toast } from "sonner";

export default function AdvancedSetupWizard() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("maps");
  const [testResults, setTestResults] = useState({});
  
  // Cargar settings actuales
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => joltcab.settings.get(),
  });

  const { data: configStatus } = useQuery({
    queryKey: ['configStatus'],
    queryFn: () => joltcab.settings.getConfigStatus(),
  });

  const [config, setConfig] = useState({});

  useEffect(() => {
    if (settings) {
      setConfig(settings);
    }
  }, [settings]);

  // Mutation para guardar settings
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      return await joltcab.settings.update(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['configStatus'] });
      toast.success('Settings saved successfully!');
    },
    onError: (error) => {
      toast.error('Failed to save settings: ' + error.message);
    },
  });

  const handleSave = (category, data) => {
    saveMutation.mutate(data);
  };

  const handleTest = async (service, credentials) => {
    setTestResults(prev => ({ ...prev, [service]: { testing: true } }));
    
    try {
      let result;
      switch(service) {
        case 'mapbox':
          result = await joltcab.test.mapbox(credentials.mapbox_access_token);
          break;
        case 'google_maps':
          result = await joltcab.test.googleMaps(credentials.web_app_google_key);
          break;
        case 'stripe':
          result = await joltcab.test.stripe(credentials.stripe_secret_key);
          break;
        case 'twilio':
          result = await joltcab.test.twilio(credentials.twilio_account_sid, credentials.twilio_auth_token);
          break;
        case 'smtp':
          result = await joltcab.test.smtp(credentials.smtp_host, credentials.smtp_port, credentials.smtp_user, credentials.smtp_password);
          break;
        default:
          result = { success: false, error: 'Unknown service' };
      }
      
      setTestResults(prev => ({ 
        ...prev, 
        [service]: { 
          testing: false, 
          success: result.success,
          message: result.message || result.error
        } 
      }));
      
      if (result.success) {
        toast.success(`${service} connection successful!`);
      } else {
        toast.error(`${service} connection failed: ${result.error}`);
      }
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [service]: { 
          testing: false, 
          success: false,
          message: error.message
        } 
      }));
      toast.error(`Test failed: ${error.message}`);
    }
  };

  const TestButton = ({ service, credentials, disabled }) => {
    const result = testResults[service];
    
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => handleTest(service, credentials)}
        disabled={disabled || result?.testing}
      >
        {result?.testing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Testing...
          </>
        ) : result?.success === true ? (
          <>
            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
            Connected
          </>
        ) : result?.success === false ? (
          <>
            <XCircle className="w-4 h-4 mr-2 text-red-600" />
            Failed
          </>
        ) : (
          'Test Connection'
        )}
      </Button>
    );
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">
      <Loader2 className="w-8 h-8 animate-spin text-[#15B46A]" />
    </div>;
  }

  const tabs = [
    {
      value: "maps",
      label: "Maps",
      icon: MapPin,
      description: "Mapping services configuration",
      configured: configStatus?.status?.maps_configured,
    },
    {
      value: "payments",
      label: "Payments",
      icon: CreditCard,
      description: "Payment gateway settings",
      configured: configStatus?.status?.stripe,
    },
    {
      value: "sms",
      label: "SMS",
      icon: MessageSquare,
      description: "SMS notifications",
      configured: configStatus?.status?.twilio,
    },
    {
      value: "email",
      label: "Email",
      icon: Mail,
      description: "Email configuration",
      configured: configStatus?.status?.smtp,
    },
    {
      value: "push",
      label: "Push",
      icon: Bell,
      description: "Push notifications",
      configured: configStatus?.status?.firebase,
    },
    {
      value: "realtime",
      label: "Real-Time",
      icon: Zap,
      description: "Real-time features",
      configured: false,
    },
    {
      value: "storage",
      label: "Storage",
      icon: Database,
      description: "File storage",
      configured: configStatus?.status?.aws_s3,
    },
    {
      value: "apps",
      label: "Apps",
      icon: Smartphone,
      description: "Mobile app settings",
      configured: false,
    },
    {
      value: "general",
      label: "General",
      icon: Settings,
      description: "General settings",
      configured: true,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">System Configuration</CardTitle>
          <CardDescription>
            Configure all JoltCab integrations and services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-9 w-full">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger key={tab.value} value={tab.value} className="relative">
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                    {tab.configured && (
                      <CheckCircle className="w-3 h-3 text-green-600 absolute -top-1 -right-1" />
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* MAPS TAB */}
            <TabsContent value="maps" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Mapping Services</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Configure Mapbox (primary) and Google Maps (backup) for location services
                  </p>
                </div>

                {/* Mapbox */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">Mapbox (Primary)</h4>
                      <p className="text-sm text-gray-600">Modern mapping service</p>
                    </div>
                    <Badge variant={configStatus?.status?.mapbox ? "success" : "secondary"}>
                      {configStatus?.status?.mapbox ? "Configured" : "Not configured"}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="mapbox_access_token">Mapbox Access Token</Label>
                      <Input
                        id="mapbox_access_token"
                        type="password"
                        placeholder="pk.ey..."
                        value={config.mapbox_access_token || ''}
                        onChange={(e) => setConfig({...config, mapbox_access_token: e.target.value})}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSave('maps', { mapbox_access_token: config.mapbox_access_token })}
                        disabled={saveMutation.isPending}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <TestButton
                        service="mapbox"
                        credentials={{ mapbox_access_token: config.mapbox_access_token }}
                        disabled={!config.mapbox_access_token}
                      />
                    </div>
                  </div>
                </div>

                {/* Google Maps */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">Google Maps (Backup)</h4>
                      <p className="text-sm text-gray-600">Fallback mapping service</p>
                    </div>
                    <Badge variant={configStatus?.status?.google_maps ? "success" : "secondary"}>
                      {configStatus?.status?.google_maps ? "Configured" : "Not configured"}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="web_app_google_key">Google Maps API Key</Label>
                      <Input
                        id="web_app_google_key"
                        type="password"
                        placeholder="AIza..."
                        value={config.web_app_google_key || ''}
                        onChange={(e) => setConfig({...config, web_app_google_key: e.target.value})}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSave('maps', { web_app_google_key: config.web_app_google_key })}
                        disabled={saveMutation.isPending}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <TestButton
                        service="google_maps"
                        credentials={{ web_app_google_key: config.web_app_google_key }}
                        disabled={!config.web_app_google_key}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* PAYMENTS TAB */}
            <TabsContent value="payments" className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">Stripe</h4>
                    <p className="text-sm text-gray-600">Payment processing</p>
                  </div>
                  <Badge variant={configStatus?.status?.stripe ? "success" : "secondary"}>
                    {configStatus?.status?.stripe ? "Configured" : "Not configured"}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="stripe_secret_key">Secret Key</Label>
                    <Input
                      id="stripe_secret_key"
                      type="password"
                      placeholder="sk_test_..."
                      value={config.stripe_secret_key || ''}
                      onChange={(e) => setConfig({...config, stripe_secret_key: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stripe_publishable_key">Publishable Key</Label>
                    <Input
                      id="stripe_publishable_key"
                      type="text"
                      placeholder="pk_test_..."
                      value={config.stripe_publishable_key || ''}
                      onChange={(e) => setConfig({...config, stripe_publishable_key: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSave('payments', { 
                        stripe_secret_key: config.stripe_secret_key,
                        stripe_publishable_key: config.stripe_publishable_key
                      })}
                      disabled={saveMutation.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <TestButton
                      service="stripe"
                      credentials={{ stripe_secret_key: config.stripe_secret_key }}
                      disabled={!config.stripe_secret_key}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* SMS TAB */}
            <TabsContent value="sms" className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">Twilio</h4>
                    <p className="text-sm text-gray-600">SMS and WhatsApp messaging</p>
                  </div>
                  <Badge variant={configStatus?.status?.twilio ? "success" : "secondary"}>
                    {configStatus?.status?.twilio ? "Configured" : "Not configured"}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="twilio_account_sid">Account SID</Label>
                    <Input
                      id="twilio_account_sid"
                      type="password"
                      placeholder="AC..."
                      value={config.twilio_account_sid || ''}
                      onChange={(e) => setConfig({...config, twilio_account_sid: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="twilio_auth_token">Auth Token</Label>
                    <Input
                      id="twilio_auth_token"
                      type="password"
                      value={config.twilio_auth_token || ''}
                      onChange={(e) => setConfig({...config, twilio_auth_token: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="twilio_number">Phone Number</Label>
                    <Input
                      id="twilio_number"
                      type="text"
                      placeholder="+1234567890"
                      value={config.twilio_number || ''}
                      onChange={(e) => setConfig({...config, twilio_number: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSave('sms', { 
                        twilio_account_sid: config.twilio_account_sid,
                        twilio_auth_token: config.twilio_auth_token,
                        twilio_number: config.twilio_number
                      })}
                      disabled={saveMutation.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <TestButton
                      service="twilio"
                      credentials={{ 
                        twilio_account_sid: config.twilio_account_sid,
                        twilio_auth_token: config.twilio_auth_token
                      }}
                      disabled={!config.twilio_account_sid || !config.twilio_auth_token}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* EMAIL TAB */}
            <TabsContent value="email" className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">SMTP Configuration</h4>
                    <p className="text-sm text-gray-600">Email delivery settings</p>
                  </div>
                  <Badge variant={configStatus?.status?.smtp ? "success" : "secondary"}>
                    {configStatus?.status?.smtp ? "Configured" : "Not configured"}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="smtp_host">SMTP Host</Label>
                    <Input
                      id="smtp_host"
                      placeholder="smtp.gmail.com"
                      value={config.smtp_host || ''}
                      onChange={(e) => setConfig({...config, smtp_host: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtp_port">SMTP Port</Label>
                    <Input
                      id="smtp_port"
                      placeholder="587"
                      value={config.smtp_port || ''}
                      onChange={(e) => setConfig({...config, smtp_port: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtp_user">Username</Label>
                    <Input
                      id="smtp_user"
                      value={config.smtp_user || ''}
                      onChange={(e) => setConfig({...config, smtp_user: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtp_password">Password</Label>
                    <Input
                      id="smtp_password"
                      type="password"
                      value={config.smtp_password || ''}
                      onChange={(e) => setConfig({...config, smtp_password: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sender_email">From Email</Label>
                    <Input
                      id="sender_email"
                      type="email"
                      value={config.sender_email || ''}
                      onChange={(e) => setConfig({...config, sender_email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sender_name">From Name</Label>
                    <Input
                      id="sender_name"
                      value={config.sender_name || ''}
                      onChange={(e) => setConfig({...config, sender_name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    onClick={() => handleSave('email', { 
                      smtp_host: config.smtp_host,
                      smtp_port: config.smtp_port,
                      smtp_user: config.smtp_user,
                      smtp_password: config.smtp_password,
                      sender_email: config.sender_email,
                      sender_name: config.sender_name
                    })}
                    disabled={saveMutation.isPending}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <TestButton
                    service="smtp"
                    credentials={{ 
                      smtp_host: config.smtp_host,
                      smtp_port: config.smtp_port,
                      smtp_user: config.smtp_user,
                      smtp_password: config.smtp_password
                    }}
                    disabled={!config.smtp_host || !config.smtp_port}
                  />
                </div>
              </div>
            </TabsContent>

            {/* PUSH TAB */}
            <TabsContent value="push" className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">Firebase Cloud Messaging</h4>
                    <p className="text-sm text-gray-600">Push notifications</p>
                  </div>
                  <Badge variant={configStatus?.status?.firebase ? "success" : "secondary"}>
                    {configStatus?.status?.firebase ? "Configured" : "Not configured"}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="firebase_apiKey">API Key</Label>
                    <Input
                      id="firebase_apiKey"
                      type="password"
                      value={config.firebase_apiKey || ''}
                      onChange={(e) => setConfig({...config, firebase_apiKey: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="firebase_projectId">Project ID</Label>
                    <Input
                      id="firebase_projectId"
                      value={config.firebase_projectId || ''}
                      onChange={(e) => setConfig({...config, firebase_projectId: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="firebase_authDomain">Auth Domain</Label>
                    <Input
                      id="firebase_authDomain"
                      value={config.firebase_authDomain || ''}
                      onChange={(e) => setConfig({...config, firebase_authDomain: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="firebase_storageBucket">Storage Bucket</Label>
                    <Input
                      id="firebase_storageBucket"
                      value={config.firebase_storageBucket || ''}
                      onChange={(e) => setConfig({...config, firebase_storageBucket: e.target.value})}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="firebase_messagingSenderId">Messaging Sender ID</Label>
                    <Input
                      id="firebase_messagingSenderId"
                      value={config.firebase_messagingSenderId || ''}
                      onChange={(e) => setConfig({...config, firebase_messagingSenderId: e.target.value})}
                    />
                  </div>
                </div>
                <Button
                  className="mt-3"
                  onClick={() => handleSave('push', { 
                    firebase_apiKey: config.firebase_apiKey,
                    firebase_projectId: config.firebase_projectId,
                    firebase_authDomain: config.firebase_authDomain,
                    firebase_storageBucket: config.firebase_storageBucket,
                    firebase_messagingSenderId: config.firebase_messagingSenderId
                  })}
                  disabled={saveMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </TabsContent>

            {/* Placeholder tabs */}
            <TabsContent value="realtime">
              <Alert>
                <AlertDescription>
                  Real-time configuration coming soon...
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="storage">
              <Alert>
                <AlertDescription>
                  Storage configuration coming soon...
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="apps">
              <Alert>
                <AlertDescription>
                  Mobile app configuration coming soon...
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="general">
              <Alert>
                <AlertDescription>
                  General settings coming soon...
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
