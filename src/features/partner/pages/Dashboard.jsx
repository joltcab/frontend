export default function PartnerDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Fleet Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium">Total Drivers</h3>
          <p className="text-3xl font-bold mt-2">45</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium">Active Now</h3>
          <p className="text-3xl font-bold mt-2">28</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium">Total Vehicles</h3>
          <p className="text-3xl font-bold mt-2">52</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium">Monthly Revenue</h3>
          <p className="text-3xl font-bold mt-2">$45,230</p>
        </div>
      </div>
    </div>
  );
}
