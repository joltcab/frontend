
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
  Building2, Plus, Edit, Trash2, CheckCircle, XCircle,
  MapPin, Globe, Search, Ruler
} from "lucide-react";
import { motion } from "framer-motion";
// import { toast } from "react-hot-toast"; // Removed as requested
import MapWrapper from "../components/maps/MapWrapper";

export default function AdminCities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    full_name: "",
    country_id: "",
    city_code: "",
    latitude: 0,
    longitude: 0,
    city_radius: 50,
    city_boundaries: [],
    is_use_city_boundary: false,
    unit: "km",
    business_status: true,
    timezone: "America/New_York",
    destination_cities: [],
    is_payment_mode_cash: true,
    is_payment_mode_card: true,
    payment_gateway: ["stripe"],
    airport_business: false,
    zone_business: false,
    city_business: false
  });

  const queryClient = useQueryClient();

  // Fetch data
  const { data: cities = [], isLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: () => base44.entities.City.list()
  });

  const { data: countries = [] } = useQuery({
    queryKey: ['countries'],
    queryFn: () => base44.countries.list()
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editingCity) {
        return await base44.entities.City.update(editingCity.id, data);
      }
      return await base44.entities.City.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cities']);
      alert(editingCity ? 'City updated successfully!' : 'City created successfully!');
      handleCloseDialog();
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.City.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['cities']);
      alert('City deleted successfully!');
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    }
  });

  const handleOpenDialog = (city = null) => {
    if (city) {
      setEditingCity(city);
      setFormData(city);
    } else {
      setEditingCity(null);
      setFormData({
        name: "",
        full_name: "",
        country_id: "",
        city_code: "",
        latitude: 0,
        longitude: 0,
        city_radius: 50,
        city_boundaries: [],
        is_use_city_boundary: false,
        unit: "km",
        business_status: true,
        timezone: "America/New_York",
        destination_cities: [],
        is_payment_mode_cash: true,
        is_payment_mode_card: true,
        payment_gateway: ["stripe"],
        airport_business: false,
        zone_business: false,
        city_business: false
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCity(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this city?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleMapClick = (lat, lng) => {
    setFormData({
      ...formData,
      latitude: lat,
      longitude: lng
    });
  };

  // Filter cities
  const filteredCities = cities.filter(city =>
    city.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.city_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const timezones = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "America/Mexico_City",
    "America/Argentina/Buenos_Aires",
    "Europe/London",
    "Europe/Paris",
    "Asia/Dubai"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cities</h1>
          <p className="text-gray-600 mt-1">Manage cities and their configurations</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-[#15B46A]">
          <Plus className="w-4 h-4 mr-2" />
          Add City
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cities Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#15B46A]" />
            Cities List ({filteredCities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-[#15B46A] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading cities...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>City</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Coordinates</TableHead>
                    <TableHead>Radius</TableHead>
                    <TableHead>Timezone</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCities.map((city) => {
                    const country = countries.find(c => c.id === city.country_id);
                    return (
                      <motion.tr
                        key={city.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <div>
                              <div>{city.name}</div>
                              {city.city_code && (
                                <div className="text-xs text-gray-500">{city.city_code}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Globe className="w-4 h-4 text-gray-400" />
                            {country?.name || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-red-500" />
                            <span className="text-xs">
                              {city.latitude?.toFixed(4)}, {city.longitude?.toFixed(4)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            <Ruler className="w-3 h-3 mr-1" />
                            {city.city_radius} {city.unit}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{city.timezone}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {city.airport_business && (
                              <Badge className="text-xs bg-purple-100 text-purple-800">Airport</Badge>
                            )}
                            {city.zone_business && (
                              <Badge className="text-xs bg-blue-100 text-blue-800">Zones</Badge>
                            )}
                            {city.city_business && (
                              <Badge className="text-xs bg-orange-100 text-orange-800">Inter-City</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {city.business_status ? (
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
                              onClick={() => handleOpenDialog(city)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(city.id)}
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

              {filteredCities.length === 0 && (
                <div className="text-center py-12">
                  <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No cities found</p>
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
              {editingCity ? 'Edit City' : 'Add New City'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>City Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Atlanta"
                      required
                    />
                  </div>

                  <div>
                    <Label>Full Name</Label>
                    <Input
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      placeholder="Atlanta, Georgia"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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

                  <div>
                    <Label>City Code</Label>
                    <Input
                      value={formData.city_code}
                      onChange={(e) => setFormData({...formData, city_code: e.target.value})}
                      placeholder="GA"
                    />
                  </div>
                </div>

                <div>
                  <Label>Timezone *</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) => setFormData({...formData, timezone: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map(tz => (
                        <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <Label>Business Status</Label>
                    <p className="text-sm text-gray-500">Enable operations in this city</p>
                  </div>
                  <Switch
                    checked={formData.business_status}
                    onCheckedChange={(checked) => setFormData({...formData, business_status: checked})}
                  />
                </div>
              </TabsContent>

              {/* Location Tab */}
              <TabsContent value="location" className="space-y-4 mt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Latitude *</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={formData.latitude}
                      onChange={(e) => setFormData({...formData, latitude: Number(e.target.value)})}
                      required
                    />
                  </div>

                  <div>
                    <Label>Longitude *</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={formData.longitude}
                      onChange={(e) => setFormData({...formData, longitude: Number(e.target.value)})}
                      required
                    />
                  </div>

                  <div>
                    <Label>Service Radius</Label>
                    <Input
                      type="number"
                      value={formData.city_radius}
                      onChange={(e) => setFormData({...formData, city_radius: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <Label>Distance Unit</Label>
                  <Select
                    value={formData.unit}
                    onValueChange={(value) => setFormData({...formData, unit: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="km">Kilometers (km)</SelectItem>
                      <SelectItem value="miles">Miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="h-64 border rounded-lg overflow-hidden">
                  <MapWrapper
                    center={{ lat: formData.latitude, lng: formData.longitude }}
                    zoom={12}
                    markers={[{ lat: formData.latitude, lng: formData.longitude }]}
                    onClick={handleMapClick}
                  />
                </div>

                <p className="text-sm text-gray-500">
                  Click on the map to set city coordinates
                </p>
              </TabsContent>

              {/* Payment Tab */}
              <TabsContent value="payment" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Cash Payment</Label>
                      <p className="text-sm text-gray-500">Allow cash payments</p>
                    </div>
                    <Switch
                      checked={formData.is_payment_mode_cash}
                      onCheckedChange={(checked) => setFormData({...formData, is_payment_mode_cash: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Card Payment</Label>
                      <p className="text-sm text-gray-500">Allow card payments</p>
                    </div>
                    <Switch
                      checked={formData.is_payment_mode_card}
                      onCheckedChange={(checked) => setFormData({...formData, is_payment_mode_card: checked})}
                    />
                  </div>

                  {formData.is_payment_mode_card && (
                    <div>
                      <Label>Payment Gateways</Label>
                      <div className="mt-2 space-y-2">
                        {['stripe', 'paypal'].map(gateway => (
                          <div key={gateway} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={formData.payment_gateway.includes(gateway)}
                              onChange={(e) => {
                                const gateways = e.target.checked
                                  ? [...formData.payment_gateway, gateway]
                                  : formData.payment_gateway.filter(g => g !== gateway);
                                setFormData({...formData, payment_gateway: gateways});
                              }}
                            />
                            <Label className="capitalize">{gateway}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Features Tab */}
              <TabsContent value="features" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Airport Service</Label>
                      <p className="text-sm text-gray-500">Enable airport pickup/dropoff</p>
                    </div>
                    <Switch
                      checked={formData.airport_business}
                      onCheckedChange={(checked) => setFormData({...formData, airport_business: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Zone Pricing</Label>
                      <p className="text-sm text-gray-500">Enable zone-based pricing</p>
                    </div>
                    <Switch
                      checked={formData.zone_business}
                      onCheckedChange={(checked) => setFormData({...formData, zone_business: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Inter-City Trips</Label>
                      <p className="text-sm text-gray-500">Allow trips to other cities</p>
                    </div>
                    <Switch
                      checked={formData.city_business}
                      onCheckedChange={(checked) => setFormData({...formData, city_business: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Use City Boundaries</Label>
                      <p className="text-sm text-gray-500">Use polygon instead of radius</p>
                    </div>
                    <Switch
                      checked={formData.is_use_city_boundary}
                      onCheckedChange={(checked) => setFormData({...formData, is_use_city_boundary: checked})}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#15B46A]" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : editingCity ? 'Update City' : 'Create City'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
