import { useState, useEffect } from 'react';
import adminService from '@/services/dashboardService';

export default function Maps() {
  const [onlineDrivers, setOnlineDrivers] = useState([]);
  const [activeTrips, setActiveTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    loadMapData();
    const interval = setInterval(loadMapData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadMapData = async () => {
    try {
      const [driversData, tripsData] = await Promise.all([
        adminService.getOnlineProviders(),
        adminService.getActiveTrips(),
      ]);
      setOnlineDrivers(driversData.providers || []);
      setActiveTrips(tripsData.trips || []);
    } catch (error) {
      console.error('Failed to load map data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Live Maps</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar with Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Online Drivers</h3>
            <p className="text-3xl font-bold text-green-600">
              {loading ? '-' : onlineDrivers.length}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Active Trips</h3>
            <p className="text-3xl font-bold text-blue-600">
              {loading ? '-' : activeTrips.length}
            </p>
          </div>

          {/* Driver List */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
            <h3 className="font-semibold mb-3">Online Drivers</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {loading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : onlineDrivers.length === 0 ? (
                <p className="text-sm text-gray-500">No drivers online</p>
              ) : (
                onlineDrivers.map((driver) => (
                  <div
                    key={driver._id}
                    onClick={() => setSelectedItem({ type: 'driver', data: driver })}
                    className={`p-2 border rounded cursor-pointer hover:bg-gray-50 ${
                      selectedItem?.type === 'driver' && selectedItem?.data._id === driver._id
                        ? 'bg-blue-50 border-blue-500'
                        : ''
                    }`}
                  >
                    <p className="font-medium text-sm">{driver.name}</p>
                    <p className="text-xs text-gray-500">{driver.vehicle_type}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Map View */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Live Map View</h3>
          
          <div className="bg-gray-100 rounded-lg h-[600px] flex items-center justify-center">
            {selectedItem ? (
              <div className="text-center">
                <p className="text-gray-600">Showing location of:</p>
                <p className="font-semibold text-lg">
                  {selectedItem.type === 'driver' 
                    ? selectedItem.data.name 
                    : `Trip #${selectedItem.data.trip_id}`}
                </p>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Lat: {selectedItem.data.latitude || 'N/A'}</p>
                  <p>Lng: {selectedItem.data.longitude || 'N/A'}</p>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Last updated: {selectedItem.data.last_update || 'Just now'}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-500">Select a driver or trip to view on map</p>
                <p className="text-sm text-gray-400 mt-2">
                  Map integration with Google Maps / Mapbox would display here
                </p>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span className="text-gray-600">Available Drivers</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              <span className="text-gray-600">Active Trips</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
