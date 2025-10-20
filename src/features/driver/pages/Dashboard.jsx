export default function DriverDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Driver Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium">Today's Earnings</h3>
          <p className="text-3xl font-bold mt-2">$234.50</p>
          <p className="text-green-600 text-sm mt-2">+15% from yesterday</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium">Completed Trips</h3>
          <p className="text-3xl font-bold mt-2">12</p>
          <p className="text-gray-600 text-sm mt-2">Today</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium">Rating</h3>
          <p className="text-3xl font-bold mt-2">4.9 ⭐</p>
          <p className="text-gray-600 text-sm mt-2">245 reviews</p>
        </div>
      </div>
      <div className="mt-8 card">
        <h2 className="text-xl font-semibold mb-4">Go Online</h2>
        <button className="btn-primary w-full">Start accepting rides</button>
      </div>
    </div>
  );
}
