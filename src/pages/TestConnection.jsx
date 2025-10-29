import { useEffect, useState } from 'react';
import apiClient from '@/lib/api-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';

export default function TestConnection() {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [backendInfo, setBackendInfo] = useState(null);
  const [metrics, setMetrics] = useState(null);

  const testConnection = async () => {
    setStatus('loading');
    setMessage('Testing connection...');

    try {
      // Test 1: Backend health
      const healthResponse = await fetch('http://localhost:5001/api/diagnostics');
      const healthData = await healthResponse.json();
      
      if (healthData.success) {
        setBackendInfo(healthData);
        setMessage('✅ Backend is running!');
        
        // Test 2: Try to get dashboard metrics
        try {
          const metricsData = await apiClient.getDashboardMetrics();
          setMetrics(metricsData.metrics);
          setStatus('success');
          setMessage('✅ Connected! All endpoints working');
        } catch (error) {
          setStatus('partial');
          setMessage('⚠️ Backend running but some endpoints need auth');
        }
      }
    } catch (error) {
      setStatus('error');
      setMessage('❌ Connection failed: ' + error.message);
      console.error('Connection error:', error);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Backend Connection Test</CardTitle>
          <CardDescription>
            Testing connection to JoltCab backend at http://localhost:5001
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status */}
          <div className="flex items-center gap-3">
            {status === 'loading' && <Loader2 className="h-6 w-6 animate-spin text-blue-500" />}
            {status === 'success' && <CheckCircle2 className="h-6 w-6 text-green-500" />}
            {status === 'partial' && <CheckCircle2 className="h-6 w-6 text-yellow-500" />}
            {status === 'error' && <XCircle className="h-6 w-6 text-red-500" />}
            <p className="text-lg font-medium">{message}</p>
          </div>

          {/* Retry Button */}
          <Button onClick={testConnection} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Test Again
          </Button>

          {/* Backend Info */}
          {backendInfo && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Backend Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-lg font-medium">Running</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Database</p>
                  <p className="text-lg font-medium">{backendInfo.diagnostics?.database || 'Connected'}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Models</p>
                  <p className="text-lg font-medium">{backendInfo.diagnostics?.models || 'N/A'}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">API URL</p>
                  <p className="text-sm font-mono">{apiClient.baseURL}</p>
                </div>
              </div>
            </div>
          )}

          {/* Metrics */}
          {metrics && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Dashboard Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metrics.general && (
                  <>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600">Total Users</p>
                      <p className="text-2xl font-bold text-blue-700">{metrics.general.total_users}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600">Total Providers</p>
                      <p className="text-2xl font-bold text-green-700">{metrics.general.total_providers}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-600">Total Trips</p>
                      <p className="text-2xl font-bold text-purple-700">{metrics.general.total_trips}</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-600">Active Trips</p>
                      <p className="text-2xl font-bold text-orange-700">{metrics.general.active_trips}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">✅ Connection Successful!</h4>
            <p className="text-sm text-blue-700">
              Your frontend is now connected to the JoltCab backend. You can start using all the features:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-blue-700">
              <li>• 🤖 AI Matching & Dynamic Pricing</li>
              <li>• 💰 Payments & Transactions</li>
              <li>• ✅ Verification & Documents</li>
              <li>• 📱 WhatsApp Booking</li>
              <li>• 🗺️ Maps & Routing</li>
              <li>• 📊 Real-time Dashboard</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
