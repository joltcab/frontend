import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { joltcab } from '@/lib/joltcab-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  MapPin,
  CreditCard,
  MessageSquare,
  Mail,
  Rocket,
  Loader2
} from 'lucide-react';

export default function ConfigurationStatus() {
  const { data: status, isLoading } = useQuery({
    queryKey: ['configStatus'],
    queryFn: () => joltcab.settings.getConfigStatus(),
    refetchInterval: 5000, // Refrescar cada 5 segundos
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#15B46A] mr-2" />
          <span className="text-gray-600">Loading configuration status...</span>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return null;
  }

  const services = [
    {
      name: 'Mapbox',
      key: 'mapbox',
      icon: MapPin,
      description: 'Primary mapping service for location and routing',
      critical: false,
    },
    {
      name: 'Google Maps',
      key: 'google_maps',
      icon: MapPin,
      description: 'Backup mapping service',
      critical: false,
    },
    {
      name: 'Stripe',
      key: 'stripe',
      icon: CreditCard,
      description: 'Required for payment processing',
      critical: true,
    },
    {
      name: 'Twilio SMS',
      key: 'twilio',
      icon: MessageSquare,
      description: 'Required for SMS notifications',
      critical: false,
    },
    {
      name: 'SMTP',
      key: 'smtp',
      icon: Mail,
      description: 'Required for email notifications',
      critical: false,
    },
    {
      name: 'Firebase',
      key: 'firebase',
      icon: Rocket,
      description: 'Required for push notifications',
      critical: false,
    },
  ];

  const configuredCount = status.configured_services?.length || 0;
  const totalCount = Object.keys(status.status || {}).length;
  const criticalMissing = services.filter(s => s.critical && !status.status?.[s.key]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>System Configuration Status</span>
          <Badge variant={criticalMissing.length > 0 ? 'destructive' : 'success'}>
            {configuredCount}/{totalCount} Configured
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {criticalMissing.length > 0 && (
          <Alert className="mb-4 bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Critical services missing:</strong> Some core features won't work until you configure {criticalMissing.map(s => s.name).join(', ')} in the Setup Wizard.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          {services.map((service) => {
            const isConfigured = status.status?.[service.key];
            const ServiceIcon = service.icon;

            return (
              <div
                key={service.key}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  isConfigured 
                    ? 'bg-green-50 border-green-200' 
                    : service.critical 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <ServiceIcon className={`w-5 h-5 mt-0.5 ${
                  isConfigured ? 'text-green-600' : service.critical ? 'text-red-600' : 'text-gray-400'
                }`} />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">{service.name}</h4>
                    {service.critical && (
                      <Badge variant="outline" className="text-xs">Critical</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                </div>

                {isConfigured ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
            );
          })}
        </div>

        {criticalMissing.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> Go to the Setup Wizard to configure missing services and unlock all features.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
