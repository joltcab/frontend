import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminService from '@/services/dashboardService';

export default function ReviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadReview();
    }
  }, [id]);

  const loadReview = async () => {
    try {
      const data = await adminService.getReview(id);
      setReview(data);
    } catch (error) {
      console.error('Failed to load review:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (confirm('Approve this review?')) {
      try {
        await adminService.approveReview(id);
        alert('Review approved successfully');
        loadReview();
      } catch (error) {
        console.error('Failed to approve review:', error);
        alert('Failed to approve review');
      }
    }
  };

  const handleReject = async () => {
    const reason = prompt('Reason for rejection:');
    if (reason) {
      try {
        await adminService.rejectReview(id, { reason });
        alert('Review rejected');
        loadReview();
      } catch (error) {
        console.error('Failed to reject review:', error);
        alert('Failed to reject review');
      }
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      try {
        await adminService.deleteReview(id);
        alert('Review deleted successfully');
        navigate('/admin/dashboard/reviews');
      } catch (error) {
        console.error('Failed to delete review:', error);
        alert('Failed to delete review');
      }
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!review) return <div className="text-center py-8">Review not found</div>;

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-6 h-6 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Review Details</h1>
        <button
          onClick={() => navigate('/admin/dashboard/reviews')}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back to List
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Review Content */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold mb-2">{review.title || 'Trip Review'}</h2>
              <div className="flex items-center space-x-2">
                {renderStars(review.rating || 0)}
                <span className="text-xl font-bold">{review.rating || 0}/5</span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              review.is_approved ? 'bg-green-100 text-green-800' :
              review.is_rejected ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {review.is_approved ? 'Approved' : review.is_rejected ? 'Rejected' : 'Pending'}
            </span>
          </div>

          <div className="border-t pt-4">
            <p className="text-gray-700 leading-relaxed">
              {review.comment || 'No comment provided'}
            </p>
          </div>

          {review.rejection_reason && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Rejection Reason:</strong> {review.rejection_reason}
              </p>
            </div>
          )}

          {!review.is_approved && !review.is_rejected && (
            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleApprove}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
              >
                Approve Review
              </button>
              <button
                onClick={handleReject}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Reject Review
              </button>
            </div>
          )}

          <div className="mt-6 border-t pt-4">
            <button
              onClick={handleDelete}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Delete Review
            </button>
          </div>
        </div>

        {/* Trip & User Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <h3 className="font-semibold mb-4">Trip Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Trip ID</p>
                <p className="font-semibold">#{review.trip_id || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500">Date</p>
                <p className="font-semibold">{review.trip_date || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500">Fare</p>
                <p className="font-semibold">${review.fare || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <h3 className="font-semibold mb-4">Customer</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-semibold">{review.customer_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-semibold text-xs">{review.customer_email || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <h3 className="font-semibold mb-4">Driver</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-semibold">{review.driver_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-semibold text-xs">{review.driver_email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500">Overall Rating</p>
                <p className="font-semibold">{review.driver_rating || 0} ⭐</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
