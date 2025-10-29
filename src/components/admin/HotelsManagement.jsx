import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Hotel, Search, CheckCircle, XCircle, Star, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function HotelsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: hotelProfiles = [] } = useQuery({
    queryKey: ['hotelProfiles'],
    queryFn: () => base44.entities.HotelProfile.list('-created_date'),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.HotelProfile.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotelProfiles'] });
    },
  });

  const filteredHotels = hotelProfiles.filter(hotel => {
    const matchesSearch = hotel.hotel_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel.user_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || hotel.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getUserInfo = (email) => users.find(u => u.email === email);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Hotel Partners</h2>
          <p className="text-gray-600 mt-1">Manage hotel partnerships and accounts</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-yellow-100 text-yellow-800">
            {hotelProfiles.filter(h => h.status === 'pending').length} Pending
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            {hotelProfiles.filter(h => h.status === 'active').length} Active
          </Badge>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search hotels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredHotels.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Hotel className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-semibold text-gray-900 mb-2">No hotel partners found</p>
              <p className="text-gray-600">Hotel registrations will appear here</p>
            </CardContent>
          </Card>
        ) : (
          filteredHotels.map(hotel => {
            const user = getUserInfo(hotel.user_email);
            return (
              <Card key={hotel.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Hotel className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{hotel.hotel_name}</h3>
                          <Badge className={getStatusColor(hotel.status)}>
                            {hotel.status}
                          </Badge>
                          {hotel.star_rating && (
                            <div className="flex items-center gap-1 text-yellow-500">
                              {[...Array(hotel.star_rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current" />
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600">
                          <div>
                            <p><strong>Contact:</strong> {hotel.contact_name}</p>
                            <p><strong>Email:</strong> {hotel.user_email}</p>
                            {hotel.hotel_phone && <p><strong>Phone:</strong> {hotel.hotel_phone}</p>}
                          </div>
                          <div>
                            {hotel.commission_rate && (
                              <p><strong>Commission:</strong> {hotel.commission_rate}%</p>
                            )}
                            {hotel.address && (
                              <p className="flex items-start gap-1">
                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>{hotel.address}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {hotel.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => updateStatusMutation.mutate({ id: hotel.id, status: 'active' })}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => updateStatusMutation.mutate({ id: hotel.id, status: 'suspended' })}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {hotel.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => updateStatusMutation.mutate({ id: hotel.id, status: 'suspended' })}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Suspend
                        </Button>
                      )}
                      {hotel.status === 'suspended' && (
                        <Button
                          size="sm"
                          className="bg-[#15B46A] hover:bg-[#0F9456] text-white"
                          onClick={() => updateStatusMutation.mutate({ id: hotel.id, status: 'active' })}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Reactivate
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}