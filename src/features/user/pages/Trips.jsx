import { useState, useEffect } from 'react';
import userService from '@/services/userService';

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const response = await userService.getTrips();
      setTrips(response.data.trips || response.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading trips');
      console.error('Error loading trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTrip = async (tripId) => {
    if (!confirm('Are you sure you want to cancel this trip?')) return;
    
    try {
      await userService.cancelTrip(tripId);
      loadTrips();
    } catch (err) {
      alert(err.response?.data?.message || 'Error cancelling trip');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      completed: 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return statusMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Trips</h1>

      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading trips...</div>
      ) : error ? (
        <div className="p-8 text-center text-red-600">{error}</div>
      ) : trips.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">🚕</div>
          <h3 className="text-xl font-semibold mb-2">No trips yet</h3>
          <p className="text-gray-600">Book your first ride to get started!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {trips.map((trip) => (
                  <tr key={trip._id || trip.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {trip.createdAt ? new Date(trip.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {trip.pickup?.address || trip.from || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {trip.dropoff?.address || trip.to || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(trip.status)}`}>
                        {trip.status || 'unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${trip.fare?.total || trip.amount || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-primary hover:text-primary/80 mr-3">View Details</button>
                      {trip.status === 'pending' && (
                        <button 
                          onClick={() => handleCancelTrip(trip._id || trip.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
