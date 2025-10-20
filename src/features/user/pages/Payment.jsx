import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  Wallet,
  CreditCard,
  Plus,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Add Funds Modal Component
function AddFundsModal({ isOpen, onClose, userId, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAmountSubmit = async (e) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);

    if (!amountNum || amountNum < 5 || amountNum > 5000) {
      setError('Amount must be between $5 and $5000');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://admin.joltcab.com/api/payments/stripe/create-payment-intent', {
        amount: amountNum,
        user_id: userId
      });

      if (response.data.success) {
        setClientSecret(response.data.data.clientSecret);
      } else {
        setError(response.data.message || 'Failed to initiate payment');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating payment');
      console.error('Payment intent error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add Funds to Wallet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {!clientSecret ? (
          <form onSubmit={handleAmountSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (USD)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="5"
                  max="5000"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-joltcab-green focus:outline-none text-lg"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Minimum: $5 | Maximum: $5,000</p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-joltcab-green text-white rounded-xl font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Continue'}
              </button>
            </div>
          </form>
        ) : (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm
              amount={amount}
              onSuccess={() => {
                onSuccess();
                onClose();
              }}
              onCancel={onClose}
            />
          </Elements>
        )}
      </div>
    </div>
  );
}

// Payment Form Component
function PaymentForm({ amount, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/user/payment?success=true`,
        },
        redirect: 'if_required'
      });

      if (submitError) {
        setError(submitError.message);
        setProcessing(false);
      } else {
        alert(`✅ Successfully added $${amount} to your wallet!`);
        onSuccess();
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="mb-6">
        <PaymentElement />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 py-3 bg-joltcab-green text-white rounded-xl font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? 'Processing...' : `Pay $${amount}`}
        </button>
      </div>
    </form>
  );
}

// Main Payment Component
export default function Payment() {
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletTransactions, setWalletTransactions] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get user ID from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user._id || user.id;

  useEffect(() => {
    loadWalletData();
    loadPaymentMethods();
    loadWalletTransactions();
  }, []);

  const loadWalletData = async () => {
    try {
      const response = await axios.get(`https://admin.joltcab.com/api/wallet/balance?user_id=${userId}`);
      if (response.data.success) {
        setWalletBalance(parseFloat(response.data.data.balance));
      }
    } catch (error) {
      console.error('Error loading wallet balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const response = await axios.get(`https://admin.joltcab.com/api/payments/stripe/payment-methods/${userId}`);
      if (response.data.success) {
        setPaymentMethods(response.data.data);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  const loadWalletTransactions = async () => {
    try {
      const response = await axios.get(`https://admin.joltcab.com/api/wallet/transactions?user_id=${userId}&limit=10`);
      if (response.data.success) {
        setWalletTransactions(response.data.data);
      }
    } catch (error) {
      console.error('Error loading wallet transactions:', error);
    }
  };

  const handleDeletePaymentMethod = async (paymentMethodId) => {
    if (!confirm('Are you sure you want to remove this payment method?')) {
      return;
    }

    try {
      await axios.delete(`https://admin.joltcab.com/api/payments/stripe/payment-methods/${paymentMethodId}`);
      alert('Payment method removed successfully');
      loadPaymentMethods();
    } catch (error) {
      alert('Error removing payment method');
      console.error(error);
    }
  };

  const handleAddFundsSuccess = () => {
    loadWalletData();
    loadWalletTransactions();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-joltcab-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Payment & Wallet</h1>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-br from-joltcab-green to-green-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-8 h-8" />
              <h2 className="text-xl font-semibold">Wallet Balance</h2>
            </div>
            <p className="text-5xl font-bold mb-1">${walletBalance.toFixed(2)}</p>
            <p className="text-green-100">Available for trips</p>
          </div>
          <button
            onClick={() => setIsAddFundsOpen(true)}
            className="bg-white text-joltcab-green px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Funds
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved Payment Methods */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-600" />
            Saved Cards
          </h2>

          {paymentMethods.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No saved payment methods</p>
              <p className="text-sm">Add funds to save your first card</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((pm) => (
                <div
                  key={pm.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-joltcab-green transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">💳</div>
                    <div>
                      <div className="font-medium">
                        {pm.card.brand.charAt(0).toUpperCase() + pm.card.brand.slice(1)} •••• {pm.card.last4}
                      </div>
                      <div className="text-sm text-gray-500">
                        Expires {pm.card.exp_month}/{pm.card.exp_year}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeletePaymentMethod(pm.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Wallet Transaction History */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600" />
            Recent Transactions
          </h2>

          {walletTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No transactions yet</p>
              <p className="text-sm">Add funds to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {walletTransactions.map((tx) => (
                <div
                  key={tx._id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {tx.type === 'credit' ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{tx.description}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className={`font-bold ${
                    tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Funds Modal */}
      <AddFundsModal
        isOpen={isAddFundsOpen}
        onClose={() => setIsAddFundsOpen(false)}
        userId={userId}
        onSuccess={handleAddFundsSuccess}
      />
    </div>
  );
}
