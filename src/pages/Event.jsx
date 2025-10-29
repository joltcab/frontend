import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, MapPin, Users, DollarSign, Clock, Share2, 
  ArrowLeft, ExternalLink, Loader2, CheckCircle, Facebook, Twitter, Linkedin
} from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";
import moment from "moment";

export default function Event() {
  const [slug, setSlug] = useState(null);
  const [registered, setRegistered] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setSlug(urlParams.get('slug'));
  }, []);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events', slug],
    queryFn: () => base44.entities.Event.filter({ status: 'published' }),
    enabled: !!slug,
  });

  const event = events.find(e => e.slug === slug);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.list(),
  });

  const registerMutation = useMutation({
    mutationFn: () => base44.entities.Event.update(event.id, {
      current_attendees: (event.current_attendees || 0) + 1
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setRegistered(true);
    },
  });

  const handleRegister = () => {
    if (event.registration_url) {
      window.open(event.registration_url, '_blank');
    } else {
      registerMutation.mutate();
    }
  };

  const shareEvent = (platform) => {
    const url = window.location.href;
    const text = event.title;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  if (isLoading || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const category = categories.find(c => c.id === event.category_id);
  const eventDate = moment(event.event_date);
  const endDate = event.end_date ? moment(event.end_date) : eventDate;
  const isSoldOut = event.max_attendees && event.current_attendees >= event.max_attendees;
  const isPast = moment().isAfter(endDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 mb-6"
              onClick={() => window.location.href = createPageUrl('Events')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>

            {category && (
              <Badge className="bg-white text-purple-600 mb-4">
                {category.icon} {category.name}
              </Badge>
            )}

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {event.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {eventDate.format('MMMM DD, YYYY • h:mm A')}
              </div>
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {event.location}
                </div>
              )}
              {event.max_attendees && (
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {event.current_attendees || 0} / {event.max_attendees}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Image */}
        {event.featured_image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <img
              src={event.featured_image}
              alt={event.title}
              className="w-full h-[400px] object-cover rounded-2xl shadow-2xl"
            />
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg mb-8">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Event</h2>
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </CardContent>
            </Card>

            {/* Map */}
            {event.location_lat && event.location_lng && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    Location
                  </h3>
                  <p className="text-gray-700 mb-4">{event.location}</p>
                  <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Map would be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Registration Card */}
            <Card className="border-0 shadow-lg sticky top-8">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                    <span className="text-3xl font-bold text-gray-900">
                      {event.ticket_price === 0 ? 'Free' : `$${event.ticket_price}`}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">per ticket</p>
                </div>

                {registered ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold text-green-900">You're Registered!</p>
                    <p className="text-sm text-green-700 mt-1">See you at the event</p>
                  </div>
                ) : (
                  <Button
                    onClick={handleRegister}
                    disabled={isSoldOut || isPast}
                    className="w-full h-12 text-lg bg-purple-600 hover:bg-purple-700 mb-4"
                  >
                    {isSoldOut ? 'Event Full' : isPast ? 'Event Ended' : event.registration_url ? 'Register Now' : 'Register'}
                    {event.registration_url && <ExternalLink className="w-4 h-4 ml-2" />}
                  </Button>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">{eventDate.format('MMMM DD, YYYY')}</p>
                      <p className="text-gray-600">{eventDate.format('h:mm A')} - {endDate.format('h:mm A')}</p>
                    </div>
                  </div>

                  {event.location && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">{event.location}</p>
                    </div>
                  )}

                  {event.max_attendees && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-gray-900">Attendees</span>
                      </div>
                      <span className="text-gray-700">
                        {event.current_attendees || 0} / {event.max_attendees}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Share Card */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-purple-600" />
                  Share Event
                </h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => shareEvent('facebook')}
                    className="w-full justify-start bg-[#1877F2] hover:bg-[#1877F2]/90"
                  >
                    <Facebook className="w-5 h-5 mr-2" />
                    Facebook
                  </Button>
                  <Button
                    onClick={() => shareEvent('twitter')}
                    className="w-full justify-start bg-[#1DA1F2] hover:bg-[#1DA1F2]/90"
                  >
                    <Twitter className="w-5 h-5 mr-2" />
                    Twitter
                  </Button>
                  <Button
                    onClick={() => shareEvent('linkedin')}
                    className="w-full justify-start bg-[#0A66C2] hover:bg-[#0A66C2]/90"
                  >
                    <Linkedin className="w-5 h-5 mr-2" />
                    LinkedIn
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Organizer Info */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 text-gray-900">Organized By</h3>
                <p className="text-gray-700">{event.organizer_email}</p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}