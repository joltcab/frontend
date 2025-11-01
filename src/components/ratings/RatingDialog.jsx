import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, ThumbsUp, MessageCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import joltcab from "@/lib/joltcab-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function RatingDialog({ isOpen, onClose, ride, userRole }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const reviewMutation = useMutation({
    mutationFn: async (data) => {
      // Create review
  await joltcab.entities.Review.create(data);

      // Update ride with rating
      const updateField = userRole === 'driver' ? 'rating_passenger' : 'rating_driver';
  await joltcab.entities.Ride.update(ride.id, {
        [updateField]: rating
      });

      // Update driver/user rating average if rating a driver
      if (userRole !== 'driver') {
  const driverProfile = await joltcab.entities.DriverProfile.filter({
          user_email: ride.driver_email 
        });
        
        if (driverProfile[0]) {
  const allReviews = await joltcab.entities.Review.filter({
            reviewee_email: ride.driver_email 
          });
          
          const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0) + rating;
          const avgRating = totalRating / (allReviews.length + 1);
          
  await joltcab.entities.DriverProfile.update(driverProfile[0].id, {
            rating: Number(avgRating.toFixed(1)),
            total_trips: (driverProfile[0].total_trips || 0) + 1
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRides'] });
      queryClient.invalidateQueries({ queryKey: ['driverRides'] });
      onClose();
      setRating(0);
      setComment("");
    },
  });

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    const reviewData = {
      ride_id: ride.id,
      reviewer_email: userRole === 'driver' ? ride.driver_email : ride.passenger_email,
      reviewee_email: userRole === 'driver' ? ride.passenger_email : ride.driver_email,
      review_type: userRole === 'driver' ? 'driver_to_passenger' : 'passenger_to_driver',
      rating: rating,
      comment: comment || undefined,
    };

    reviewMutation.mutate(reviewData);
  };

  const ratingLabels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Rate Your {userRole === 'driver' ? 'Passenger' : 'Driver'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Driver/Passenger Info */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#15B46A] to-[#0F9456] rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl text-white font-bold">
                {(userRole === 'driver' ? ride.passenger_email : ride.driver_email)?.charAt(0).toUpperCase()}
              </span>
            </div>
            <p className="font-semibold text-gray-900">
              {userRole === 'driver' ? ride.passenger_email : ride.driver_email}
            </p>
            <p className="text-sm text-gray-500">
              {ride.pickup_location?.substring(0, 30)}... → {ride.dropoff_location?.substring(0, 30)}...
            </p>
          </div>

          {/* Star Rating */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">How was your experience?</p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-12 h-12 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </motion.button>
              ))}
            </div>
            {(rating > 0 || hoveredRating > 0) && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-semibold text-[#15B46A] mt-2"
              >
                {ratingLabels[hoveredRating || rating]}
              </motion.p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Additional Comments (Optional)
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share more about your experience..."
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Quick Tags */}
          {rating >= 4 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex flex-wrap gap-2 justify-center"
            >
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" />
                Professional
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                Clean Vehicle
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                On Time
              </span>
            </motion.div>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || reviewMutation.isPending}
            className="w-full bg-gradient-to-r from-[#15B46A] to-[#0F9456] hover:from-[#0F9456] hover:to-[#15B46A] h-12 text-lg font-semibold"
          >
            {reviewMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Rating'
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Your feedback helps us improve the service
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}