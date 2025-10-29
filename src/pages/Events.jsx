import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, DollarSign, Search, Loader2, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";
import moment from "moment";

export default function Events() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [timeFilter, setTimeFilter] = useState("upcoming");

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.filter({ status: 'published' }, 'event_date'),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.filter({ type: 'event' }),
  });

  const now = moment();

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || event.category_id === selectedCategory;
    
    const eventDate = moment(event.event_date);
    let matchesTime = true;
    
    if (timeFilter === "upcoming") {
      matchesTime = eventDate.isAfter(now);
    } else if (timeFilter === "past") {
      matchesTime = eventDate.isBefore(now);
    } else if (timeFilter === "today") {
      matchesTime = eventDate.isSame(now, 'day');
    }
    
    return matchesSearch && matchesCategory && matchesTime;
  });

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? `${category.icon} ${category.name}` : '';
  };

  const getEventStatus = (event) => {
    const eventDate = moment(event.event_date);
    const endDate = event.end_date ? moment(event.end_date) : eventDate;
    
    if (now.isAfter(endDate)) return { label: 'Past', color: 'bg-gray-500' };
    if (now.isBetween(eventDate, endDate)) return { label: 'Happening Now', color: 'bg-red-500' };
    if (eventDate.diff(now, 'days') <= 7) return { label: 'This Week', color: 'bg-orange-500' };
    return { label: 'Upcoming', color: 'bg-green-500' };
  };

  const isSoldOut = (event) => {
    return event.max_attendees && event.current_attendees >= event.max_attendees;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#15B46A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Upcoming Events</h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join us for exciting events, meetups, and community gatherings
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search events..."
                  className="pl-12 h-14 text-lg bg-white/95 backdrop-blur-sm border-0 focus:ring-2 focus:ring-white"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Time Filter */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  When
                </h3>
                <div className="space-y-2">
                  {['upcoming', 'today', 'past'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setTimeFilter(filter)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all capitalize ${
                        timeFilter === filter
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {filter.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 text-gray-900">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedCategory === "all"
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    📚 All Categories
                  </button>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        selectedCategory === category.id
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category.icon} {category.name}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Events Grid */}
          <div className="lg:col-span-3">
            {filteredEvents.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                    <Calendar className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
                  <p className="text-gray-600">Try adjusting your search or filters</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredEvents.map((event, index) => {
                  const status = getEventStatus(event);
                  const soldOut = isSoldOut(event);
                  
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card 
                        className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
                        onClick={() => window.location.href = createPageUrl(`Event?slug=${event.slug}`)}
                      >
                        <div className="grid md:grid-cols-3 gap-6">
                          {/* Image */}
                          {event.featured_image && (
                            <div className="relative h-64 md:h-full overflow-hidden">
                              <img
                                src={event.featured_image}
                                alt={event.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute top-4 left-4 flex flex-col gap-2">
                                <Badge className={`${status.color} text-white shadow-lg`}>
                                  {status.label}
                                </Badge>
                                {soldOut && (
                                  <Badge className="bg-red-600 text-white shadow-lg">
                                    Sold Out
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Content */}
                          <CardContent className={`p-6 ${event.featured_image ? 'md:col-span-2' : 'md:col-span-3'}`}>
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <Badge className="bg-purple-100 text-purple-700 mb-3">
                                  {getCategoryName(event.category_id)}
                                </Badge>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                                  {event.title}
                                </h3>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center gap-2 text-gray-700">
                                <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                <div>
                                  <p className="font-semibold">
                                    {moment(event.event_date).format('MMM DD, YYYY')}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {moment(event.event_date).format('h:mm A')}
                                  </p>
                                </div>
                              </div>

                              {event.location && (
                                <div className="flex items-center gap-2 text-gray-700">
                                  <MapPin className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                  <p className="text-sm">{event.location}</p>
                                </div>
                              )}

                              {event.max_attendees && (
                                <div className="flex items-center gap-2 text-gray-700">
                                  <Users className="w-5 h-5 text-purple-600" />
                                  <p className="text-sm">
                                    {event.current_attendees || 0} / {event.max_attendees} attendees
                                  </p>
                                </div>
                              )}

                              <div className="flex items-center gap-2 text-gray-700">
                                <DollarSign className="w-5 h-5 text-purple-600" />
                                <p className="font-semibold">
                                  {event.ticket_price === 0 ? 'Free' : `$${event.ticket_price}`}
                                </p>
                              </div>
                            </div>

                            <p className="text-gray-600 line-clamp-2 mb-4">
                              {event.description?.replace(/<[^>]*>/g, '').substring(0, 150)}...
                            </p>

                            <Button
                              variant="outline"
                              className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                              disabled={soldOut}
                            >
                              {soldOut ? 'Event Full' : 'View Details'}
                            </Button>
                          </CardContent>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}