import { useState, useEffect } from 'react';
import adminService from '@/services/dashboardService';

export default function ProviderTrack() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);

  useEffect(() => {
    loadOnlineProviders();
  }, []);

  const loadOnlineProviders = async () => {
    try {
      const data = await adminService.getOnlineProviders();
      setProviders(data.providers || []);
    } catch (error) {
      console.error('Failed to load providers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Live Provider Tracking</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Provider List */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
          <h3 className="font-semibold mb-4">Online Providers ({providers.length})</h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="text-center text-gray-500 py-4">Loading...</div>
            ) : providers.length === 0 ? (
              <div className="text-center text-gray-500 py-4">No online providers</div>
            ) : (
              providers.map((provider) => (
                <div
                  key={provider._id}
                  onClick={() => setSelectedProvider(provider)}
                  className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedProvider?._id === provider._id ? 'bg-blue-50 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{provider.name}</p>
                      <p className="text-sm text-gray-500">{provider.vehicle_type}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      <span className="text-xs text-gray-500">Online</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Map View */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow border border-gray-200 p-4">
          <h3 className="font-semibold mb-4">Map View</h3>
          <div className="bg-gray-100 rounded-lg h-[600px] flex items-center justify-center">
            {selectedProvider ? (
              <div className="text-center">
                <p className="text-gray-600">Map showing location of:</p>
                <p className="font-semibold text-lg">{selectedProvider.name}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Last updated: {selectedProvider.last_location_update || 'Just now'}
                </p>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Lat: {selectedProvider.latitude || 'N/A'}</p>
                  <p>Lng: {selectedProvider.longitude || 'N/A'}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Select a provider to view on map</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
