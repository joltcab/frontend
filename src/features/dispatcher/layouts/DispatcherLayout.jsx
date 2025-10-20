import { Outlet, Link, useNavigate } from 'react-router-dom';

export default function DispatcherLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/dispatcher" className="text-2xl font-bold">JoltCab Dispatcher</Link>
          <div className="flex items-center space-x-6">
            <Link to="/dispatcher" className="text-gray-700 hover:text-black">Dashboard</Link>
            <Link to="/dispatcher/book" className="text-gray-700 hover:text-black">Book Ride</Link>
            <Link to="/dispatcher/trips" className="text-gray-700 hover:text-black">Trips</Link>
            <button onClick={handleLogout} className="text-gray-700 hover:text-black">Logout</button>
          </div>
        </div>
      </nav>
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
