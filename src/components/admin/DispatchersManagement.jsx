
import { joltcab } from "@/lib/joltcab-api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Clock, Edit, Plus, Radio, Search, Trash2, XCircle } from "lucide-react";
import { useState } from "react";

export default function DispatchersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingDispatcher, setEditingDispatcher] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    country: "",
    phone: "",
  });

  const queryClient = useQueryClient();

  const { data: dispatchers = [] } = useQuery({
    queryKey: ['dispatcherProfiles'],
    queryFn: () => joltcab.entities.DispatcherProfile.list('-created_date'),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => joltcab.entities.User.list(),
  });

  const { data: countries = [] } = useQuery({
    queryKey: ['countries'],
    queryFn: () => joltcab.entities.Country.list(),
  });

  // Create/Update dispatcher mutation
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      console.log('💾 [Dispatcher] Saving:', data);
      
      // Validación en frontend
      if (!data.first_name || !data.last_name) {
        throw new Error('First name and last name are required');
      }

      if (!data.email || !data.email.includes('@')) {
        throw new Error('Valid email is required');
      }

      if (!editingDispatcher && (!data.password || data.password.length < 6)) {
        throw new Error('Password must be at least 6 characters');
      }

      if (!data.country) {
        throw new Error('Country is required');
      }

      if (!data.phone) {
        throw new Error('Phone number is required');
      }

      const response = await joltcab.functions.invoke('registerDispatcher', {
        full_name: `${data.first_name} ${data.last_name}`,
        email: data.email,
        password: data.password,
        phone: data.phone,
        dispatcher_name: `${data.first_name} ${data.last_name}`,
        country: data.country,
        city: '',
      });

      console.log('📡 [Dispatcher] Full Response:', response);
      console.log('📡 [Dispatcher] Response Data:', response.data);
      console.log('📡 [Dispatcher] Response Status:', response.status);

      if (!response.data?.success) {
        const errorMsg = response.data?.error || 'Failed to save dispatcher';
        console.error('❌ [Dispatcher] Server Error:', errorMsg);
        throw new Error(errorMsg);
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispatcherProfiles'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      setMessage({ type: 'success', text: '✓ Dispatcher saved successfully!' });
      
      setTimeout(() => {
        setShowAddDialog(false);
        setEditingDispatcher(null);
        resetForm();
        setMessage({ type: '', text: '' });
      }, 2000);
    },
    onError: (error) => {
      console.error('❌ [Dispatcher] Full Error Object:', error);
      console.error('❌ [Dispatcher] Error Message:', error.message);
      console.error('❌ [Dispatcher] Error Response:', error.response);
      
      let errorMessage = error.message;
      
      // Si hay más información en el response
      if (error.response?.data) {
        console.error('❌ [Dispatcher] Error Response Data:', error.response.data);
        errorMessage = error.response.data.error || error.response.data.message || errorMessage;
      }
      
      setMessage({ type: 'error', text: `❌ ${errorMessage}` });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => joltcab.entities.DispatcherProfile.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispatcherProfiles'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => joltcab.entities.DispatcherProfile.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispatcherProfiles'] });
    },
  });

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      country: "",
      phone: "",
    });
  };

  const handleEdit = (dispatcher) => {
    const user = getUserInfo(dispatcher.user_email);
    setEditingDispatcher(dispatcher);
    setFormData({
      first_name: user?.full_name?.split(' ')[0] || '',
      last_name: user?.full_name?.split(' ').slice(1).join(' ') || '',
      email: dispatcher.user_email,
      password: '', // No mostrar password
      country: user?.country || '',
      phone: user?.phone || '',
    });
    setShowAddDialog(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Client-side validations are now handled in the mutationFn itself.
    // The previous validation logic here is effectively redundant or could be
    // removed if the mutationFn is the single source of truth for validation.
    // For consistency with the change request, the logic will reside in mutationFn.
    saveMutation.mutate(formData);
  };

  const filteredDispatchers = dispatchers.filter(dispatcher => {
    const matchesSearch = dispatcher.dispatcher_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dispatcher.user_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || dispatcher.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getUserInfo = (email) => {
    return users.find(u => u.email === email);
  };

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
          <h2 className="text-3xl font-bold text-gray-900">Dispatchers Management</h2>
          <p className="text-gray-600 mt-1">Manage dispatcher accounts and their activity</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-yellow-100 text-yellow-800">
            {dispatchers.filter(d => d.status === 'pending').length} Pending
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            {dispatchers.filter(d => d.status === 'active').length} Active
          </Badge>
          
          {/* Add Dispatcher Button */}
          <Dialog open={showAddDialog} onOpenChange={(open) => {
            setShowAddDialog(open);
            if (!open) {
              setEditingDispatcher(null);
              resetForm();
              setMessage({ type: '', text: '' });
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-[#15B46A] hover:bg-[#0F9456] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Dispatcher
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {editingDispatcher ? 'Edit Dispatcher' : 'Add Dispatcher'}
                </DialogTitle>
              </DialogHeader>

              {/* Message */}
              {message.text && (
                <Alert className={`${message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                    {message.text}
                  </AlertDescription>
                </Alert>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="first_name">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    placeholder="Enter first name"
                    required
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="last_name">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    placeholder="Enter last name"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter email address"
                    disabled={!!editingDispatcher}
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password {!editingDispatcher && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder={editingDispatcher ? "Leave blank to keep current" : "Minimum 6 characters"}
                    required={!editingDispatcher}
                    minLength={6}
                  />
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <Label htmlFor="country">
                    Country <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => setFormData({...formData, country: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={String(country.id || country._id)} value={country.name || country.countryname}>
                          {country.country_code} {country.name || country.countryname || 'Unnamed Country'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setFormData({...formData, phone: value});
                    }}
                    placeholder="Enter phone number"
                    maxLength={15}
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddDialog(false);
                      setEditingDispatcher(null);
                      resetForm();
                      setMessage({ type: '', text: '' });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saveMutation.isPending}
                    className="bg-[#15B46A] hover:bg-[#0F9456]"
                  >
                    {saveMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </div>
                    ) : (
                      'Submit'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search dispatchers..."
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

      {/* Dispatchers List */}
      <Card>
        <CardContent className="p-6">
          {filteredDispatchers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Radio className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-semibold mb-2">No dispatchers found</p>
              <p className="text-sm">Click &ldquo;Add Dispatcher&rdquo; to create one</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDispatchers.map((dispatcher) => {
                const user = getUserInfo(dispatcher.user_email);
                return (
                  <div
                    key={dispatcher.id}
                    className="border border-gray-200 rounded-xl p-5 hover:border-[#15B46A] hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                          <Radio className="w-8 h-8" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{dispatcher.dispatcher_name}</h3>
                            <Badge className={getStatusColor(dispatcher.status)}>
                              {dispatcher.status}
                            </Badge>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600">
                            <div>
                              <p className="font-semibold text-gray-700">Contact Information</p>
                              <p>📧 {dispatcher.user_email}</p>
                              {user?.phone && <p>📞 {user.phone}</p>}
                            </div>
                            
                            <div>
                              <p className="font-semibold text-gray-700">Performance</p>
                              <p>🚗 {dispatcher.total_dispatched || 0} rides dispatched</p>
                              <p>💰 Commission: {dispatcher.commission_rate}%</p>
                            </div>
                          </div>

                          {dispatcher.coverage_cities && dispatcher.coverage_cities.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-semibold text-gray-700 mb-1">Coverage Cities:</p>
                              <div className="flex flex-wrap gap-2">
                                {dispatcher.coverage_cities.map((city, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    📍 {city}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(dispatcher)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        {dispatcher.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => updateStatusMutation.mutate({ id: dispatcher.id, status: 'active' })}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => updateStatusMutation.mutate({ id: dispatcher.id, status: 'suspended' })}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        
                        {dispatcher.status === 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-orange-600 border-orange-200 hover:bg-orange-50"
                            onClick={() => updateStatusMutation.mutate({ id: dispatcher.id, status: 'suspended' })}
                          >
                            <Clock className="w-4 h-4" />
                          </Button>
                        )}
                        
                        {dispatcher.status === 'suspended' && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => updateStatusMutation.mutate({ id: dispatcher.id, status: 'active' })}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => {
                            if (confirm(`Delete dispatcher ${dispatcher.dispatcher_name}?`)) {
                              deleteMutation.mutate(dispatcher.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                      Registered: {new Date(dispatcher.created_date).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
