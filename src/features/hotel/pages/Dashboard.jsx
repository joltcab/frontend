export default function HotelDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Hotel Dashboard</h1>
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Book Ride for Guest</h2>
        <div className="space-y-4">
          <input type="text" placeholder="Guest name or room number" className="input-field" />
          <input type="text" placeholder="Destination" className="input-field" />
          <button className="btn-primary w-full">Book Ride</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium">Today's Rides</h3>
          <p className="text-3xl font-bold mt-2">15</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium">Active Rides</h3>
          <p className="text-3xl font-bold mt-2">3</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium">Total Guests Served</h3>
          <p className="text-3xl font-bold mt-2">248</p>
        </div>
      </div>
    </div>
  );
}
