
import React, { useState } from "react";
import joltcab from "@/lib/joltcab-api";
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
import {
  DollarSign, Plus, Edit, Trash2, Search, Navigation,
  ArrowRight, MapPin, Car, Building2, Plane
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminZonePricing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [formData, setFormData] = useState({
    price_configuration_id: "",
    from_zone_id: "",
    to_zone_id: "",
    amount: 0
  });

  const queryClient = useQueryClient();

  // Fetch data
  const { data: zonePrices = [], isLoading } = useQuery({
    queryKey: ['zone-prices'],
  queryFn: () => joltcab.entities.ZonePrice.list()
  });

  const { data: priceConfigs = [] } = useQuery({
    queryKey: ['price-configurations'],
  queryFn: () => joltcab.entities.PriceConfiguration.list()
  });

  const { data: zones = [] } = useQuery({
    queryKey: ['zones'],
  queryFn: () => joltcab.entities.Zone.list()
  });

  const { data: cities = [] } = useQuery({
    queryKey: ['cities'],
  queryFn: () => joltcab.entities.City.list()
  });

  const { data: serviceTypes = [] } = useQuery({
    queryKey: ['service-types'],
  queryFn: () => joltcab.entities.ServiceType.list()
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editingPrice) {
  return await joltcab.entities.ZonePrice.update(editingPrice.id, data);
      }
  return await joltcab.entities.ZonePrice.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['zone-prices']);
      alert(editingPrice ? 'Zone price updated successfully!' : 'Zone price created successfully!');
      handleCloseDialog();
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
  mutationFn: (id) => joltcab.entities.ZonePrice.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['zone-prices']);
      alert('Zone price deleted successfully!');
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    }
  });

  const handleOpenDialog = (price = null) => {
    if (price) {
      setEditingPrice(price);
      setFormData(price);
    } else {
      setEditingPrice(null);
      setFormData({
        price_configuration_id: "",
        from_zone_id: "",
        to_zone_id: "",
        amount: 0
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPrice(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.from_zone_id === formData.to_zone_id) {
      alert('From and To zones must be different');
      return;
    }
    saveMutation.mutate(formData);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this zone price?')) {
      deleteMutation.mutate(id);
    }
  };

  // Filter zone prices
  const filteredPrices = zonePrices.filter(price => {
    const config = priceConfigs.find(c => c.id === price.price_configuration_id);
    const fromZone = zones.find(z => z.id === price.from_zone_id);
    const toZone = zones.find(z => z.id === price.to_zone_id);
    
    let matchesCity = !selectedCity || (fromZone?.city_id === selectedCity || toZone?.city_id === selectedCity);
    let matchesService = !selectedServiceType || config?.service_type_id === selectedServiceType;
    let matchesSearch = !searchTerm || 
      fromZone?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      toZone?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCity && matchesService && matchesSearch;
  });

  // Available configs for dropdown (filtered by city and service type)
  const availableConfigs = priceConfigs.filter(config => {
    if (!selectedCity && !selectedServiceType) return true;
    let matchesCity = !selectedCity || config.city_id === selectedCity;
    let matchesService = !selectedServiceType || config.service_type_id === selectedServiceType;
    return matchesCity && matchesService;
  });

  // Available zones for dropdown (filtered by city)
  const availableZones = zones.filter(zone => {
    if (!formData.price_configuration_id) return false;
    const config = priceConfigs.find(c => c.id === formData.price_configuration_id);
    return zone.city_id === config?.city_id;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Zone Pricing</h1>
          <p className="text-gray-600 mt-1">Fixed prices between specific zones</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-[#15B46A]">
          <Plus className="w-4 h-4 mr-2" />
          Add Zone Price
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search zones..."
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

      {/* Zone Prices Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-[#15B46A]" />
            Zone to Zone Prices ({filteredPrices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-[#15B46A] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading zone prices...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From Zone</TableHead>
                    <TableHead></TableHead>
                    <TableHead>To Zone</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Fixed Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrices.map((price) => {
                    const config = priceConfigs.find(c => c.id === price.price_configuration_id);
                    const fromZone = zones.find(z => z.id === price.from_zone_id);
                    const toZone = zones.find(z => z.id === price.to_zone_id);
                    const serviceType = serviceTypes.find(s => s.id === config?.service_type_id);
                    const city = cities.find(c => c.id === config?.city_id);
                    
                    return (
                      <motion.tr
                        key={price.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {fromZone?.is_airport ? (
                              <Plane className="w-4 h-4 text-purple-500" />
                            ) : (
                              <MapPin className="w-4 h-4 text-[#15B46A]" />
                            )}
                            <span className="font-medium">{fromZone?.name || 'N/A'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <ArrowRight className="w-5 h-5 text-gray-400 mx-auto" />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {toZone?.is_airport ? (
                              <Plane className="w-4 h-4 text-purple-500" />
                            ) : (
                              <MapPin className="w-4 h-4 text-[#15B46A]" />
                            )}
                            <span className="font-medium">{toZone?.name || 'N/A'}</span>
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
                          <Badge className="bg-[#15B46A] text-white text-base px-3 py-1">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {price.amount.toFixed(2)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(price)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(price.id)}
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

              {filteredPrices.length === 0 && (
                <div className="text-center py-12">
                  <Navigation className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No zone prices found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Create fixed prices between zones (e.g., Airport to Downtown)
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPrice ? 'Edit Zone Price' : 'Add New Zone Price'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Price Configuration (Service Type + City) *</Label>
              <Select
                value={formData.price_configuration_id}
                onValueChange={(value) => setFormData({...formData, price_configuration_id: value, from_zone_id: "", to_zone_id: ""})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select price configuration" />
                </SelectTrigger>
                <SelectContent>
                  {priceConfigs.map(config => {
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
                Select which service type and city this pricing applies to
              </p>
            </div>

            {formData.price_configuration_id && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>From Zone *</Label>
                    <Select
                      value={formData.from_zone_id}
                      onValueChange={(value) => setFormData({...formData, from_zone_id: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select origin zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableZones.map(zone => (
                          <SelectItem key={zone.id} value={zone.id}>
                            {zone.is_airport && '✈️ '}{zone.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>To Zone *</Label>
                    <Select
                      value={formData.to_zone_id}
                      onValueChange={(value) => setFormData({...formData, to_zone_id: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableZones
                          .filter(z => z.id !== formData.from_zone_id)
                          .map(zone => (
                            <SelectItem key={zone.id} value={zone.id}>
                              {zone.is_airport && '✈️ '}{zone.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Fixed Price ($) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                    placeholder="25.00"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This price will override the distance/time calculation for trips between these zones
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">How Zone Pricing Works</h4>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Zone prices are <strong>bidirectional</strong> (From A to B = From B to A)</li>
                    <li>Overrides normal distance/time pricing</li>
                    <li>Perfect for airport transfers or popular routes</li>
                    <li>Passengers see exact price before booking</li>
                  </ul>
                </div>
              </>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#15B46A]" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : editingPrice ? 'Update Price' : 'Create Price'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
