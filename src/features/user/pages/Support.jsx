export default function Support() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Customer Support</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                <option>Select a topic</option>
                <option>Trip Issue</option>
                <option>Payment Issue</option>
                <option>Driver Feedback</option>
                <option>Account Help</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                rows="6"
                placeholder="Describe your issue..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">FAQ</h2>
            
            <div className="space-y-3">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">How do I cancel a ride?</span>
                  <span className="transition group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-3 px-3 text-gray-600">
                  You can cancel a ride from the "My Trips" page within 5 minutes of booking without any charges.
                </p>
              </details>

              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">How do I add a payment method?</span>
                  <span className="transition group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-3 px-3 text-gray-600">
                  Go to Payment Methods and click "Add New Card" to securely add a credit or debit card.
                </p>
              </details>

              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">What if I left something in the car?</span>
                  <span className="transition group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-3 px-3 text-gray-600">
                  Contact us immediately with your trip details, and we'll help you connect with your driver.
                </p>
              </details>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Contact</h2>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">📞</span>
                <div>
                  <div className="font-medium">Phone</div>
                  <div className="text-sm text-gray-600">+1 (800) 123-4567</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">✉️</span>
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-gray-600">support@joltcab.com</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">💬</span>
                <div>
                  <div className="font-medium">Live Chat</div>
                  <div className="text-sm text-gray-600">Available 24/7</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
