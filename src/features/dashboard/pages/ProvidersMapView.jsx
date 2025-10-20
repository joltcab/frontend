import { useState, useEffect } from 'react';
import { MapIcon, TruckIcon, UserIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';

export default function ProvidersMapView() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    online: 0,
    busy: 0,
    offline: 0
  });

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const data = await adminService.getOnlineProviders();
      const providersList = data.providers || [];
      setProviders(providersList);
      
      setStats({
        total: providersList.length,
        online: providersList.filter(p => p.is_active && !p.is_busy).length,
        busy: providersList.filter(p => p.is_busy).length,
        offline: providersList.filter(p => !p.is_active).length,
      });
    } catch (error) {
      console.error('Failed to load providers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Providers Map View</h1>
        <p className="text-gray-600 mt-1">Live tracking of all providers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Providers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <TruckIcon className="w-10 h-10 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Online</p>
                <p className="text-2xl font-bold text-green-600">{stats.online}</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Busy</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.busy}</p>
              </div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Offline</p>
                <p className="text-2xl font-bold text-gray-600">{stats.offline}</p>
              </div>
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-200 rounded-lg flex items-center justify-center" style={{ height: '600px' }}>
            <div className="text-center text-gray-500">
              <MapIcon className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg font-medium">Map Integration</p>
              <p className="text-sm">Google Maps / Mapbox integration required</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
