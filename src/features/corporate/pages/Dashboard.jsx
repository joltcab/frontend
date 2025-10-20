export default function CorporateDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Corporate Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium">Total Employees</h3>
          <p className="text-3xl font-bold mt-2">156</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium">Monthly Trips</h3>
          <p className="text-3xl font-bold mt-2">482</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium">Monthly Spend</h3>
          <p className="text-3xl font-bold mt-2">$12,450</p>
        </div>
      </div>
    </div>
  );
}
