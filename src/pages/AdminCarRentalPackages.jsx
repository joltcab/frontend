
import React, { useState } from "react";
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
import {
  Car, Plus, Edit, Trash2, Search, Clock, 
  Navigation, DollarSign, Building2, CheckCircle, XCircle
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminCarRentalPackages() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [formData, setFormData] = useState({
    price_configuration_id: "",
    package_name: "",
    distance_for_base_price: 0,
    time_for_base_price: 0,
    base_price: 0,
    price_per_unit_distance: 0,
    price_per_unit_time: 0,
    business_status: true
  });

  const queryClient = useQueryClient();

  // Fetch data
  const { data: packages = [], isLoading } = useQuery({
    queryKey: ['car-rental-packages'],
    queryFn: () => base44.entities.CarRentalPackage.list()
  });

  const { data: priceConfigs = [] } = useQuery({
    queryKey: ['price-configurations'],
    queryFn: () => base44.entities.PriceConfiguration.list()
  });

  const { data: cities = [] } = useQuery({
    queryKey: ['cities'],
    queryFn: () => base44.entities.City.list()
  });

  const { data: serviceTypes = [] } = useQuery({
    queryKey: ['service-types'],
    queryFn: () => base44.entities.ServiceType.list()
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editingPackage) {
        return await base44.entities.CarRentalPackage.update(editingPackage.id, data);
      }
      return await base44.entities.CarRentalPackage.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['car-rental-packages']);
      alert(editingPackage ? 'Package updated successfully!' : 'Package created successfully!');
      handleCloseDialog();
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CarRentalPackage.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['car-rental-packages']);
      alert('Package deleted successfully!');
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    }
  });

  const handleOpenDialog = (pkg = null) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData(pkg);
    } else {
      setEditingPackage(null);
      setFormData({
        price_configuration_id: "",
        package_name: "",
        distance_for_base_price: 0,
        time_for_base_price: 0,
        base_price: 0,
        price_per_unit_distance: 0,
        price_per_unit_time: 0,
        business_status: true
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPackage(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this package?')) {
      deleteMutation.mutate(id);
    }
  };

  // Filter packages
  const filteredPackages = packages.filter(pkg => {
    const config = priceConfigs.find(c => c.id === pkg.price_configuration_id);
    
    let matchesCity = !selectedCity || config?.city_id === selectedCity;
    let matchesService = !selectedServiceType || config?.service_type_id === selectedServiceType;
    let matchesSearch = !searchTerm || pkg.package_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCity && matchesService && matchesSearch;
  });

  // Quick package templates
  const templates = [
    { name: "2 Hours", time: 120, distance: 20, price: 50 },
    { name: "4 Hours", time: 240, distance: 40, price: 90 },
    { name: "8 Hours", time: 480, distance: 80, price: 160 },
    { name: "Full Day", time: 1440, distance: 150, price: 280 },
  ];

  const applyTemplate = (template) => {
    setFormData({
      ...formData,
      package_name: template.name,
      time_for_base_price: template.time,
      distance_for_base_price: template.distance,
      base_price: template.price,
      price_per_unit_distance: 1.5,
      price_per_unit_time: 0.25
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Car Rental Packages</h1>
          <p className="text-gray-600 mt-1">Hourly and daily car rental pricing packages</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-[#15B46A]">
          <Plus className="w-4 h-4 mr-2" />
          Add Package
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Cities</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Service Types</SelectItem>
                {serviceTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Packages Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5 text-[#15B46A]" />
            Rental Packages ({filteredPackages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-[#15B46A] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading packages...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Package Name</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Time Included</TableHead>
                    <TableHead>Distance Included</TableHead>
                    <TableHead>Base Price</TableHead>
                    <TableHead>Extra Charges</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPackages.map((pkg) => {
                    const config = priceConfigs.find(c => c.id === pkg.price_configuration_id);
                    const serviceType = serviceTypes.find(s => s.id === config?.service_type_id);
                    const city = cities.find(c => c.id === config?.city_id);
                    
                    const hours = Math.floor(pkg.time_for_base_price / 60);
                    const minutes = pkg.time_for_base_price % 60;
                    
                    return (
                      <motion.tr
                        key={pkg.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#15B46A]" />
                            <span className="font-medium">{pkg.package_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-gray-400" />
                            {serviceType?.name || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            {city?.name || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            <Clock className="w-3 h-3 mr-1" />
                            {hours > 0 && `${hours}h`} {minutes > 0 && `${minutes}m`}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            <Navigation className="w-3 h-3 mr-1" />
                            {pkg.distance_for_base_price} km
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-[#15B46A] text-white text-base px-3 py-1">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {pkg.base_price.toFixed(2)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-gray-600">
                            <div>${pkg.price_per_unit_distance}/km</div>
                            <div>${pkg.price_per_unit_time}/min</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {pkg.business_status ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="w-3 h-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(pkg)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(pkg.id)}
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

              {filteredPackages.length === 0 && (
                <div className="text-center py-12">
                  <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No rental packages found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Create hourly or daily rental packages for your services
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPackage ? 'Edit Rental Package' : 'Add New Rental Package'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quick Templates */}
            {!editingPackage && (
              <div>
                <Label>Quick Templates</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {templates.map((template, idx) => (
                    <Button
                      key={idx}
                      type="button"
                      variant="outline"
                      onClick={() => applyTemplate(template)}
                      className="h-auto py-3 flex flex-col items-center"
                    >
                      <Clock className="w-4 h-4 mb-1" />
                      <span className="font-semibold text-sm">{template.name}</span>
                      <span className="text-xs text-gray-500">${template.price}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Configuration */}
            <div>
              <Label>Price Configuration (Service Type + City) *</Label>
              <Select
                value={formData.price_configuration_id}
                onValueChange={(value) => setFormData({...formData, price_configuration_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select price configuration" />
                </SelectTrigger>
                <SelectContent>
                  {priceConfigs.filter(c => c.car_rental_business).map(config => {
                    const serviceType = serviceTypes.find(s => s.id === config.service_type_id);
                    const city = cities.find(c => c.id === config.city_id);
                    return (
                      <SelectItem key={config.id} value={config.id}>
                        {serviceType?.name} - {city?.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Must have "Car Rental Business" enabled in pricing configuration
              </p>
            </div>

            {/* Package Details */}
            <div>
              <Label>Package Name *</Label>
              <Input
                value={formData.package_name}
                onChange={(e) => setFormData({...formData, package_name: e.target.value})}
                placeholder="2 Hours"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Time Included (minutes) *</Label>
                <Input
                  type="number"
                  value={formData.time_for_base_price}
                  onChange={(e) => setFormData({...formData, time_for_base_price: Number(e.target.value)})}
                  placeholder="120"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {Math.floor(formData.time_for_base_price / 60)}h {formData.time_for_base_price % 60}m
                </p>
              </div>

              <div>
                <Label>Distance Included (km) *</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.distance_for_base_price}
                  onChange={(e) => setFormData({...formData, distance_for_base_price: Number(e.target.value)})}
                  placeholder="20"
                  required
                />
              </div>
            </div>

            <div>
              <Label>Base Price ($) *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.base_price}
                onChange={(e) => setFormData({...formData, base_price: Number(e.target.value)})}
                placeholder="50.00"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Includes {Math.floor(formData.time_for_base_price / 60)}h {formData.time_for_base_price % 60}m and {formData.distance_for_base_price}km
              </p>
            </div>

            {/* Extra Charges */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Extra KM Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price_per_unit_distance}
                  onChange={(e) => setFormData({...formData, price_per_unit_distance: Number(e.target.value)})}
                  placeholder="1.50"
                />
                <p className="text-xs text-gray-500 mt-1">Per km over included distance</p>
              </div>

              <div>
                <Label>Extra Time Price ($/min)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price_per_unit_time}
                  onChange={(e) => setFormData({...formData, price_per_unit_time: Number(e.target.value)})}
                  placeholder="0.25"
                />
                <p className="text-xs text-gray-500 mt-1">Per minute over included time</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <Label>Business Status</Label>
                <p className="text-sm text-gray-500">Enable this package</p>
              </div>
              <Switch
                checked={formData.business_status}
                onCheckedChange={(checked) => setFormData({...formData, business_status: checked})}
              />
            </div>

            {/* Example Calculation */}
            {formData.base_price > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Example Calculation</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>
                    <strong>Base:</strong> {formData.package_name} = ${formData.base_price.toFixed(2)}
                  </p>
                  <p>
                    <strong>If exceeded:</strong> +${formData.price_per_unit_distance}/km, +${formData.price_per_unit_time}/min
                  </p>
                  <p className="pt-2 border-t border-blue-300">
                    <strong>Example:</strong> Customer uses {Math.floor(formData.time_for_base_price / 60) + 1}h and {formData.distance_for_base_price + 10}km
                  </p>
                  <p>
                    Price = ${formData.base_price} + ${(60 * formData.price_per_unit_time).toFixed(2)} (time) + ${(10 * formData.price_per_unit_distance).toFixed(2)} (distance) 
                    = <strong>${(formData.base_price + 60 * formData.price_per_unit_time + 10 * formData.price_per_unit_distance).toFixed(2)}</strong>
                  </p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#15B46A]" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : editingPackage ? 'Update Package' : 'Create Package'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
