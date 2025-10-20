import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Star,
  Wallet,
  TrendingUp,
  Clock,
  Gift,
  Zap
} from 'lucide-react';
import aiService from '../../../services/aiService';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalTrips: 0,
    walletBalance: 0,
    rewardsPoints: 0,
    monthlySpend: 0
  });
  const [recentTrips, setRecentTrips] = useState([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setStats({
      totalTrips: 42,
      walletBalance: 125.00,
      rewardsPoints: 1240,
      monthlySpend: 328.50
    });

    setRecentTrips([
      { id: 1, date: 'Today, 2:30 PM', from: '123 Main St', to: '456 Oak Ave', price: 24.50, status: 'Completed', rating: 5 },
      { id: 2, date: 'Yesterday, 5:15 PM', from: 'Central Mall', to: 'Home', price: 18.20, status: 'Completed', rating: 4 },
      { id: 3, date: 'Mar 15, 10:00 AM', from: 'Office', to: 'Airport', price: 45.00, status: 'Completed', rating: 5 },
    ]);
  };

  const handleQuickBook = async (e) => {
    e.preventDefault();
    if (!pickup || !dropoff) {
      alert('Por favor ingresa origen y destino');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await aiService.calculateDynamicPrice({
        service_type_id: 1,
        base_price: 15,
        distance: 5,
        duration: 15,
        pickup_location: { latitude: 0, longitude: 0 }
      });
      
      if (result.success && result.data) {
        const { final_price, multiplier, demand_level } = result.data;
        
        // Navegar directamente con los datos
        navigate('/user/book', { 
          state: { 
            pickup, 
            dropoff, 
            pricing: result.data 
          } 
        });
      } else {
        alert('No se pudo calcular el precio. Por favor intenta de nuevo.');
      }
    } catch (error) {
      console.error('Quick book error:', error);
      alert('Error al calcular precio dinámico. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: Calendar, label: 'Total Trips', value: stats.totalTrips, color: 'bg-blue-100 text-blue-600' },
    { icon: Wallet, label: 'Wallet Balance', value: `$${stats.walletBalance.toFixed(2)}`, color: 'bg-green-100 text-green-600' },
    { icon: Gift, label: 'Rewards Points', value: stats.rewardsPoints, color: 'bg-purple-100 text-purple-600' },
    { icon: TrendingUp, label: 'Monthly Spend', value: `$${stats.monthlySpend.toFixed(2)}`, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
              <p className="text-gray-600">Ready for your next ride?</p>
            </div>
            <Link
              to="/user/profile"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-joltcab-green text-white flex items-center justify-center font-semibold">
                U
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Book Section */}
        <div className="bg-gradient-to-br from-joltcab-green to-green-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-white/20 rounded-lg">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">AI-Powered Quick Book</h2>
              <p className="text-green-100">Get dynamic pricing instantly</p>
            </div>
          </div>

          <form onSubmit={handleQuickBook} className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5" />
                <label className="font-medium">Pickup Location</label>
              </div>
              <input
                type="text"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="Enter pickup address..."
                className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                required
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5" />
                <label className="font-medium">Drop-off Location</label>
              </div>
              <input
                type="text"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                placeholder="Enter destination..."
                className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-joltcab-green rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Clock className="w-5 h-5 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Get AI Price & Book
                </>
              )}
            </button>
          </form>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className={`inline-flex p-3 rounded-lg ${stat.color} mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Trips */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Trips</h3>
          </div>

          <div className="divide-y divide-gray-200">
            {recentTrips.map((trip) => (
              <div key={trip.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{trip.date}</p>
                    <div className="space-y-1">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium text-gray-900">{trip.from}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium text-gray-900">{trip.to}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg font-bold text-gray-900">${trip.price.toFixed(2)}</p>
                    <div className="flex items-center gap-1 text-yellow-500 mt-1">
                      {[...Array(trip.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 bg-gray-50">
            <Link
              to="/user/trips"
              className="text-joltcab-green font-medium hover:underline flex items-center justify-center gap-2"
            >
              View all trips
              <TrendingUp className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
