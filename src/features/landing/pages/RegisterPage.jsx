import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '@/services/authService';

const USER_TYPES = [
  { id: 'user', label: 'Ride with us', description: 'Request rides as a passenger' },
  { id: 'driver', label: 'Drive with us', description: 'Earn money as a driver' },
  { id: 'partner', label: 'Fleet Partner', description: 'Manage your fleet' },
  { id: 'corporate', label: 'Corporate', description: 'Business account' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Select type, 2: Fill details
  const [selectedType, setSelectedType] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({
        ...formData,
        userType: selectedType,
      });
      
      if (response.success) {
        // Redirigir según el tipo seleccionado
        if (selectedType === 'user' || selectedType === 'customer') {
          navigate('/user');
        } else if (selectedType === 'driver') {
          navigate('/driver');
        } else if (selectedType === 'partner') {
          navigate('/partner');
        } else if (selectedType === 'corporate') {
          navigate('/corporate');
        } else {
          navigate('/user'); // Fallback
        }
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="text-3xl font-bold">JoltCab</span>
          </Link>
        </div>

        {step === 1 ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Join JoltCab</h2>
            <p className="text-gray-600 text-center mb-8">Select how you want to use JoltCab</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {USER_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeSelect(type.id)}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-black transition-colors text-left"
                >
                  <h3 className="text-lg font-semibold mb-2">{type.label}</h3>
                  <p className="text-gray-600 text-sm">{type.description}</p>
                </button>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-black font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <button
              onClick={() => setStep(1)}
              className="text-gray-600 hover:text-black mb-4 flex items-center"
            >
              ← Back
            </button>

            <h2 className="text-2xl font-bold mb-6">
              Create your {USER_TYPES.find(t => t.id === selectedType)?.label} account
            </h2>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  minLength="6"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field"
                  minLength="6"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
