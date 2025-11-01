import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import joltcab from "@/lib/joltcab-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Map, Plus, Trash2, Edit } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import ZoneDrawer from "../components/maps/ZoneDrawer";
import GoogleMapLoader from "../components/maps/GoogleMapLoader";

export default function AdminZoneManagement() {
  const [selectedCity, setSelectedCity] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  
  const [zoneFormData, setZoneFormData] = useState({
    name: '',
    color: '#15B46A',
    is_airport: false,
    business_status: true,
    coordinates: []
  });

  const queryClient = useQueryClient();

  const { data: cities = [], isLoading: citiesLoading } = useQuery({
    queryKey: ['cities'],
  queryFn: () => joltcab.entities.City.list(),
  });

  const { data: zones = [], isLoading: zonesLoading } = useQuery({
    queryKey: ['zones', selectedCity],
  queryFn: () => joltcab.entities.Zone.filter({ city_id: selectedCity }),
    enabled: !!selectedCity,
  });

  const createZoneMutation = useMutation({
    mutationFn: async (zoneData) => {
  return await joltcab.entities.Zone.create(zoneData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['zones']);
      alert('Zone created successfully!');
      resetForm();
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    }
  });

  const updateZoneMutation = useMutation({
    mutationFn: async ({ id, zoneData }) => {
  return await joltcab.entities.Zone.update(id, zoneData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['zones']);
      alert('Zone updated successfully!');
      resetForm();
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    }
  });

  const deleteZoneMutation = useMutation({
    mutationFn: async (zoneId) => {
  return await joltcab.entities.Zone.delete(zoneId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['zones']);
      alert('Zone deleted successfully!');
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    }
  });

  const handleZoneSaved = (zoneData) => {
    const dataToSubmit = {
      ...zoneFormData,
      city_id: selectedCity,
      coordinates: zoneData.coordinates,
      color: zoneData.color,
    };

    if (editingZone) {
      updateZoneMutation.mutate({ id: editingZone.id, zoneData: dataToSubmit });
    } else {
      createZoneMutation.mutate(dataToSubmit);
    }
  };

  const handleEditZone = (zone) => {
    setEditingZone(zone);
    setZoneFormData({
      name: zone.name,
      color: zone.color || '#15B46A',
      is_airport: zone.is_airport || false,
      business_status: zone.business_status !== false,
      coordinates: zone.coordinates || []
    });
    setShowDrawer(true);
  };

  const handleDeleteZone = (zoneId) => {
    if (confirm('Are you sure you want to delete this zone?')) {
      deleteZoneMutation.mutate(zoneId);
    }
  };

  const resetForm = () => {
    setZoneFormData({
      name: '',
      color: '#15B46A',
      is_airport: false,
      business_status: true,
      coordinates: []
    });
    setEditingZone(null);
    setShowDrawer(false);
  };

  const selectedCityData = cities.find(c => c.id === selectedCity);
  const mapCenter = selectedCityData 
    ? { lat: selectedCityData.latitude || 33.7490, lng: selectedCityData.longitude || -84.3880 }
    : { lat: 33.7490, lng: -84.3880 };

  if (citiesLoading) {
    return (
      <Card>
        <CardContent className="p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#15B46A]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="w-5 h-5 text-[#15B46A]" />
            Zone Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* City Selector */}
          <div>
            <Label>Select City</Label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a city..." />
              </SelectTrigger>
              <SelectContent>
                {cities.map(city => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCity && (
            <>
              {/* Zone Form */}
              {!showDrawer && (
                <Card className="p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Zone Name <span className="text-red-500">*</span></Label>
                        <Input
                          value={zoneFormData.name}
                          onChange={(e) => setZoneFormData({...zoneFormData, name: e.target.value})}
                          placeholder="e.g., Downtown, Airport Area"
                        />
                      </div>
                      <div>
                        <Label>Zone Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={zoneFormData.color}
                            onChange={(e) => setZoneFormData({...zoneFormData, color: e.target.value})}
                            className="w-20 h-10"
                          />
                          <Input
                            value={zoneFormData.color}
                            onChange={(e) => setZoneFormData({...zoneFormData, color: e.target.value})}
                            placeholder="#15B46A"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={zoneFormData.is_airport}
                          onCheckedChange={(checked) => setZoneFormData({...zoneFormData, is_airport: checked})}
                        />
                        <Label>Is Airport Zone</Label>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={zoneFormData.business_status}
                          onCheckedChange={(checked) => setZoneFormData({...zoneFormData, business_status: checked})}
                        />
                        <Label>Active</Label>
                      </div>
                    </div>

                    <Button
                      onClick={() => setShowDrawer(true)}
                      className="w-full bg-[#15B46A] hover:bg-[#0F9456]"
                      disabled={!zoneFormData.name}
                    >
                      <Map className="w-4 h-4 mr-2" />
                      {editingZone ? 'Edit Zone on Map' : 'Draw Zone on Map'}
                    </Button>
                  </div>
                </Card>
              )}

              {/* Map Drawer */}
              {showDrawer && (
                <GoogleMapLoader>
                  <ZoneDrawer
                    center={mapCenter}
                    existingZones={zones}
                    onZoneSaved={handleZoneSaved}
                    onCancel={resetForm}
                    height="600px"
                  />
                </GoogleMapLoader>
              )}

              {/* Existing Zones List */}
              {zones.length > 0 && !showDrawer && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Existing Zones ({zones.length})</h3>
                  <div className="space-y-3">
                    {zones.map(zone => (
                      <Card key={zone.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-lg border-2 border-gray-300"
                              style={{ backgroundColor: zone.color }}
                            />
                            <div>
                              <p className="font-semibold">{zone.name}</p>
                              <div className="flex gap-2 mt-1">
                                {zone.is_airport && (
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    Airport
                                  </Badge>
                                )}
                                <Badge className={zone.business_status ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}>
                                  {zone.business_status ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditZone(zone)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteZone(zone.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {zones.length === 0 && !showDrawer && (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <Map className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No zones created yet for this city</p>
                  <p className="text-sm text-gray-500">Fill in the zone details above and click "Draw Zone on Map"</p>
                </div>
              )}
            </>
          )}

          {!selectedCity && (
            <div className="text-center py-12 text-gray-500">
              <Map className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p>Select a city to manage zones</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}