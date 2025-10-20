import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function LandingPage() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');

  const handleGetPrices = (e) => {
    e.preventDefault();
    // TODO: Implementar lógica de estimación de precio
    console.log('Getting prices for:', { pickup, dropoff });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Heading & Form */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Go anywhere<br />with JoltCab
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Request a ride, hop in, and go.
              </p>

              {/* Request Form */}
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
                <form onSubmit={handleGetPrices}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pickup location
                      </label>
                      <input
                        type="text"
                        placeholder="Enter pickup location"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dropoff location
                      </label>
                      <input
                        type="text"
                        placeholder="Enter destination"
                        value={dropoff}
                        onChange={(e) => setDropoff(e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full btn-primary"
                    >
                      See prices
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Side - Illustration */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="w-full max-w-lg">
                {/* Car Illustration SVG - JoltCab Colors */}
                <svg viewBox="0 0 800 600" className="w-full h-auto">
                  <rect x="100" y="200" width="600" height="300" rx="20" fill="#7ed957" />
                  <circle cx="250" cy="450" r="60" fill="#000000" />
                  <circle cx="250" cy="450" r="30" fill="#E5E7EB" />
                  <circle cx="650" cy="450" r="60" fill="#000000" />
                  <circle cx="650" cy="450" r="30" fill="#E5E7EB" />
                  <rect x="120" y="220" width="180" height="120" rx="10" fill="#D1D5DB" opacity="0.5" />
                  <rect x="330" y="220" width="180" height="120" rx="10" fill="#D1D5DB" opacity="0.5" />
                  <rect x="540" y="220" width="140" height="120" rx="10" fill="#D1D5DB" opacity="0.5" />
                  <rect x="580" y="330" width="60" height="30" rx="15" fill="#F3F4F6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Suggestions Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Suggestions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/ride" className="card hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Ride</h3>
                  <p className="text-gray-600 text-sm">Go anywhere with JoltCab</p>
                </div>
              </div>
            </Link>

            <Link to="/reserve" className="card hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Reserve</h3>
                  <p className="text-gray-600 text-sm">Reserve your ride in advance</p>
                </div>
              </div>
            </Link>

            <Link to="/package" className="card hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Package</h3>
                  <p className="text-gray-600 text-sm">Everyday deliveries, from the store</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Drive Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Drive when you want, make what you need</h2>
              <p className="text-lg text-gray-600 mb-6">
                Make money on your schedule with deliveries or rides—or both. You can use your own car or choose a rental through JoltCab.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/driver/register" className="btn-primary text-center">
                  Get started
                </Link>
                <Link to="/driver/info" className="btn-secondary text-center">
                  Already have an account? Sign in
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-primary-500 w-full max-w-md h-96 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 flex justify-center">
              <div className="bg-gray-200 w-full max-w-md h-96 rounded-2xl"></div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-bold mb-6">The JoltCab you know, reimagined for business</h2>
              <p className="text-lg text-gray-600 mb-6">
                JoltCab for Business is a platform for managing global rides and meals, and local deliveries, for companies of any size.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/business" className="btn-primary text-center">
                  Get started
                </Link>
                <Link to="/business/solutions" className="btn-secondary text-center">
                  Check out our solutions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6 text-center">Safety First. Always.</h2>
          <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Whether you're in the back seat or behind the wheel, your safety is essential. We are committed to doing our part, and technology is at the heart of our approach.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold mb-3">Our commitment to your safety</h3>
              <p className="text-gray-600 mb-4">
                With every safety feature and every standard in our Community Guidelines, we're committed to helping to create a safe environment for our users.
              </p>
              <Link to="/safety" className="text-black font-medium hover:underline">
                Read about our Community Guidelines →
              </Link>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-3">Setting rideshare standards</h3>
              <p className="text-gray-600 mb-4">
                Safety starts on the ground with every driver and delivery person. We lead the industry with features that protect those who use JoltCab.
              </p>
              <Link to="/safety/standards" className="text-black font-medium hover:underline">
                Explore our safety features →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
