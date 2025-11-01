import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Loader2, Save, Info } from "lucide-react";
// Removed unused motion import
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function PriceConfigurationForm() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("");
  
  // Backend guard: avoid queries/mutations in dev without token or when disabled
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const disableChecks = import.meta.env.VITE_DISABLE_BACKEND_AUTH_CHECK === 'true';
  const isDev = import.meta.env.DEV === true;
  const backendDisabled = disableChecks || (isDev && !token);
  
  const [formData, setFormData] = useState({
    provider_profit: 85,
    min_fare: 1.75,
    base_price_distance: 0,
    base_price: 6,
    price_per_unit_distance: 1.75,
    price_per_unit_time: 0.25,
    waiting_time_start_after_minute: 5,
    price_for_waiting_time: 0.005,
    max_space: 4,
    is_car_rental_business: false,
    business_status: true,
    cancellation_fee: 4.5,
    tax: 0,
    user_miscellaneous_fee: 0,
    user_tax: 0,
    provider_miscellaneous_fee: 0,
    provider_tax: 0,
    is_zone: false,
    is_surge_hours: false,
  });

  const [surgeHours, setSurgeHours] = useState([
    { day: 0, dayName: 'Sun', is_surge: false, times: [] },
    { day: 1, dayName: 'Mon', is_surge: false, times: [] },
    { day: 2, dayName: 'Tue', is_surge: false, times: [] },
    { day: 3, dayName: 'Wed', is_surge: false, times: [] },
    { day: 4, dayName: 'Thu', is_surge: false, times: [] },
    { day: 5, dayName: 'Fri', is_surge: false, times: [] },
    { day: 6, dayName: 'Sat', is_surge: false, times: [] },
  ]);

  const [currentDay, setCurrentDay] = useState(0);
  const [newSurge, setNewSurge] = useState({
    start_time: '',
    end_time: '',
    multiplier: 1.5
  });

  const queryClient = useQueryClient();

  const { data: countries = [] } = useQuery({
    queryKey: ['countries'],
    queryFn: () => base44.countries.list(),
    enabled: !backendDisabled,
  });

  const { data: cities = [] } = useQuery({
    queryKey: ['cities', selectedCountry],
    queryFn: () => base44.entities.City.filter({ country_id: selectedCountry }),
    enabled: !!selectedCountry && !backendDisabled,
  });

  const { data: serviceTypes = [] } = useQuery({
    queryKey: ['serviceTypes'],
    queryFn: () => base44.entities.ServiceType.list(),
    enabled: !backendDisabled,
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.PriceConfiguration.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-configurations'] });
      alert('Price configuration created successfully!');
      resetForm();
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (backendDisabled) {
      alert('Backend disabled in development or auth checks turned off. Submission is unavailable.');
      return;
    }
    
    if (!selectedCountry || !selectedCity || !selectedServiceType) {
      alert('Please select Country, City, and Service Type');
      return;
    }

    const dataToSubmit = {
      ...formData,
      service_type_id: selectedServiceType,
      country_id: selectedCountry,
      city_id: selectedCity,
      surge_times: surgeHours
        .filter(day => day.is_surge && day.times.length > 0)
        .map(day => ({
          day: day.dayName,
          times: day.times
        }))
    };

    console.log('Submitting:', dataToSubmit);
    createMutation.mutate(dataToSubmit);
  };

  const handleAddSurgeTime = () => {
    if (!newSurge.start_time || !newSurge.end_time || !newSurge.multiplier) {
      alert('Please fill all surge time fields');
      return;
    }

    const updatedSurgeHours = [...surgeHours];
    updatedSurgeHours[currentDay].times.push({ ...newSurge });
    setSurgeHours(updatedSurgeHours);
    
    setNewSurge({ start_time: '', end_time: '', multiplier: 1.5 });
  };

  const handleRemoveSurgeTime = (dayIndex, timeIndex) => {
    const updatedSurgeHours = [...surgeHours];
    updatedSurgeHours[dayIndex].times.splice(timeIndex, 1);
    setSurgeHours(updatedSurgeHours);
  };

  const toggleDaySurge = (dayIndex) => {
    const updatedSurgeHours = [...surgeHours];
    updatedSurgeHours[dayIndex].is_surge = !updatedSurgeHours[dayIndex].is_surge;
    setSurgeHours(updatedSurgeHours);
  };

  const resetForm = () => {
    setSelectedCountry("");
    setSelectedCity("");
    setSelectedServiceType("");
    setFormData({
      provider_profit: 85,
      min_fare: 1.75,
      base_price_distance: 0,
      base_price: 6,
      price_per_unit_distance: 1.75,
      price_per_unit_time: 0.25,
      waiting_time_start_after_minute: 5,
      price_for_waiting_time: 0.005,
      max_space: 4,
      is_car_rental_business: false,
      business_status: true,
      cancellation_fee: 4.5,
      tax: 0,
      user_miscellaneous_fee: 0,
      user_tax: 0,
      provider_miscellaneous_fee: 0,
      provider_tax: 0,
      is_zone: false,
      is_surge_hours: false,
    });
    setSurgeHours([
      { day: 0, dayName: 'Sun', is_surge: false, times: [] },
      { day: 1, dayName: 'Mon', is_surge: false, times: [] },
      { day: 2, dayName: 'Tue', is_surge: false, times: [] },
      { day: 3, dayName: 'Wed', is_surge: false, times: [] },
      { day: 4, dayName: 'Thu', is_surge: false, times: [] },
      { day: 5, dayName: 'Fri', is_surge: false, times: [] },
      { day: 6, dayName: 'Sat', is_surge: false, times: [] },
    ]);
  };

  const TooltipField = ({ label, value, onChange, tooltip, type = "text", step, min, ...props }) => {
    if (!label) {
      console.warn("TooltipField: 'label' prop is required");
    }
    return (
    <div className="form-group mb-4">
      <Label className="block text-sm font-medium text-gray-700 mb-2">{label}</Label>
      <TooltipProvider>
        <div className="flex gap-2">
          <Input
            type={type}
            value={value}
            onChange={onChange}
            step={step}
            min={min}
            className="flex-1"
            {...props}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="outline" size="icon" className="shrink-0">
                <Info className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
    if (!label) {
      console.warn("TooltipField: 'label' prop is required");
    }
    return (
    <div className="form-group mb-4">
      <Label className="block text-sm font-medium text-gray-700 mb-2">{label}</Label>
      <TooltipProvider>
        <div className="flex gap-2">
          <Input
            type={type}
            value={value}
            onChange={onChange}
            step={step}
            min={min}
            className="flex-1"
            {...props}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="outline" size="icon" className="shrink-0">
                <Info className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Add City Type Price Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="basic">Basic Configuration</TabsTrigger>
              <TabsTrigger value="zone">Zone & Surge Pricing</TabsTrigger>
              <TabsTrigger value="surge-hours">Surge Hours</TabsTrigger>
            </TabsList>

            {/* TAB 1: BASIC CONFIGURATION */}
            <TabsContent value="basic" className="space-y-6">
              {/* Country, City, Type Selection */}
              <Card className="p-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label className="mb-2 block">Country<span className="text-red-500">*</span></Label>
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(c => (
                          <SelectItem key={String(c.id || c._id)} value={String(c.id || c._id)}>
                            {c.name || c.countryname || 'Unnamed Country'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="mb-2 block">City<span className="text-red-500">*</span></Label>
                    <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedCountry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="mb-2 block">Service Type<span className="text-red-500">*</span></Label>
                    <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map(s => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              {/* Pricing Fields - 2 Columns */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* LEFT COLUMN */}
                <Card className="p-4 space-y-4">
                  <TooltipField
                    label="Max Space"
                    value={formData.max_space}
                    onChange={(e) => setFormData({...formData, max_space: parseInt(e.target.value) || 0})}
                    type="number"
                    tooltip="Maximum number of passengers allowed"
                  />

                  <TooltipField
                    label="Provider Profit (%)"
                    value={formData.provider_profit}
                    onChange={(e) => setFormData({...formData, provider_profit: parseFloat(e.target.value) || 0})}
                    type="number"
                    step="0.01"
                    tooltip="Percentage of fare that goes to the provider/driver"
                  />

                  <TooltipField
                    label="Min Fare"
                    value={formData.min_fare}
                    onChange={(e) => setFormData({...formData, min_fare: parseFloat(e.target.value) || 0})}
                    type="number"
                    step="0.01"
                    tooltip="Minimum fare charged for any ride"
                  />

                  <div className="form-group mb-4">
                    <Label className="block text-sm font-medium text-gray-700 mb-2">Distance for Base Price (km)</Label>
                    <Select
                      value={formData.base_price_distance.toString()}
                      onValueChange={(v) => setFormData({...formData, base_price_distance: parseInt(v)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(26)].map((_, i) => (
                          <SelectItem key={i} value={i.toString()}>{i} km</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <TooltipField
                    label="Base Price"
                    value={formData.base_price}
                    onChange={(e) => setFormData({...formData, base_price: parseFloat(e.target.value) || 0})}
                    type="number"
                    step="0.01"
                    tooltip="Starting price for the ride"
                  />

                  <TooltipField
                    label="Price Per Unit Distance"
                    value={formData.price_per_unit_distance}
                    onChange={(e) => setFormData({...formData, price_per_unit_distance: parseFloat(e.target.value) || 0})}
                    type="number"
                    step="0.01"
                    tooltip="Price charged per kilometer/mile"
                  />

                  <TooltipField
                    label="Price Per Unit Time (min)"
                    value={formData.price_per_unit_time}
                    onChange={(e) => setFormData({...formData, price_per_unit_time: parseFloat(e.target.value) || 0})}
                    type="number"
                    step="0.01"
                    tooltip="Price charged per minute of ride duration"
                  />

                  <TooltipField
                    label="Waiting Time Start After (minutes)"
                    value={formData.waiting_time_start_after_minute}
                    onChange={(e) => setFormData({...formData, waiting_time_start_after_minute: parseInt(e.target.value) || 0})}
                    type="number"
                    tooltip="Free waiting time in minutes before charges apply"
                  />

                  <TooltipField
                    label="Price For Waiting Time"
                    value={formData.price_for_waiting_time}
                    onChange={(e) => setFormData({...formData, price_for_waiting_time: parseFloat(e.target.value) || 0})}
                    type="number"
                    step="0.001"
                    tooltip="Price per minute after free waiting time"
                  />

                  <div className="form-group mb-4">
                    <Label className="block text-sm font-medium text-gray-700 mb-2">Car Rental Business</Label>
                    <Select
                      value={formData.is_car_rental_business ? "1" : "0"}
                      onValueChange={(v) => setFormData({...formData, is_car_rental_business: v === "1"})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">ON</SelectItem>
                        <SelectItem value="0">OFF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Card>

                {/* RIGHT COLUMN */}
                <Card className="p-4 space-y-4">
                  <div className="form-group mb-4">
                    <Label className="block text-sm font-medium text-gray-700 mb-2">Business Status</Label>
                    <Select
                      value={formData.business_status ? "1" : "0"}
                      onValueChange={(v) => setFormData({...formData, business_status: v === "1"})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">ON</SelectItem>
                        <SelectItem value="0">OFF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <TooltipField
                    label="Cancellation Fee"
                    value={formData.cancellation_fee}
                    onChange={(e) => setFormData({...formData, cancellation_fee: parseFloat(e.target.value) || 0})}
                    type="number"
                    step="0.01"
                    tooltip="Fee charged when a ride is cancelled"
                  />

                  <TooltipField
                    label="Tax (%)"
                    value={formData.tax}
                    onChange={(e) => setFormData({...formData, tax: parseFloat(e.target.value) || 0})}
                    type="number"
                    step="0.01"
                    tooltip="Tax percentage applied to the fare"
                  />

                  <TooltipField
                    label="User Miscellaneous Fee"
                    value={formData.user_miscellaneous_fee}
                    onChange={(e) => setFormData({...formData, user_miscellaneous_fee: parseFloat(e.target.value) || 0})}
                    type="number"
                    step="0.01"
                    tooltip="Additional fees charged to the user"
                  />

                  <TooltipField
                    label="User Tax (%)"
                    value={formData.user_tax}
                    onChange={(e) => setFormData({...formData, user_tax: parseFloat(e.target.value) || 0})}
                    type="number"
                    step="0.01"
                    tooltip="Tax percentage on user's total"
                  />

                  <TooltipField
                    label="Provider Miscellaneous Fee"
                    value={formData.provider_miscellaneous_fee}
                    onChange={(e) => setFormData({...formData, provider_miscellaneous_fee: parseFloat(e.target.value) || 0})}
                    type="number"
                    step="0.01"
                    tooltip="Additional fees charged to provider"
                  />

                  <TooltipField
                    label="Provider Tax (%)"
                    value={formData.provider_tax}
                    onChange={(e) => setFormData({...formData, provider_tax: parseFloat(e.target.value) || 0})}
                    type="number"
                    step="0.01"
                    tooltip="Tax percentage on provider's earnings"
                  />

                  <div className="form-group mb-4">
                    <Label className="block text-sm font-medium text-gray-700 mb-2">Is Zone Pricing</Label>
                    <Select
                      value={formData.is_zone ? "1" : "0"}
                      onValueChange={(v) => setFormData({...formData, is_zone: v === "1"})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">ON</SelectItem>
                        <SelectItem value="0">OFF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="form-group mb-4">
                    <Label className="block text-sm font-medium text-gray-700 mb-2">Is Surge Hours</Label>
                    <Select
                      value={formData.is_surge_hours ? "1" : "0"}
                      onValueChange={(v) => setFormData({...formData, is_surge_hours: v === "1"})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">ON</SelectItem>
                        <SelectItem value="0">OFF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* TAB 2: ZONE & SURGE PRICING */}
            <TabsContent value="zone" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Zone to Zone Pricing</h3>
                <p className="text-sm text-gray-600">Zone-based pricing configuration will be available here</p>
              </Card>
            </TabsContent>

            {/* TAB 3: SURGE HOURS */}
            <TabsContent value="surge-hours" className="space-y-6">
              {formData.is_surge_hours ? (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Surge Time Configuration</h3>
                  
                  <Tabs value={currentDay.toString()} onValueChange={(v) => setCurrentDay(parseInt(v))}>
                    <TabsList className="grid grid-cols-7 mb-6">
                      {surgeHours.map((day, idx) => (
                        <TabsTrigger key={idx} value={idx.toString()}>
                          {day.dayName}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {surgeHours.map((day, dayIdx) => (
                      <TabsContent key={dayIdx} value={dayIdx.toString()} className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={day.is_surge}
                              onCheckedChange={() => toggleDaySurge(dayIdx)}
                            />
                            <Label>Enable surge for {day.dayName}</Label>
                          </div>
                          
                          {day.is_surge && (
                            <Button
                              type="button"
                              size="sm"
                              onClick={handleAddSurgeTime}
                              className="bg-[#15B46A]"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Time
                            </Button>
                          )}
                        </div>

                        {day.is_surge && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-4 gap-4">
                              <div>
                                <Label>Start Time</Label>
                                <Input
                                  type="time"
                                  value={newSurge.start_time}
                                  onChange={(e) => setNewSurge({...newSurge, start_time: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label>End Time</Label>
                                <Input
                                  type="time"
                                  value={newSurge.end_time}
                                  onChange={(e) => setNewSurge({...newSurge, end_time: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label>Multiplier</Label>
                                <Input
                                  type="number"
                                  step="0.1"
                                  value={newSurge.multiplier}
                                  onChange={(e) => setNewSurge({...newSurge, multiplier: parseFloat(e.target.value)})}
                                />
                              </div>
                              <div className="flex items-end">
                                <Button
                                  type="button"
                                  onClick={handleAddSurgeTime}
                                  className="w-full bg-[#15B46A]"
                                >
                                  Add
                                </Button>
                              </div>
                            </div>

                            {day.times.length > 0 && (
                              <div className="border rounded-lg">
                                <table className="w-full">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="text-left p-3 font-semibold">Start Time</th>
                                      <th className="text-left p-3 font-semibold">End Time</th>
                                      <th className="text-left p-3 font-semibold">Multiplier</th>
                                      <th className="w-16"></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {day.times.map((time, timeIdx) => (
                                      <tr key={timeIdx} className="border-t">
                                        <td className="p-3">{time.start_time}</td>
                                        <td className="p-3">{time.end_time}</td>
                                        <td className="p-3">{time.multiplier}x</td>
                                        <td className="p-3">
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveSurgeTime(dayIdx, timeIdx)}
                                          >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                          </Button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        )}
                      </TabsContent>
                    ))}
                  </Tabs>
                </Card>
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-gray-500">Enable &ldquo;Is Surge Hours&rdquo; in Basic Configuration to set surge pricing times</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Submit Button */}
          <div className="flex justify-center gap-3 pt-6 mt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="px-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#15B46A] hover:bg-[#0F9456] px-8"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Submit
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Add City Type Price Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="basic">Basic Configuration</TabsTrigger>
              <TabsTrigger value="zone">Zone & Surge Pricing</TabsTrigger>
              <TabsTrigger value="surge-hours">Surge Hours</TabsTrigger>
            </TabsList>

            {/* TAB 1: BASIC CONFIGURATION */}
            <TabsContent value="basic" className="space-y-6">
              {/* Country, City, Type Selection */}
              <Card className="p-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label className="mb-2 block">Country<span className="text-red-500">*</span></Label>
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(c => (
                          <SelectItem key={String(c.id || c._id)} value={String(c.id || c._id)}>
                            {c.name || c.countryname || 'Unnamed Country'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="mb-2 block">City<span className="text-red-500">*</span></Label>
                    <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedCountry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="mb-2 block">Service Type<span className="text-red-500">*</span></Label>
                    <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map(s => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              {/* Pricing Fields - 2 Columns */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* LEFT COLUMN */}
                <Card className="p-4 space-y-4">
                  <TooltipField
                    label="Max Space"
                    value={formData.max_space}
                    onChange={(e) => setFormData({...formData, max_space: parseInt(e.target.value) || 0})}
                    type="number"
                    tooltip="Maximum number of passengers allowed"
                  />

                  <TooltipField
                    label="Provider Profit (%)"
                    value={formData.provider_profit}
                    onChange={(e) => setFormData({...formData, provider_profit: parseFloat(e.target.value) || 0})}
                    type="number"
                    step="0.01"
                    tooltip="Percentage of fare that goes to the provider/driver"
                  />

                  <TooltipField
                    label="Min Fare"
                    value={formData.min_fare}
                    onChange={(e) => setFormData({...formData, min_fare: parseFloat(e.target.value) || 0})}
                    type="number"
                    step="0.01"
                    tooltip="Minimum fare charged for any ride"
                  />

                  <div className="form-group mb-4">
                    <Label className="block text-sm font-medium text-gray-700 mb-2">Distance for Base Price (km)</Label>
                    <Select
                      value={formData.base_price_distance.toString()}
                      onValueChange={(v) => setFormData({...formData, base_price_distance: parseInt(v)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(26)].map((_, i) => (
                          <SelectItem key={i} value={i.toString()}>{i} km</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <TooltipField
                    label="Base Price"
                    value={formData.base_price}
                    onChange={(e) => setFormData({...formData, base_price: parseFloat(e.target.value) || 0})}
                    type="number"
                    step="0.01"
                    tooltip="Starting price for the ride"
                  />

                  <TooltipField
                    label="Price Per Unit Distance"
                    value={formData.price_per_unit_distance}
                    onChange={(e) => setFormData({...formData, price_per_unit_distance: parseFloat(e.target.value) || 0})}
                    type="number"
                    step="0.01"
                    tooltip="Price charged per kilometer/mile"
                  />

                  <TooltipField
                    label="Price Per Unit Time (min)"
                    value={formData.price_per_unit_time}
                    onChange={(e) => setFormData({...formData, price_per_unit_time: parseFloat(e.target.value) || 0})}
                    type="number"
                    step="0.01"
                    tooltip="Price charged per minute of ride duration"
                  />

                  <TooltipField
                    label="Waiting Time Start After (minutes)"
                    value={formData.waiting_time_start_after_minute}
                    onChange={(e) => setFormData({...formData, waiting_time_start_after_minute: parseInt(e.target.value) || 0})}
                    type="number"
                    tooltip="Free waiting time in minutes before charges apply"
                  />

                  <TooltipField
                    label="Price For Waiting Time"
                    value={formData.price_for_waiting_time}
                    onChange={(e) => setFormData({...formData, price_for_waiting_time: parseFloat(e.target.value) || 0})}
                    type="number"
                    step="0.001"
                    tooltip="Price per minute after free waiting time"
                  />

                  <div className="form-group mb-4">
                    <Label className="block text-sm font-medium text-gray-700 mb-2">Car Rental Business</Label>
                    <Select
                      value={formData.is_car_rental_business ? "1" : "0"}
                      onValueChange={(v) => setFormData({...formData, is_car_rental_business: v === "1"})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">ON</SelectItem>
                        <SelectItem value="0">OFF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Card>

                {/* RIGHT COLUMN */}
                <Card className="p-4 space-y-4">
                  <div className="form-group mb-4">
                    <Label className="block text-sm font-medium text-gray-700 mb-2">Business Status</Label>
                    <Select
                      value={formData.business_status ? "1" : "0"}
                      onValueChange={(v) => setFormData({...formData, business_status: v === "1"})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">ON</SelectItem>
                        <SelectItem value="0">OFF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <TooltipField
                    label="Cancellation Fee"
                    value={formData.cancellation_fee}
                    onChange={(e) => setFormData({...formData, cancellation_fee: parseFloat(e.target.value) || 0})}
                    type="number"
                    step="0.01"
                    tooltip="Fee charged when a ride is cancelled"
                  />

                  <TooltipField
                    label="Tax (%)"
                    value={formData.tax}
                    onChange={(e) => setFormData({...formData, tax: parseFloat(e.target.value) || 0})}
                    type="number"
                    step="0.01"
                    tooltip="Tax percentage applied to the fare"
                  />

                  <TooltipField
                    label="User Miscellaneous Fee"
                    value={formData.user_miscellaneous_fee}
                    onChange={(e) => setFormData({...formData, user_miscellaneous_fee: parseFloat(e.target.value) || 0})}
                    type="number"
                    step="0.01"
                    tooltip="Additional fees charged to the user"
                  />

                  <TooltipField
                    label="User Tax (%)"
                    value={formData.user_tax}
                    onChange={(e) => setFormData({...formData, user_tax: parseFloat(e.target.value) || 0})}
                    type="number"
                    step="0.01"
                    tooltip="Tax percentage on user's total"
                  />

                  <TooltipField
                    label="Provider Miscellaneous Fee"
                    value={formData.provider_miscellaneous_fee}
                    onChange={(e) => setFormData({...formData, provider_miscellaneous_fee: parseFloat(e.target.value) || 0})}
                    type="number"
                    step="0.01"
                    tooltip="Additional fees charged to provider"
                  />

                  <TooltipField
                    label="Provider Tax (%)"
                    value={formData.provider_tax}
                    onChange={(e) => setFormData({...formData, provider_tax: parseFloat(e.target.value) || 0})}
                    type="number"
                    step="0.01"
                    tooltip="Tax percentage on provider's earnings"
                  />

                  <div className="form-group mb-4">
                    <Label className="block text-sm font-medium text-gray-700 mb-2">Is Zone Pricing</Label>
                    <Select
                      value={formData.is_zone ? "1" : "0"}
                      onValueChange={(v) => setFormData({...formData, is_zone: v === "1"})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">ON</SelectItem>
                        <SelectItem value="0">OFF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="form-group mb-4">
                    <Label className="block text-sm font-medium text-gray-700 mb-2">Is Surge Hours</Label>
                    <Select
                      value={formData.is_surge_hours ? "1" : "0"}
                      onValueChange={(v) => setFormData({...formData, is_surge_hours: v === "1"})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">ON</SelectItem>
                        <SelectItem value="0">OFF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* TAB 2: ZONE & SURGE PRICING */}
            <TabsContent value="zone" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Zone to Zone Pricing</h3>
                <p className="text-sm text-gray-600 mb-4">Configure pricing rules for different zones within the city</p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500">Zone pricing configuration coming soon</p>
                </div>
              </Card>
            </TabsContent>

            {/* TAB 3: SURGE HOURS */}
            <TabsContent value="surge-hours" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Surge Hours Configuration</h3>
                
                {/* Day Selection */}
                <div className="mb-6">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Select Day</Label>
                  <Select value={currentDay.toString()} onValueChange={(v) => setCurrentDay(parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {surgeHours.map((day, index) => (
                        <SelectItem key={index} value={index.toString()}>{day.dayName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Enable Surge for Day */}
                <div className="flex items-center justify-between mb-6">
                  <Label className="text-sm font-medium text-gray-700">Enable Surge Pricing for {surgeHours[currentDay].dayName}</Label>
                  <Switch
                    checked={surgeHours[currentDay].is_surge}
                    onCheckedChange={() => toggleDaySurge(currentDay)}
                  />
                </div>

                {/* Add Surge Time */}
                {surgeHours[currentDay].is_surge && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Add Surge Time</h4>
                    <div className="grid md:grid-cols-4 gap-3">
                      <Input
                        type="time"
                        value={newSurge.start_time}
                        onChange={(e) => setNewSurge({...newSurge, start_time: e.target.value})}
                        placeholder="Start Time"
                      />
                      <Input
                        type="time"
                        value={newSurge.end_time}
                        onChange={(e) => setNewSurge({...newSurge, end_time: e.target.value})}
                        placeholder="End Time"
                      />
                      <Input
                        type="number"
                        value={newSurge.multiplier}
                        onChange={(e) => setNewSurge({...newSurge, multiplier: parseFloat(e.target.value) || 1})}
                        placeholder="Multiplier"
                        step="0.1"
                        min="1"
                      />
                      <Button
                        type="button"
                        onClick={handleAddSurgeTime}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                )}

                {/* Surge Times List */}
                {surgeHours[currentDay].is_surge && surgeHours[currentDay].times.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Surge Times for {surgeHours[currentDay].dayName}</h4>
                    {surgeHours[currentDay].times.map((time, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm">
                          <span className="font-medium">{time.start_time} - {time.end_time}</span>
                          <span className="ml-2 text-gray-600">({time.multiplier}x multiplier)</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSurgeTime(currentDay, index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {surgeHours[currentDay].is_surge && surgeHours[currentDay].times.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No surge times configured for this day</p>
                )}
              </Card>
            </TabsContent>
          </Tabs>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Price Configuration
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
