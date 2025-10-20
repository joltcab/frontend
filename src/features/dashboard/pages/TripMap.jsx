import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import adminService from '@/services/dashboardService';

export default function TripMap() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadTrip();
    }
  }, [id]);

  const loadTrip = async () => {
    try {
      const data = await adminService.getTrip(id);
      setTrip(data);
    } catch (error) {
      console.error('Failed to load trip:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading trip...</div>;
  if (!trip) return <div className="text-center py-8">Trip not found</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Trip Map View</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trip Details Panel */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Trip Details</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Trip ID</p>
              <p className="font-semibold">#{trip.trip_id || trip._id}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                trip.status === 'completed' ? 'bg-green-100 text-green-800' :
                trip.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                trip.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {trip.status}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-semibold">{trip.customer_name || 'N/A'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Driver</p>
              <p className="font-semibold">{trip.driver_name || 'N/A'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Distance</p>
              <p className="font-semibold">{trip.distance || 0} km</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-semibold">{trip.duration || 0} min</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Fare</p>
              <p className="font-semibold text-green-600">${trip.total_amount || 0}</p>
            </div>
          </div>
        </div>

        {/* Map View */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Route Map</h3>
          
          <div className="bg-gray-100 rounded-lg h-[500px] flex flex-col items-center justify-center">
            <div className="text-center space-y-4">
              <p className="text-gray-600 font-semibold">Route Visualization</p>
              
              <div className="text-left bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                  <div>
                    <p className="text-sm text-gray-500">Pickup Location</p>
                    <p className="font-medium">{trip.pickup_address || 'N/A'}</p>
                    <p className="text-xs text-gray-400">
                      {trip.pickup_lat}, {trip.pickup_lng}
                    </p>
                  </div>
                </div>

                <div className="border-l-2 border-dashed border-gray-300 h-8 ml-1.5"></div>

                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-1"></div>
                  <div>
                    <p className="text-sm text-gray-500">Drop-off Location</p>
                    <p className="font-medium">{trip.dropoff_address || 'N/A'}</p>
                    <p className="text-xs text-gray-400">
                      {trip.dropoff_lat}, {trip.dropoff_lng}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                Map integration with Google Maps / Mapbox would display here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
