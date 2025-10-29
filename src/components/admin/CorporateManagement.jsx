import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Search, CheckCircle, XCircle, Clock, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CorporateManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: corporateProfiles = [] } = useQuery({
    queryKey: ['corporateProfiles'],
    queryFn: () => base44.entities.CorporateProfile.list('-created_date'),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.CorporateProfile.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['corporateProfiles'] });
    },
  });

  const filteredCorporates = corporateProfiles.filter(corp => {
    const matchesSearch = corp.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         corp.user_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || corp.status === statusFilter;
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
          <h2 className="text-3xl font-bold text-gray-900">Corporate Accounts</h2>
          <p className="text-gray-600 mt-1">Manage business accounts and corporate clients</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-yellow-100 text-yellow-800">
            {corporateProfiles.filter(c => c.status === 'pending').length} Pending
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            {corporateProfiles.filter(c => c.status === 'active').length} Active
          </Badge>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search corporate accounts..."
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
        {filteredCorporates.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-semibold text-gray-900 mb-2">No corporate accounts found</p>
              <p className="text-gray-600">Corporate registrations will appear here</p>
            </CardContent>
          </Card>
        ) : (
          filteredCorporates.map(corp => {
            const user = getUserInfo(corp.user_email);
            return (
              <Card key={corp.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{corp.company_name}</h3>
                          <Badge className={getStatusColor(corp.status)}>
                            {corp.status}
                          </Badge>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600">
                          <div>
                            <p><strong>Contact:</strong> {corp.contact_name}</p>
                            <p><strong>Email:</strong> {corp.user_email}</p>
                            {corp.company_phone && <p><strong>Phone:</strong> {corp.company_phone}</p>}
                          </div>
                          <div>
                            {corp.tax_id && <p><strong>Tax ID:</strong> {corp.tax_id}</p>}
                            {corp.employee_count && (
                              <p className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <strong>{corp.employee_count}</strong> employees
                              </p>
                            )}
                          </div>
                        </div>

                        {corp.billing_address && (
                          <div className="mt-3 text-sm text-gray-600">
                            <strong>Address:</strong> {corp.billing_address}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {corp.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => updateStatusMutation.mutate({ id: corp.id, status: 'active' })}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => updateStatusMutation.mutate({ id: corp.id, status: 'suspended' })}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {corp.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => updateStatusMutation.mutate({ id: corp.id, status: 'suspended' })}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Suspend
                        </Button>
                      )}
                      {corp.status === 'suspended' && (
                        <Button
                          size="sm"
                          className="bg-[#15B46A] hover:bg-[#0F9456] text-white"
                          onClick={() => updateStatusMutation.mutate({ id: corp.id, status: 'active' })}
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