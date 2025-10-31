import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { joltcab } from "@/lib/joltcab-api";
import { 
  CheckCircle, 
  Circle, 
  Loader2, 
  Rocket,
  MapPin,
  CreditCard,
  MessageSquare,
  Mail,
  Settings,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function QuickSetupWizard() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Cargar settings existentes
  const { data: existingSettings, isLoading: loadingSettings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => joltcab.settings.get(),
  });
  
  const [config, setConfig] = useState({
    // Mapbox (Primary)
    mapbox_access_token: '',
    use_mapbox_primary: true,
    
    // Google Maps (Backup)
    web_app_google_key: '',
    
    // Stripe
    stripe_secret_key: '',
    stripe_publishable_key: '',
    
    // Twilio
    twilio_account_sid: '',
    twilio_auth_token: '',
    twilio_number: '',
    
    // Email (SMTP)
    smtp_host: '',
    smtp_port: '587',
    smtp_user: '',
    smtp_password: '',
    sender_email: '',
    sender_name: 'JoltCab',
    
    // Firebase
    firebase_apiKey: '',
    firebase_projectId: '',
    firebase_authDomain: '',
    firebase_storageBucket: '',
    firebase_messagingSenderId: '',
  });

  // Cargar valores existentes cuando se obtienen los settings
  useEffect(() => {
    if (existingSettings) {
      console.log('📥 Cargando settings existentes:', existingSettings);
      setConfig(prev => ({
        ...prev,
        mapbox_access_token: existingSettings.mapbox_access_token || '',
        web_app_google_key: existingSettings.web_app_google_key || '',
        stripe_secret_key: existingSettings.stripe_secret_key || '',
        stripe_publishable_key: existingSettings.stripe_publishable_key || '',
        twilio_account_sid: existingSettings.twilio_account_sid || '',
        twilio_auth_token: existingSettings.twilio_auth_token || '',
        twilio_number: existingSettings.twilio_number || '',
        smtp_host: existingSettings.smtp_host || '',
        smtp_port: existingSettings.smtp_port || '587',
        smtp_user: existingSettings.smtp_user || '',
        smtp_password: existingSettings.smtp_password || '',
        sender_email: existingSettings.sender_email || '',
        sender_name: existingSettings.sender_name || 'JoltCab',
        firebase_apiKey: existingSettings.firebase_apiKey || '',
        firebase_projectId: existingSettings.firebase_projectId || '',
        firebase_authDomain: existingSettings.firebase_authDomain || '',
        firebase_storageBucket: existingSettings.firebase_storageBucket || '',
        firebase_messagingSenderId: existingSettings.firebase_messagingSenderId || '',
      }));
    }
  }, [existingSettings]);

  const steps = [
    {
      id: 0,
      title: 'System Configuration',
      description: 'Initialize system defaults',
      icon: Settings,
      action: async () => {
        await joltcab.settings.initialize();
      }
    },
    {
      id: 1,
      title: 'Mapping Services',
      description: 'Configure Mapbox (primary) and Google Maps (backup)',
      icon: MapPin,
      fields: [
        { key: 'mapbox_access_token', label: 'Mapbox Access Token', type: 'password', required: false, placeholder: 'pk.ey...' },
        { key: 'web_app_google_key', label: 'Google Maps API Key (Backup)', type: 'password', required: false, placeholder: 'AIza...' }
      ],
      action: async (data) => {
        console.log('🗺️ Guardando configuración de mapas:', {
          mapbox_access_token: data.mapbox_access_token || '',
          web_app_google_key: data.web_app_google_key || '',
          use_mapbox_primary: true,
        });
        
        const result = await joltcab.settings.update({
          mapbox_access_token: data.mapbox_access_token || '',
          web_app_google_key: data.web_app_google_key || '',
          use_mapbox_primary: true,
        });
        
        console.log('✅ Resultado de guardado:', result);
        return result;
      }
    },
    {
      id: 2,
      title: 'Stripe Payments',
      description: 'Process card payments',
      icon: CreditCard,
      fields: [
        { key: 'stripe_secret_key', label: 'Stripe Secret Key', type: 'password', required: true },
        { key: 'stripe_publishable_key', label: 'Stripe Publishable Key', type: 'text', required: true }
      ],
      action: async (data) => {
        await joltcab.settings.update({
          stripe_secret_key: data.stripe_secret_key,
          stripe_publishable_key: data.stripe_publishable_key,
        });
      }
    },
    {
      id: 3,
      title: 'Twilio SMS',
      description: 'Send SMS notifications',
      icon: MessageSquare,
      fields: [
        { key: 'twilio_account_sid', label: 'Twilio Account SID', type: 'password', required: true },
        { key: 'twilio_auth_token', label: 'Twilio Auth Token', type: 'password', required: true },
        { key: 'twilio_number', label: 'Twilio Phone Number', type: 'text', required: true, placeholder: '+1234567890' }
      ],
      action: async (data) => {
        await joltcab.settings.update({
          twilio_account_sid: data.twilio_account_sid,
          twilio_auth_token: data.twilio_auth_token,
          twilio_number: data.twilio_number,
        });
      }
    },
    {
      id: 4,
      title: 'Email Settings',
      description: 'Configure SMTP for emails',
      icon: Mail,
      fields: [
        { key: 'smtp_host', label: 'SMTP Host', type: 'text', required: true, placeholder: 'smtp.gmail.com' },
        { key: 'smtp_port', label: 'SMTP Port', type: 'number', required: true },
        { key: 'smtp_user', label: 'SMTP Username/Email', type: 'email', required: true },
        { key: 'smtp_password', label: 'SMTP Password', type: 'password', required: true },
        { key: 'sender_email', label: 'From Email', type: 'email', required: true },
        { key: 'sender_name', label: 'From Name', type: 'text', required: true }
      ],
      action: async (data) => {
        await joltcab.settings.update({
          smtp_host: data.smtp_host,
          smtp_port: data.smtp_port,
          smtp_user: data.smtp_user,
          smtp_password: data.smtp_password,
          sender_email: data.sender_email,
          sender_name: data.sender_name,
        });
      }
    },
    {
      id: 5,
      title: 'Firebase (Optional)',
      description: 'Push notifications and real-time features',
      icon: Rocket,
      fields: [
        { key: 'firebase_apiKey', label: 'Firebase API Key', type: 'password', required: false },
        { key: 'firebase_projectId', label: 'Firebase Project ID', type: 'text', required: false },
        { key: 'firebase_authDomain', label: 'Firebase Auth Domain', type: 'text', required: false },
        { key: 'firebase_storageBucket', label: 'Firebase Storage Bucket', type: 'text', required: false },
        { key: 'firebase_messagingSenderId', label: 'Firebase Messaging Sender ID', type: 'text', required: false }
      ],
      action: async (data) => {
        await joltcab.settings.update({
          firebase_apiKey: data.firebase_apiKey || '',
          firebase_projectId: data.firebase_projectId || '',
          firebase_authDomain: data.firebase_authDomain || '',
          firebase_storageBucket: data.firebase_storageBucket || '',
          firebase_messagingSenderId: data.firebase_messagingSenderId || '',
        });
      }
    }
  ];

  const currentStep = steps[step];

  const handleNext = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Execute step action
      if (currentStep.action) {
        console.log('💾 Saving step:', currentStep.title);
        console.log('📦 Data:', config);
        
        const result = await currentStep.action(config);
        
        console.log('✅ Save result:', result);
      }

      // Invalidar queries para refrescar datos
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['configStatus'] });
      
      setSuccess(`✅ ${currentStep.title} configured successfully!`);
      
      // Move to next step after 1 second
      setTimeout(() => {
        if (step < steps.length - 1) {
          setStep(step + 1);
          setSuccess('');
        } else {
          setSuccess('🎉 Setup completed! Your app is ready to use.');
          // Invalidar queries finales
          queryClient.invalidateQueries({ queryKey: ['settings'] });
          queryClient.invalidateQueries({ queryKey: ['configStatus'] });
        }
        setLoading(false);
      }, 1000);

    } catch (err) {
      console.error('❌ Setup error:', err);
      console.error('Error details:', err.response || err);
      setError(err.message || err.error || 'Configuration failed. Please check your credentials.');
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const isStepValid = () => {
    if (!currentStep.fields) return true;

    return currentStep.fields
      .filter(f => f.required)
      .every(f => {
        const val = config[f.key];
        if (val === null || val === undefined) return false;
        if (typeof val === 'string') return val.trim() !== '';
        // For booleans, numbers, or objects, presence counts as valid
        return true;
      });
  };

  const StepIcon = currentStep.icon;

  if (loadingSettings) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#15B46A] mr-3" />
            <span className="text-gray-600">Loading configuration...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 mb-4">
            <Rocket className="w-8 h-8 text-[#15B46A]" />
            <div>
              <CardTitle className="text-2xl">Quick Setup Wizard</CardTitle>
              <CardDescription>
                Configure JoltCab in 6 easy steps
              </CardDescription>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 mt-6">
            {steps.map((s, idx) => (
              <React.Fragment key={s.id}>
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full
                  ${idx < step ? 'bg-green-500 text-white' : 
                    idx === step ? 'bg-[#15B46A] text-white' : 
                    'bg-gray-200 text-gray-500'}
                `}>
                  {idx < step ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-1 ${idx < step ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#15B46A]/10 rounded-lg flex items-center justify-center">
                <StepIcon className="w-6 h-6 text-[#15B46A]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{currentStep.title}</h3>
                <p className="text-sm text-gray-600">{currentStep.description}</p>
              </div>
            </div>

            {/* Step Fields */}
            {currentStep.fields ? (
              <div className="space-y-4 mt-6">
                {currentStep.fields.map(field => (
                  <div key={field.key} className="space-y-2">
                    <Label>
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <Input
                      type={field.type}
                      value={config[field.key] || ''}
                      onChange={(e) => setConfig({...config, [field.key]: e.target.value})}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  </div>
                ))}

                {/* Help Links */}
                {step === 1 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Get Google Maps API Key:</strong>
                      <ol className="ml-4 mt-2 text-sm space-y-1 list-decimal">
                        <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-[#15B46A] underline">Google Cloud Console</a></li>
                        <li>Enable: Maps JavaScript API, Directions API, Places API</li>
                        <li>Create credentials → API Key</li>
                      </ol>
                    </AlertDescription>
                  </Alert>
                )}

                {step === 2 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Get Stripe Keys:</strong>
                      <ol className="ml-4 mt-2 text-sm space-y-1 list-decimal">
                        <li>Go to <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="text-[#15B46A] underline">Stripe Dashboard</a></li>
                        <li>Copy your Secret key (sk_test_... or sk_live_...)</li>
                        <li>Copy your Publishable key (pk_test_... or pk_live_...)</li>
                      </ol>
                    </AlertDescription>
                  </Alert>
                )}

                {step === 3 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Get Twilio Credentials:</strong>
                      <ol className="ml-4 mt-2 text-sm space-y-1 list-decimal">
                        <li>Go to <a href="https://console.twilio.com/" target="_blank" rel="noopener noreferrer" className="text-[#15B46A] underline">Twilio Console</a></li>
                        <li>Copy Account SID (starts with AC...)</li>
                        <li>Copy Auth Token</li>
                        <li>Get a phone number from Twilio</li>
                      </ol>
                    </AlertDescription>
                  </Alert>
                )}

                {step === 4 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Gmail SMTP Settings:</strong>
                      <ul className="ml-4 mt-2 text-sm space-y-1 list-disc">
                        <li>Host: smtp.gmail.com</li>
                        <li>Port: 587 (TLS) or 465 (SSL)</li>
                        <li>Use an App Password (not your Gmail password)</li>
                        <li><a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-[#15B46A] underline">Create App Password</a></li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <Alert className="bg-blue-50 border-blue-200">
                <Settings className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-900">
                  This step will initialize default system configurations, email templates, and SMS templates.
                  Click "Next" to proceed.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Messages */}
          {error && (
            <Alert className="mb-4 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-900">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-900">{success}</AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={() => step > 0 && setStep(step - 1)}
              disabled={step === 0 || loading}
            >
              ← Back
            </Button>

            <div className="flex gap-2">
              {currentStep.fields && (
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  disabled={loading || step === steps.length - 1}
                >
                  Skip for Now
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                disabled={loading || !isStepValid()}
                className="bg-[#15B46A] hover:bg-[#0F9456]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Configuring...
                  </>
                ) : step === steps.length - 1 ? (
                  '🎉 Finish Setup'
                ) : (
                  'Next →'
                )}
              </Button>
            </div>
          </div>

          {/* Skip All */}
          {step === 0 && (
            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => window.location.reload()}
                className="text-gray-500 text-sm"
              >
                I'll configure this later
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}