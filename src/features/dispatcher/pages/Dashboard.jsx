export default function DispatcherDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dispatcher Dashboard</h1>
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Quick Book</h2>
        <div className="space-y-4">
          <input type="text" placeholder="Customer phone" className="input-field" />
          <input type="text" placeholder="Pickup location" className="input-field" />
          <input type="text" placeholder="Dropoff location" className="input-field" />
          <button className="btn-primary w-full">Book Ride</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium">Today's Bookings</h3>
          <p className="text-3xl font-bold mt-2">23</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium">Active Trips</h3>
          <p className="text-3xl font-bold mt-2">8</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium">Total Revenue</h3>
          <p className="text-3xl font-bold mt-2">$1,245</p>
        </div>
      </div>
    </div>
  );
}
