import { useState, useEffect } from 'react';
import { MapIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { Card, CardHeader, CardTitle, CardContent, Input, Button, Badge } from '@/components/ui';

export default function ProviderTracking() {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const data = await adminService.getOnlineProviders();
      setProviders(data.providers || generateMockProviders());
    } catch (error) {
      console.error('Failed to load providers:', error);
      setProviders(generateMockProviders());
    } finally {
      setLoading(false);
    }
  };

  const generateMockProviders = () => [
    {
      _id: '1',
      first_name: 'James',
      last_name: 'Wilson',
      phone: '+1 (555) 111-2222',
      vehicle_type: 'Sedan',
      is_active: true,
      is_busy: false,
      current_location: { latitude: 40.7128, longitude: -74.0060, address: 'New York, NY' }
    },
    {
      _id: '2',
      first_name: 'Maria',
      last_name: 'Garcia',
      phone: '+1 (555) 222-3333',
      vehicle_type: 'SUV',
      is_active: true,
      is_busy: true,
      current_location: { latitude: 40.7580, longitude: -73.9855, address: 'Times Square, NY' }
    },
  ];

  const filteredProviders = providers.filter(p =>
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading providers...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Provider Tracking</h1>
        <p className="text-gray-600 mt-1">Track individual provider location in real-time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Select Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Search by name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredProviders.map((provider) => (
                  <button
                    key={provider._id}
                    onClick={() => setSelectedProvider(provider)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedProvider?._id === provider._id
                        ? 'border-joltcab-500 bg-joltcab-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900">
                        {provider.first_name} {provider.last_name}
                      </p>
                      <Badge variant={provider.is_busy ? 'warning' : 'success'} size="sm">
                        {provider.is_busy ? 'Busy' : 'Available'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{provider.phone}</p>
                    <p className="text-xs text-gray-500">{provider.vehicle_type}</p>
                  </button>
                ))}

                {filteredProviders.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No providers found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedProvider
                  ? `Tracking: ${selectedProvider.first_name} ${selectedProvider.last_name}`
                  : 'Select a provider to track'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedProvider ? (
                <div>
                  <div className="bg-gray-200 rounded-lg flex items-center justify-center mb-4" style={{ height: '400px' }}>
                    <div className="text-center text-gray-500">
                      <MapIcon className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-lg font-medium">Real-time Tracking Map</p>
                      <p className="text-sm">Map integration required</p>
                      <p className="text-xs mt-2">
                        Location: {selectedProvider.current_location?.address}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium">
                        {selectedProvider.is_busy ? 'On Trip' : 'Available'}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Vehicle Type</p>
                      <p className="font-medium">{selectedProvider.vehicle_type}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg flex items-center justify-center" style={{ height: '400px' }}>
                  <div className="text-center text-gray-400">
                    <MagnifyingGlassIcon className="w-16 h-16 mx-auto mb-4" />
                    <p>Select a provider from the list to track their location</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
