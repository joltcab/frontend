import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '@/services/dashboardService';

export default function ProviderVehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const response = await adminService.getDrivers();
      const drivers = response.data?.data || [];
      const allVehicles = drivers.flatMap(driver => 
        (driver.vehicles || []).map(v => ({
          ...v,
          provider_name: `${driver.first_name} ${driver.last_name}`,
          driver_id: driver._id
        }))
      );
      setVehicles(allVehicles);
    } catch (error) {
      console.error('Failed to load vehicles:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Provider Vehicles</h1>
        <Link
          to="/admin/dashboard/vehicles/add"
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
        >
          Add Vehicle
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Make/Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plate Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : vehicles.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">No vehicles found</td>
                </tr>
              ) : (
                vehicles.map((vehicle) => (
                  <tr key={vehicle._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{vehicle.provider_name || 'N/A'}</td>
                    <td className="px-6 py-4">{vehicle.vehicle_type || 'Sedan'}</td>
                    <td className="px-6 py-4">{vehicle.make} {vehicle.model}</td>
                    <td className="px-6 py-4 font-mono">{vehicle.plate_number}</td>
                    <td className="px-6 py-4">{vehicle.year}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        vehicle.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {vehicle.is_approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <Link 
                        to={`/admin/dashboard/drivers/${vehicle.driver_id}/edit`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit Driver
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
