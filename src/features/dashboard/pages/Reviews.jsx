import { useState, useEffect } from 'react';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { StarIcon, EyeIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Button, Badge, Modal, Textarea } from '@/components/ui';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [detailModal, setDetailModal] = useState({ isOpen: false, review: null });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await adminService.getReviews();
      setReviews(data.reviews || generateMockReviews());
    } catch (error) {
      console.error('Failed to load reviews:', error);
      setReviews(generateMockReviews());
    } finally {
      setLoading(false);
    }
  };

  const generateMockReviews = () => [
    {
      _id: '1',
      user: { first_name: 'John', last_name: 'Doe' },
      provider: { first_name: 'Mike', last_name: 'Smith' },
      rating: 5,
      review_text: 'Excellent service! Very professional and punctual.',
      trip_id: 'T10001',
      created_at: '2024-10-18T10:30:00Z',
      type: 'user_to_provider',
      status: 'approved'
    },
    {
      _id: '2',
      user: { first_name: 'Sarah', last_name: 'Johnson' },
      provider: { first_name: 'David', last_name: 'Lee' },
      rating: 4,
      review_text: 'Good driver, but arrived a bit late.',
      trip_id: 'T10002',
      created_at: '2024-10-18T11:15:00Z',
      type: 'user_to_provider',
      status: 'approved'
    },
    {
      _id: '3',
      user: { first_name: 'Robert', last_name: 'Brown' },
      provider: { first_name: 'Emma', last_name: 'Wilson' },
      rating: 5,
      review_text: 'Amazing experience! Clean car and smooth ride.',
      trip_id: 'T10003',
      created_at: '2024-10-18T09:45:00Z',
      type: 'user_to_provider',
      status: 'approved'
    },
    {
      _id: '4',
      user: { first_name: 'Emily', last_name: 'Davis' },
      provider: { first_name: 'James', last_name: 'Taylor' },
      rating: 2,
      review_text: 'Driver was rude and took wrong route.',
      trip_id: 'T10004',
      created_at: '2024-10-17T08:20:00Z',
      type: 'user_to_provider',
      status: 'pending'
    },
    {
      _id: '5',
      user: { first_name: 'Michael', last_name: 'Wilson' },
      provider: { first_name: 'Lisa', last_name: 'Anderson' },
      rating: 5,
      review_text: 'Great customer! Very polite and respectful.',
      trip_id: 'T10005',
      created_at: '2024-10-17T14:00:00Z',
      type: 'provider_to_user',
      status: 'approved'
    },
    {
      _id: '6',
      user: { first_name: 'Alex', last_name: 'Chen' },
      provider: { first_name: 'Mike', last_name: 'Smith' },
      rating: 3,
      review_text: 'Average experience. Nothing special.',
      trip_id: 'T10006',
      created_at: '2024-10-16T16:30:00Z',
      type: 'user_to_provider',
      status: 'approved'
    },
  ];

  const getFilteredReviews = () => {
    let filtered = [...reviews];

    if (ratingFilter !== 'all') {
      const rating = parseInt(ratingFilter);
      filtered = filtered.filter(r => r.rating === rating);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(r => r.type === typeFilter);
    }

    return filtered;
  };

  const handleApprove = async (reviewId) => {
    try {
      await adminService.approveReview(reviewId);
      setReviews(reviews.map(r => r._id === reviewId ? { ...r, status: 'approved' } : r));
    } catch (error) {
      console.error('Failed to approve review:', error);
    }
  };

  const handleReject = async (reviewId) => {
    try {
      await adminService.rejectReview(reviewId);
      setReviews(reviews.map(r => r._id === reviewId ? { ...r, status: 'rejected' } : r));
    } catch (error) {
      console.error('Failed to reject review:', error);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <StarIconSolid key={star} className="w-4 h-4 text-yellow-400" />
          ) : (
            <StarIcon key={star} className="w-4 h-4 text-gray-300" />
          )
        ))}
      </div>
    );
  };

  const getRatingBadgeVariant = (rating) => {
    if (rating >= 4) return 'success';
    if (rating >= 3) return 'warning';
    return 'danger';
  };

  const columns = [
    {
      key: 'trip_id',
      label: 'Trip',
      sortable: true,
      render: (value) => <span className="font-mono text-sm">#{value}</span>
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (value) => (
        <Badge variant="default" size="sm">
          {value === 'user_to_provider' ? 'User → Driver' : 'Driver → User'}
        </Badge>
      )
    },
    {
      key: 'user',
      label: 'From',
      sortable: true,
      render: (value, review) => {
        const from = review.type === 'user_to_provider' ? review.user : review.provider;
        return from ? `${from.first_name} ${from.last_name}` : 'N/A';
      }
    },
    {
      key: 'provider',
      label: 'To',
      sortable: true,
      render: (value, review) => {
        const to = review.type === 'user_to_provider' ? review.provider : review.user;
        return to ? `${to.first_name} ${to.last_name}` : 'N/A';
      }
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          {renderStars(value)}
          <Badge variant={getRatingBadgeVariant(value)} size="sm">
            {value}
          </Badge>
        </div>
      )
    },
    {
      key: 'review_text',
      label: 'Comment',
      render: (value) => (
        <span className="text-sm text-gray-600 truncate max-w-xs block">
          {value || 'No comment'}
        </span>
      )
    },
    {
      key: 'created_at',
      label: 'Date',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => {
        const variants = {
          approved: 'success',
          pending: 'warning',
          rejected: 'danger'
        };
        return (
          <Badge variant={variants[value] || 'default'}>
            {value?.charAt(0).toUpperCase() + value?.slice(1) || 'N/A'}
          </Badge>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, review) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setDetailModal({ isOpen: true, review })}
          >
            <EyeIcon className="w-4 h-4" />
          </Button>
          {review.status === 'pending' && (
            <>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => handleApprove(review._id)}
              >
                <CheckCircleIcon className="w-4 h-4 text-green-600" />
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => handleReject(review._id)}
              >
                <XCircleIcon className="w-4 h-4 text-red-600" />
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reviews & Ratings</h1>
        <p className="text-gray-600 mt-1">Manage customer and driver reviews</p>
      </div>

      <DataTable
        columns={columns}
        data={getFilteredReviews()}
        pageSize={10}
        searchPlaceholder="Search by trip ID or name..."
        emptyMessage="No reviews found"
        defaultSort={{ key: 'created_at', direction: 'desc' }}
        filters={
          <>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Rating:</label>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-joltcab-400"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Type:</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-joltcab-400"
              >
                <option value="all">All Types</option>
                <option value="user_to_provider">User → Driver</option>
                <option value="provider_to_user">Driver → User</option>
              </select>
            </div>
            {(ratingFilter !== 'all' || typeFilter !== 'all') && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  setRatingFilter('all');
                  setTypeFilter('all');
                }}
              >
                Clear Filters
              </Button>
            )}
          </>
        }
      />

      <ReviewDetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, review: null })}
        review={detailModal.review}
        renderStars={renderStars}
      />
    </div>
  );
}

function ReviewDetailModal({ isOpen, onClose, review, renderStars }) {
  if (!review) return null;

  const from = review.type === 'user_to_provider' ? review.user : review.provider;
  const to = review.type === 'user_to_provider' ? review.provider : review.user;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Review Details"
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Trip ID</label>
          <p className="text-lg font-mono mt-1">#{review.trip_id}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">From</label>
            <p className="mt-1">{from ? `${from.first_name} ${from.last_name}` : 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">To</label>
            <p className="mt-1">{to ? `${to.first_name} ${to.last_name}` : 'N/A'}</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Rating</label>
          <div className="mt-1 flex items-center gap-2">
            {renderStars(review.rating)}
            <span className="font-semibold">{review.rating}/5</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Comment</label>
          <div className="mt-1 p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-700">{review.review_text || 'No comment provided'}</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Date</label>
          <p className="mt-1">{new Date(review.created_at).toLocaleString()}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Status</label>
          <div className="mt-1">
            <Badge variant={review.status === 'approved' ? 'success' : review.status === 'pending' ? 'warning' : 'danger'}>
              {review.status?.charAt(0).toUpperCase() + review.status?.slice(1) || 'N/A'}
            </Badge>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
