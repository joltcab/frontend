import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import adminService from '@/services/dashboardService';

export default function TripEarning() {
  const { id } = useParams();
  const [earning, setEarning] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadTripEarning();
    }
  }, [id]);

  const loadTripEarning = async () => {
    try {
      const data = await adminService.getTripEarning(id);
      setEarning(data);
    } catch (error) {
      console.error('Failed to load trip earning:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading earning details...</div>;
  if (!earning) return <div className="text-center py-8">Earning details not found</div>;

  const calculations = [
    { label: 'Base Fare', amount: earning.base_fare || 0 },
    { label: 'Distance Fare', amount: earning.distance_fare || 0 },
    { label: 'Time Fare', amount: earning.time_fare || 0 },
    { label: 'Surge Multiplier', amount: earning.surge_amount || 0, isAddon: true },
    { label: 'Waiting Charges', amount: earning.waiting_charges || 0, isAddon: true },
    { label: 'Toll Charges', amount: earning.toll_charges || 0, isAddon: true },
    { label: 'Discount', amount: earning.discount || 0, isDeduction: true },
    { label: 'Promo Discount', amount: earning.promo_discount || 0, isDeduction: true },
  ];

  const total = earning.total_amount || 0;
  const commission = earning.commission || 0;
  const driverEarning = total - commission;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Trip Earning Breakdown</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trip Info */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Trip Information</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Trip ID</span>
              <span className="font-semibold">#{earning.trip_id || earning._id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Customer</span>
              <span className="font-semibold">{earning.customer_name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Driver</span>
              <span className="font-semibold">{earning.driver_name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Distance</span>
              <span className="font-semibold">{earning.distance || 0} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration</span>
              <span className="font-semibold">{earning.duration || 0} min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-semibold">{earning.payment_method || 'Cash'}</span>
            </div>
          </div>
        </div>

        {/* Fare Breakdown */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Fare Calculation</h3>
          
          <div className="space-y-2">
            {calculations.map((item, index) => {
              if (item.amount === 0) return null;
              return (
                <div key={index} className="flex justify-between text-sm">
                  <span className={`${item.isDeduction ? 'text-red-600' : 'text-gray-600'}`}>
                    {item.label}
                  </span>
                  <span className={`font-semibold ${
                    item.isDeduction ? 'text-red-600' : 
                    item.isAddon ? 'text-green-600' : 
                    'text-gray-900'
                  }`}>
                    {item.isDeduction ? '-' : ''}${Math.abs(item.amount).toFixed(2)}
                  </span>
                </div>
              );
            })}

            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Fare</span>
                <span className="text-green-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t pt-3 mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Platform Commission ({earning.commission_rate || 20}%)</span>
                <span className="font-semibold text-red-600">-${commission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Driver Earning</span>
                <span className="text-blue-600">${driverEarning.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      <div className="mt-6 bg-white rounded-xl shadow p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Payment Status</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Payment Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              earning.payment_status === 'paid' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {earning.payment_status || 'Pending'}
            </span>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Driver Payout Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              earning.driver_payout_status === 'paid' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {earning.driver_payout_status || 'Pending'}
            </span>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Transaction Date</p>
            <p className="font-semibold">{earning.transaction_date || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
