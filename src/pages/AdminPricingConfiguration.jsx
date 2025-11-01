
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign, Plus, Edit, Trash2, Search, Clock, Users,
  Zap, Building2, Car, TrendingUp, Percent, AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";


export default function AdminPricingConfiguration() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [formData, setFormData] = useState({
    service_type_id: "",
    country_id: "",
    city_id: "",
    max_space: 4,
    provider_profit: 85,
    min_fare: 1.75,
    distance_for_base_price: 0,
    base_price: 6,
    price_per_unit_distance: 1.75,
    price_per_unit_time: 0.25,
    waiting_time_start_after_minute: 5,
    price_for_waiting_time: 0.005,
    car_rental_business: false,
    cancellation_fee: 4.5,
    tax: 0,
    user_miscellaneous_fee: 0,
    user_tax: 0,
    provider_miscellaneous_fee: 0,
    provider_tax: 0,
    is_zone: false,
    is_surge_hours: false,
    surge_multiplier: 1,
    surge_times: [],
    rich_area_surge: [],
    business_status: true
  });

  const queryClient = useQueryClient();

  // Fetch data
  const { data: priceConfigs = [], isLoading } = useQuery({
    queryKey: ['price-configurations'],
    queryFn: () => base44.entities.PriceConfiguration.list()
  });

  const { data: serviceTypes = [] } = useQuery({
    queryKey: ['service-types'],
    queryFn: () => base44.entities.ServiceType.list()
  });

  const { data: countries = [] } = useQuery({
    queryKey: ['countries'],
    queryFn: () => base44.countries.list()
  });

  const { data: cities = [] } = useQuery({
    queryKey: ['cities'],
    queryFn: () => base44.entities.City.list()
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editingConfig) {
        return await base44.entities.PriceConfiguration.update(editingConfig.id, data);
      }
      return await base44.entities.PriceConfiguration.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['price-configurations']);
      alert(editingConfig ? 'Pricing updated successfully!' : 'Pricing created successfully!');
      handleCloseDialog();
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.PriceConfiguration.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['price-configurations']);
      alert('Pricing configuration deleted successfully!');
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    }
  });

  const handleOpenDialog = (config = null) => {
    if (config) {
      setEditingConfig(config);
      setFormData(config);
    } else {
      setEditingConfig(null);
      setFormData({
        service_type_id: "",
        country_id: "",
        city_id: "",
        max_space: 4,
        provider_profit: 85,
        min_fare: 1.75,
        distance_for_base_price: 0,
        base_price: 6,
        price_per_unit_distance: 1.75,
        price_per_unit_time: 0.25,
        waiting_time_start_after_minute: 5,
        price_for_waiting_time: 0.005,
        car_rental_business: false,
        cancellation_fee: 4.5,
        tax: 0,
        user_miscellaneous_fee: 0,
        user_tax: 0,
        provider_miscellaneous_fee: 0,
        provider_tax: 0,
        is_zone: false,
        is_surge_hours: false,
        surge_multiplier: 1,
        surge_times: [],
        rich_area_surge: [],
        business_status: true
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingConfig(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this pricing configuration?')) {
      deleteMutation.mutate(id);
    }
  };

  const addSurgeTime = () => {
    setFormData({
      ...formData,
      surge_times: [
        ...formData.surge_times,
        { day: 'Mon', start_time: '08:00', end_time: '10:00', multiplier: 1.5 }
      ]
    });
  };

  const removeSurgeTime = (index) => {
    const newSurgeTimes = formData.surge_times.filter((_, i) => i !== index);
    setFormData({ ...formData, surge_times: newSurgeTimes });
  };

  const updateSurgeTime = (index, field, value) => {
    const newSurgeTimes = [...formData.surge_times];
    newSurgeTimes[index][field] = value;
    setFormData({ ...formData, surge_times: newSurgeTimes });
  };

  // Filter configs
  const filteredConfigs = priceConfigs.filter(config => {
    const serviceType = serviceTypes.find(s => s.id === config.service_type_id);
    const city = cities.find(c => c.id === config.city_id);
    
    return (
      serviceType?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pricing Configuration</h1>
          <p className="text-gray-600 mt-1">Manage pricing for services across cities</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-[#15B46A]">
          <Plus className="w-4 h-4 mr-2" />
          Add Pricing Config
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by service type or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Pricing Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#15B46A]" />
            Pricing Configurations ({filteredConfigs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-[#15B46A] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading configurations...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Type</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Base Price</TableHead>
                    <TableHead>Per KM</TableHead>
                    <TableHead>Per Min</TableHead>
                    <TableHead>Min Fare</TableHead>
                    <TableHead>Provider %</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConfigs.map((config) => {
                    const serviceType = serviceTypes.find(s => s.id === config.service_type_id);
                    const city = cities.find(c => c.id === config.city_id);
                    const country = countries.find(co => co.id === config.country_id);
                    
                    return (
                      <motion.tr
                        key={config.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{serviceType?.name || 'N/A'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="font-medium">{city?.name || 'N/A'}</div>
                              <div className="text-xs text-gray-500">{country?.name || ''}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">${config.base_price}</Badge>
                        </TableCell>
                        <TableCell>${config.price_per_unit_distance}/km</TableCell>
                        <TableCell>${config.price_per_unit_time}/min</TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800">
                            ${config.min_fare}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            <Percent className="w-3 h-3 mr-1" />
                            {config.provider_profit}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {config.is_surge_hours && (
                              <Badge className="text-xs bg-orange-100 text-orange-800">
                                <Zap className="w-3 h-3 mr-1" />
                                Surge
                              </Badge>
                            )}
                            {config.is_zone && (
                              <Badge className="text-xs bg-purple-100 text-purple-800">
                                Zone
                              </Badge>
                            )}
                            {config.car_rental_business && (
                              <Badge className="text-xs bg-green-100 text-green-800">
                                Rental
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {config.business_status ? (
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          ) : (
                            <Badge variant="destructive">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(config)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(config.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>

              {filteredConfigs.length === 0 && (
                <div className="text-center py-12">
                  <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No pricing configurations found</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingConfig ? 'Edit Pricing Configuration' : 'Add New Pricing Configuration'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="fees">Fees & Tax</TabsTrigger>
                <TabsTrigger value="surge">Surge Hours</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              {/* Basic Tab */}
              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Service Type *</Label>
                    <Select
                      value={formData.service_type_id}
                      onValueChange={(value) => setFormData({...formData, service_type_id: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map(type => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Country *</Label>
                    <Select
                      value={formData.country_id}
                      onValueChange={(value) => setFormData({...formData, country_id: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={String(country.id || country._id)} value={String(country.id || country._id)}>
                            {country.name || country.countryname || 'Unnamed Country'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>City *</Label>
                    <Select
                      value={formData.city_id}
                      onValueChange={(value) => setFormData({...formData, city_id: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.filter(c => c.country_id === formData.country_id).map(city => (
                          <SelectItem key={city.id} value={city.id}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Max Passengers</Label>
                    <Input
                      type="number"
                      value={formData.max_space}
                      onChange={(e) => setFormData({...formData, max_space: Number(e.target.value)})}
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Provider Profit Percentage</Label>
                  <Input
                    type="number"
                    value={formData.provider_profit}
                    onChange={(e) => setFormData({...formData, provider_profit: Number(e.target.value)})}
                    min="0"
                    max="100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Provider gets {formData.provider_profit}%, Platform gets {100 - formData.provider_profit}%
                  </p>
                </div>
              </TabsContent>

              {/* Pricing Tab */}
              <TabsContent value="pricing" className="space-y-4 mt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Base Price ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.base_price}
                      onChange={(e) => setFormData({...formData, base_price: Number(e.target.value)})}
                    />
                  </div>

                  <div>
                    <Label>Distance for Base (km)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.distance_for_base_price}
                      onChange={(e) => setFormData({...formData, distance_for_base_price: Number(e.target.value)})}
                    />
                  </div>

                  <div>
                    <Label>Minimum Fare ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.min_fare}
                      onChange={(e) => setFormData({...formData, min_fare: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price per KM ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price_per_unit_distance}
                      onChange={(e) => setFormData({...formData, price_per_unit_distance: Number(e.target.value)})}
                    />
                  </div>

                  <div>
                    <Label>Price per Minute ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price_per_unit_time}
                      onChange={(e) => setFormData({...formData, price_per_unit_time: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Waiting Time Starts After (min)</Label>
                    <Input
                      type="number"
                      value={formData.waiting_time_start_after_minute}
                      onChange={(e) => setFormData({...formData, waiting_time_start_after_minute: Number(e.target.value)})}
                    />
                  </div>

                  <div>
                    <Label>Price for Waiting Time ($/min)</Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.price_for_waiting_time}
                      onChange={(e) => setFormData({...formData, price_for_waiting_time: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <Label>Cancellation Fee ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.cancellation_fee}
                    onChange={(e) => setFormData({...formData, cancellation_fee: Number(e.target.value)})}
                  />
                </div>
              </TabsContent>

              {/* Fees & Tax Tab */}
              <TabsContent value="fees" className="space-y-4 mt-4">
                <h3 className="font-semibold">User Fees</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>User Tax (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.user_tax}
                      onChange={(e) => setFormData({...formData, user_tax: Number(e.target.value)})}
                    />
                  </div>

                  <div>
                    <Label>User Miscellaneous Fee ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.user_miscellaneous_fee}
                      onChange={(e) => setFormData({...formData, user_miscellaneous_fee: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <h3 className="font-semibold pt-4">Provider Fees</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Provider Tax (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.provider_tax}
                      onChange={(e) => setFormData({...formData, provider_tax: Number(e.target.value)})}
                    />
                  </div>

                  <div>
                    <Label>Provider Miscellaneous Fee ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.provider_miscellaneous_fee}
                      onChange={(e) => setFormData({...formData, provider_miscellaneous_fee: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <Label>System Tax (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.tax}
                      onChange={(e) => setFormData({...formData, tax: Number(e.target.value)})}
                    />
                    <p className="text-xs text-gray-500 mt-1">General platform tax</p>
                  </div>
                </div>
              </TabsContent>

              {/* Surge Hours Tab */}
              <TabsContent value="surge" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Surge Pricing</Label>
                    <p className="text-sm text-gray-500">Increase prices during peak hours</p>
                  </div>
                  <Switch
                    checked={formData.is_surge_hours}
                    onCheckedChange={(checked) => setFormData({...formData, is_surge_hours: checked})}
                  />
                </div>

                {formData.is_surge_hours && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Surge Time Slots</h3>
                      <Button type="button" onClick={addSurgeTime} size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Slot
                      </Button>
                    </div>

                    {formData.surge_times.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed rounded-lg">
                        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">No surge time slots configured</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {formData.surge_times.map((slot, index) => (
                          <Card key={index}>
                            <CardContent className="pt-4">
                              <div className="grid grid-cols-4 gap-3">
                                <Select
                                  value={slot.day}
                                  onValueChange={(value) => updateSurgeTime(index, 'day', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {daysOfWeek.map(day => (
                                      <SelectItem key={day} value={day}>{day}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                <Input
                                  type="time"
                                  value={slot.start_time}
                                  onChange={(e) => updateSurgeTime(index, 'start_time', e.target.value)}
                                />

                                <Input
                                  type="time"
                                  value={slot.end_time}
                                  onChange={(e) => updateSurgeTime(index, 'end_time', e.target.value)}
                                />

                                <div className="flex gap-2">
                                  <Input
                                    type="number"
                                    step="0.1"
                                    value={slot.multiplier}
                                    onChange={(e) => updateSurgeTime(index, 'multiplier', Number(e.target.value))}
                                    placeholder="1.5x"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeSurgeTime(index)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Zone-Based Pricing</Label>
                      <p className="text-sm text-gray-500">Fixed prices between zones</p>
                    </div>
                    <Switch
                      checked={formData.is_zone}
                      onCheckedChange={(checked) => setFormData({...formData, is_zone: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Car Rental Business</Label>
                      <p className="text-sm text-gray-500">Enable hourly/daily rentals</p>
                    </div>
                    <Switch
                      checked={formData.car_rental_business}
                      onCheckedChange={(checked) => setFormData({...formData, car_rental_business: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <Label>Business Status</Label>
                      <p className="text-sm text-gray-500">Enable this pricing configuration</p>
                    </div>
                    <Switch
                      checked={formData.business_status}
                      onCheckedChange={(checked) => setFormData({...formData, business_status: checked})}
                    />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-900">Important Notes</h4>
                      <ul className="text-sm text-amber-800 mt-2 space-y-1 list-disc list-inside">
                        <li>Base price includes distance_for_base_price km</li>
                        <li>Provider profit % determines driver earnings</li>
                        <li>Surge multiplier applies to entire fare</li>
                        <li>Zone pricing overrides distance/time calculation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#15B46A]" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : editingConfig ? 'Update Configuration' : 'Create Configuration'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
