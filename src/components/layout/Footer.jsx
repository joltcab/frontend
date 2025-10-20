import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About us</Link></li>
              <li><Link to="/newsroom" className="text-gray-300 hover:text-white transition-colors">Newsroom</Link></li>
              <li><Link to="/investors" className="text-gray-300 hover:text-white transition-colors">Investors</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/careers" className="text-gray-300 hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              <li><Link to="/ride" className="text-gray-300 hover:text-white transition-colors">Ride</Link></li>
              <li><Link to="/drive" className="text-gray-300 hover:text-white transition-colors">Drive</Link></li>
              <li><Link to="/business" className="text-gray-300 hover:text-white transition-colors">Business</Link></li>
              <li><Link to="/fleet" className="text-gray-300 hover:text-white transition-colors">JoltCab Fleet</Link></li>
            </ul>
          </div>

          {/* Global Citizenship */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Global Citizenship</h3>
            <ul className="space-y-2">
              <li><Link to="/safety" className="text-gray-300 hover:text-white transition-colors">Safety</Link></li>
              <li><Link to="/diversity" className="text-gray-300 hover:text-white transition-colors">Diversity</Link></li>
              <li><Link to="/sustainability" className="text-gray-300 hover:text-white transition-colors">Sustainability</Link></li>
            </ul>
          </div>

          {/* Travel */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Travel</h3>
            <ul className="space-y-2">
              <li><Link to="/reserve" className="text-gray-300 hover:text-white transition-colors">Reserve</Link></li>
              <li><Link to="/cities" className="text-gray-300 hover:text-white transition-colors">Cities</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-2xl font-bold">JoltCab</span>
          </div>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors text-sm">
              Privacy
            </Link>
            <Link to="/accessibility" className="text-gray-300 hover:text-white transition-colors text-sm">
              Accessibility
            </Link>
            <Link to="/terms" className="text-gray-300 hover:text-white transition-colors text-sm">
              Terms
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} JoltCab Technologies Inc.
        </div>
      </div>
    </footer>
  );
}
