export default function Notifications() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mass Notifications</h1>
        <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg">
          Add New
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
        <div className="text-center py-12 text-gray-500">
          Mass Notifications management interface
        </div>
      </div>
    </div>
  );
}
