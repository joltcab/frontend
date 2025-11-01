
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Car, Save, Loader2, Plus, Trash2, Settings, Map } from "lucide-react";
import ZoneDrawer from "../maps/ZoneDrawer";
import AIPricingToggle from "./AIPricingToggle";

export default function TypeCityAssociation() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [showPriceConfig, setShowPriceConfig] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  
  // Price configuration form data
  const [priceFormData, setPriceFormData] = useState({
    provider_profit: 85,
    min_fare: 1.75,
    distance_for_base_price: 0,
    base_price: 6,
    price_per_unit_distance: 1.75,
    price_per_unit_time: 0.25,
    waiting_time_start_after_minute: 5,
    price_for_waiting_time: 0.005,
    max_space: 4,
    car_rental_business: false,
    business_status: true,
    cancellation_fee: 4.5,
    tax: 0,
    user_miscellaneous_fee: 0,
    user_tax: 0,
    provider_miscellaneous_fee: 0,
    provider_tax: 0,
    is_zone: false,
    is_surge_hours: false,
    distance_unit: 'km', // NEW: km or miles
    ai_pricing_enabled: false, // NEW: AI Pricing toggle
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

  const [newSurge, setNewSurge] = useState({
    start_time: '',
    end_time: '',
    multiplier: 1.5
  });

  // Zone to Zone prices
  const [zoneToZonePrices, setZoneToZonePrices] = useState([]);
  const [newZonePrice, setNewZonePrice] = useState({
    from_zone_id: '',
    to_zone_id: '',
    amount: 0
  });

  // Airport to City prices
  const [airportToCityPrices, setAirportToCityPrices] = useState([]);
  const [newAirportPrice, setNewAirportPrice] = useState({
    from_zone_id: '',
    to_city_id: '',
    amount: 0
  });

  // City to City prices
  const [cityToCityPrices, setCityToCityPrices] = useState([]);
  const [newCityPrice, setNewCityPrice] = useState({
    from_city_id: '',
    to_city_id: '',
    amount: 0
  });

  // Car Rental packages
  const [rentalPackages, setRentalPackages] = useState([]);
  const [newPackage, setNewPackage] = useState({
    package_name: '',
    distance_for_base_price: 0,
    time_for_base_price: 0,
    base_price: 0,
    price_per_unit_distance: 0,
    price_per_unit_time: 0,
    business_status: true
  });

  // Rich Area surge
  const [richAreaSurge, setRichAreaSurge] = useState([]);
  const [newRichSurge, setNewRichSurge] = useState({
    zone_id: '',
    surge_multiplier: 1.5
  });
  
  const queryClient = useQueryClient();

  // Fetch data
  const { data: cities = [], isLoading: citiesLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const result = await base44.entities.City.list();
      return result;
    },
  });

  const { data: serviceTypes = [], isLoading: typesLoading } = useQuery({
    queryKey: ['service-types'],
    queryFn: async () => {
      const result = await base44.entities.ServiceType.list();
      return result;
    }
  });

  const { data: priceConfigs = [], isLoading: configsLoading } = useQuery({
    queryKey: ['price-configurations'],
    queryFn: async () => {
      const result = await base44.entities.PriceConfiguration.list();
      
      // Remove duplicates based on unique combination of city_id + service_type_id
      const uniqueConfigs = [];
      const seenCombinations = new Set();
      
      for (const config of result) {
        const key = `${config.city_id}-${config.service_type_id}`;
        if (!seenCombinations.has(key)) {
          seenCombinations.add(key);
          uniqueConfigs.push(config);
        }
      }
      
      console.log('💰 Unique Price Configs:', uniqueConfigs.length, 'out of', result.length);
      return uniqueConfigs;
    }
  });

  const { data: countries = [] } = useQuery({
    queryKey: ['countries'],
    queryFn: () => base44.countries.list(),
  });

  const { data: zones = [] } = useQuery({
    queryKey: ['zones', selectedCity],
    queryFn: () => base44.entities.Zone.filter({ city_id: selectedCity }),
    enabled: !!selectedCity,
  });

  // Load existing config when service type is selected
  useEffect(() => {
    if (selectedCity && selectedServiceType) {
      const existingConfig = priceConfigs.find(
        c => c.city_id === selectedCity && c.service_type_id === selectedServiceType
      );
      
      if (existingConfig) {
        setEditingConfig(existingConfig);
        setPriceFormData({
          provider_profit: existingConfig.provider_profit || 85,
          min_fare: existingConfig.min_fare || 1.75,
          distance_for_base_price: existingConfig.distance_for_base_price || 0,
          base_price: existingConfig.base_price || 6,
          price_per_unit_distance: existingConfig.price_per_unit_distance || 1.75,
          price_per_unit_time: existingConfig.price_per_unit_time || 0.25,
          waiting_time_start_after_minute: existingConfig.waiting_time_start_after_minute || 5,
          price_for_waiting_time: existingConfig.price_for_waiting_time || 0.005,
          max_space: existingConfig.max_space || 4,
          car_rental_business: existingConfig.car_rental_business || false,
          business_status: existingConfig.business_status !== false,
          cancellation_fee: existingConfig.cancellation_fee || 4.5,
          tax: existingConfig.tax || 0,
          user_miscellaneous_fee: existingConfig.user_miscellaneous_fee || 0,
          user_tax: existingConfig.user_tax || 0,
          provider_miscellaneous_fee: existingConfig.provider_miscellaneous_fee || 0,
          provider_tax: existingConfig.provider_tax || 0,
          is_zone: existingConfig.is_zone || false,
          is_surge_hours: existingConfig.is_surge_hours || false,
          distance_unit: existingConfig.distance_unit || 'km', // NEW
          ai_pricing_enabled: existingConfig.ai_pricing_enabled || false, // NEW
        });
        
        if (existingConfig.surge_times && Array.isArray(existingConfig.surge_times)) {
          const updatedSurgeHours = [...surgeHours];
          existingConfig.surge_times.forEach(st => {
            const dayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(st.day);
            if (dayIndex !== -1) {
              updatedSurgeHours[dayIndex].is_surge = true;
              updatedSurgeHours[dayIndex].times = st.times || [];
            }
          });
          setSurgeHours(updatedSurgeHours);
        } else {
          setSurgeHours([
            { day: 0, dayName: 'Sun', is_surge: false, times: [] },
            { day: 1, dayName: 'Mon', is_surge: false, times: [] },
            { day: 2, dayName: 'Tue', is_surge: false, times: [] },
            { day: 3, dayName: 'Wed', is_surge: false, times: [] },
            { day: 4, dayName: 'Thu', is_surge: false, times: [] },
            { day: 5, dayName: 'Fri', is_surge: false, times: [] },
            { day: 6, dayName: 'Sat', is_surge: false, times: [] },
          ]);
        }


        setZoneToZonePrices(existingConfig.zone_to_zone_prices || []);
        setAirportToCityPrices(existingConfig.airport_to_city_prices || []);
        setCityToCityPrices(existingConfig.city_to_city_prices || []);
        setRentalPackages(existingConfig.rental_packages || []);
        setRichAreaSurge(existingConfig.rich_area_surge || []);
      } else {
        resetFormData();
      }
      setSaveMessage({ type: '', text: '' }); // Clear any previous messages when selecting new config
    }
  }, [selectedCity, selectedServiceType, priceConfigs]);

  const resetFormData = () => {
    setEditingConfig(null);
    setPriceFormData({
      provider_profit: 85,
      min_fare: 1.75,
      distance_for_base_price: 0,
      base_price: 6,
      price_per_unit_distance: 1.75,
      price_per_unit_time: 0.25,
      waiting_time_start_after_minute: 5,
      price_for_waiting_time: 0.005,
      max_space: 4,
      car_rental_business: false,
      business_status: true,
      cancellation_fee: 4.5,
      tax: 0,
      user_miscellaneous_fee: 0,
      user_tax: 0,
      provider_miscellaneous_fee: 0,
      provider_tax: 0,
      is_zone: false,
      is_surge_hours: false,
      distance_unit: 'km', // NEW
      ai_pricing_enabled: false, // NEW
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
    setZoneToZonePrices([]);
    setAirportToCityPrices([]);
    setCityToCityPrices([]);
    setRentalPackages([]);
    setRichAreaSurge([]);
  };

  // Save mutation - COMPLETELY FIXED
  const saveMutation = useMutation({
    mutationFn: async () => {
      console.log('💾 [TypeCity] Starting save mutation...');
      
      if (!selectedCity || !selectedServiceType) {
        throw new Error('Please select city and service type');
      }

      const city = cities.find(c => c.id === selectedCity);
      if (!city) throw new Error('City not found');

      const dataToSubmit = {
        ...priceFormData,
        service_type_id: selectedServiceType,
        country_id: city.country_id,
        city_id: selectedCity,
        surge_times: priceFormData.is_surge_hours ? surgeHours
          .filter(day => day.is_surge && day.times.length > 0)
          .map(day => ({
            day: day.dayName,
            times: day.times
          })) : [],
        zone_to_zone_prices: priceFormData.is_zone ? zoneToZonePrices : [],
        airport_to_city_prices: priceFormData.is_zone ? airportToCityPrices : [],
        city_to_city_prices: cityToCityPrices,
        rental_packages: priceFormData.car_rental_business ? rentalPackages : [],
        rich_area_surge: richAreaSurge,
      };

      console.log('📤 [TypeCity] Data to submit:', dataToSubmit);

      if (editingConfig) {
        console.log('✏️ [TypeCity] Updating config ID:', editingConfig.id);
        const result = await base44.entities.PriceConfiguration.update(editingConfig.id, dataToSubmit);
        console.log('✅ [TypeCity] Update result:', result);
        return result;
      } else {
        console.log('➕ [TypeCity] Creating new config');
        const result = await base44.entities.PriceConfiguration.create(dataToSubmit);
        console.log('✅ [TypeCity] Create result:', result);
        return result;
      }
    },
    onSuccess: (data) => {
      console.log('🎉 [TypeCity] Save successful!', data);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['price-configurations'] });
      
      // Show success message
      setSaveMessage({ 
        type: 'success', 
        text: editingConfig ? '✓ Configuration updated successfully!' : '✓ Configuration created successfully!' 
      });
      
      // Wait 2 seconds, then navigate back
      setTimeout(() => {
        setSaveMessage({ type: '', text: '' });
        setShowPriceConfig(false);
        setSelectedCity("");
        setSelectedServiceType("");
        resetFormData();
      }, 2000);
    },
    onError: (error) => {
      console.error('❌ [TypeCity] Save failed:', error);
      setSaveMessage({ 
        type: 'error', 
        text: `❌ Error: ${error.message}` 
      });
      
      // Clear error after 5 seconds
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 5000);
    }
  });

  const handleAddSurgeTime = () => {
    if (!newSurge.start_time || !newSurge.end_time || !newSurge.multiplier) {
      setSaveMessage({ type: 'error', text: '⚠️ Please fill all surge time fields' });
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
      return;
    }

    const activeDayIndex = surgeHours.findIndex(d => d.is_surge);
    if (activeDayIndex === -1) {
      setSaveMessage({ type: 'error', text: '⚠️ Please select at least one day for surge hours' });
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
      return;
    }

    const updatedSurgeHours = [...surgeHours];
    updatedSurgeHours[activeDayIndex].times.push({ ...newSurge });
    setSurgeHours(updatedSurgeHours);
    
    setNewSurge({ start_time: '', end_time: '', multiplier: 1.5 });
    setSaveMessage({ type: '', text: '' }); // Clear any previous errors
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

  const handleAddZonePrice = () => {
    if (!newZonePrice.from_zone_id || !newZonePrice.to_zone_id || newZonePrice.amount === 0) {
      setSaveMessage({ type: 'error', text: '⚠️ Please fill all zone to zone price fields' });
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
      return;
    }
    setZoneToZonePrices([...zoneToZonePrices, { ...newZonePrice }]);
    setNewZonePrice({ from_zone_id: '', to_zone_id: '', amount: 0 });
    setSaveMessage({ type: '', text: '' });
  };

  const handleRemoveZonePrice = (index) => {
    const updated = [...zoneToZonePrices];
    updated.splice(index, 1);
    setZoneToZonePrices(updated);
  };

  const handleAddAirportPrice = () => {
    if (!newAirportPrice.from_zone_id || !newAirportPrice.to_city_id || newAirportPrice.amount === 0) {
      setSaveMessage({ type: 'error', text: '⚠️ Please fill all airport to city price fields' });
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
      return;
    }
    setAirportToCityPrices([...airportToCityPrices, { ...newAirportPrice }]);
    setNewAirportPrice({ from_zone_id: '', to_city_id: '', amount: 0 });
    setSaveMessage({ type: '', text: '' });
  };

  const handleRemoveAirportPrice = (index) => {
    const updated = [...airportToCityPrices];
    updated.splice(index, 1);
    setAirportToCityPrices(updated);
  };

  const handleAddCityPrice = () => {
    if (!newCityPrice.from_city_id || !newCityPrice.to_city_id || newCityPrice.amount === 0) {
      setSaveMessage({ type: 'error', text: '⚠️ Please fill all city to city price fields' });
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
      return;
    }
    setCityToCityPrices([...cityToCityPrices, { ...newCityPrice }]);
    setNewCityPrice({ from_city_id: '', to_city_id: '', amount: 0 });
    setSaveMessage({ type: '', text: '' });
  };

  const handleRemoveCityPrice = (index) => {
    const updated = [...cityToCityPrices];
    updated.splice(index, 1);
    setCityToCityPrices(updated);
  };

  const handleAddRentalPackage = () => {
    if (!newPackage.package_name || newPackage.base_price === 0) {
      setSaveMessage({ type: 'error', text: '⚠️ Please fill package name and base price' });
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
      return;
    }
    setRentalPackages([...rentalPackages, { ...newPackage }]);
    setNewPackage({
      package_name: '',
      distance_for_base_price: 0,
      time_for_base_price: 0,
      base_price: 0,
      price_per_unit_distance: 0,
      price_per_unit_time: 0,
      business_status: true
    });
    setSaveMessage({ type: '', text: '' });
  };

  const handleRemoveRentalPackage = (index) => {
    const updated = [...rentalPackages];
    updated.splice(index, 1);
    setRentalPackages(updated);
  };

  const handleAddRichAreaSurge = () => {
    if (!newRichSurge.zone_id || !newRichSurge.surge_multiplier || newRichSurge.surge_multiplier <= 1) {
      setSaveMessage({ type: 'error', text: '⚠️ Please select a zone and provide a surge multiplier greater than 1' });
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
      return;
    }
    setRichAreaSurge([...richAreaSurge, { ...newRichSurge }]);
    setNewRichSurge({ zone_id: '', surge_multiplier: 1.5 });
    setSaveMessage({ type: '', text: '' });
  };

  const handleRemoveRichAreaSurge = (index) => {
    const updated = [...richAreaSurge];
    updated.splice(index, 1);
    setRichAreaSurge(updated);
  };

  const isLoading = citiesLoading || typesLoading || configsLoading;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#15B46A]" />
        </CardContent>
      </Card>
    );
  }

  // If price config form is shown
  if (showPriceConfig && selectedCity && selectedServiceType) {
    const selectedCityData = cities.find(c => c.id === selectedCity);
    const selectedServiceTypeData = serviceTypes.find(s => s.id === selectedServiceType);
    const selectedCountryData = countries.find(c => c.id === selectedCityData?.country_id);

    return (
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Settings className="w-5 h-5 text-[#15B46A]" />
              {editingConfig ? 'Edit' : 'Add'} Price Configuration
            </CardTitle>
            <Button variant="outline" onClick={() => {
              setShowPriceConfig(false);
              setSaveMessage({ type: '', text: '' });
            }}>
              ← Back to List
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Success/Error Message - INLINE */}
          {saveMessage.text && (
            <div className={`mb-6 p-4 rounded-lg ${
              saveMessage.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200' 
                : 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
            }`}>
              <div className="flex items-center gap-2">
                {saveMessage.type === 'success' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>
                )}
                <p className="font-semibold">{saveMessage.text}</p>
              </div>
            </div>
          )}

          <Tabs defaultValue="add-city-type" className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-6">
              <TabsTrigger value="add-city-type">Add City Type</TabsTrigger>
              <TabsTrigger value="zone-to-zone">Zone to Zone Price</TabsTrigger>
              <TabsTrigger value="airport-to-city">Airport to City Price</TabsTrigger>
              <TabsTrigger value="city-to-city">City to City Price</TabsTrigger>
              <TabsTrigger value="car-rental">Car Rental Price</TabsTrigger>
              <TabsTrigger value="rich-area">Rich Area Surge</TabsTrigger>
            </TabsList>

            {/* TAB 1: ADD CITY TYPE */}
            <TabsContent value="add-city-type" className="space-y-6">
              {/* Country, City, Type Display (Read-only) */}
              <Card className="p-4 bg-gray-50 dark:bg-gray-800">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-gray-600 dark:text-gray-400 mb-1 block text-sm">Country</Label>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedCountryData?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 dark:text-gray-400 mb-1 block text-sm">City</Label>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedCityData?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 dark:text-gray-400 mb-1 block text-sm">Type</Label>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedServiceTypeData?.name || 'N/A'}</p>
                  </div>
                </div>
              </Card>

              {/* Distance Unit Selector - NEW */}
              <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-semibold text-blue-900 dark:text-blue-100">Distance Unit</Label>
                    <p className="text-xs text-blue-700 dark:text-blue-300">Select whether to use kilometers or miles for distance calculations</p>
                  </div>
                  <Select
                    value={priceFormData.distance_unit}
                    onValueChange={(v) => setPriceFormData({...priceFormData, distance_unit: v})}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="km">Kilometers (km)</SelectItem>
                      <SelectItem value="miles">Miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>

              {/* AI Pricing Toggle - NEW */}
              <AIPricingToggle
                enabled={priceFormData.ai_pricing_enabled}
                onToggle={(checked) => setPriceFormData({...priceFormData, ai_pricing_enabled: checked})}
              />

              {/* Pricing Fields - 2 Columns */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* LEFT COLUMN */}
                <div className="space-y-4">
                  <div>
                    <Label>Provider Profit <span className="text-red-500">*</span> (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={priceFormData.provider_profit}
                      onChange={(e) => setPriceFormData({...priceFormData, provider_profit: parseFloat(e.target.value) || 0})}
                    />
                  </div>

                  <div>
                    <Label>Min. Fare <span className="text-red-500">*</span></Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={priceFormData.min_fare}
                      onChange={(e) => setPriceFormData({...priceFormData, min_fare: parseFloat(e.target.value) || 0})}
                    />
                  </div>

                  <div>
                    <Label>Distance for Base Price <span className="text-red-500">*</span> ({priceFormData.distance_unit})</Label>
                    <Select
                      value={priceFormData.distance_for_base_price.toString()}
                      onValueChange={(v) => setPriceFormData({...priceFormData, distance_for_base_price: parseInt(v)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(26)].map((_, i) => (
                          <SelectItem key={i} value={i.toString()}>{i} {priceFormData.distance_unit}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Base Price <span className="text-red-500">*</span></Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={priceFormData.base_price}
                      onChange={(e) => setPriceFormData({...priceFormData, base_price: parseFloat(e.target.value) || 0})}
                    />
                  </div>

                  <div>
                    <Label>Price Per Unit Distance <span className="text-red-500">*</span> (per {priceFormData.distance_unit})</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={priceFormData.price_per_unit_distance}
                      onChange={(e) => setPriceFormData({...priceFormData, price_per_unit_distance: parseFloat(e.target.value) || 0})}
                    />
                  </div>

                  <div>
                    <Label>Price Per Unit Time <span className="text-red-500">*</span> (min)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={priceFormData.price_per_unit_time}
                      onChange={(e) => setPriceFormData({...priceFormData, price_per_unit_time: parseFloat(e.target.value) || 0})}
                    />
                  </div>

                  <div>
                    <Label>Waiting Time Start After Minute <span className="text-red-500">*</span></Label>
                    <Input
                      type="number"
                      value={priceFormData.waiting_time_start_after_minute}
                      onChange={(e) => setPriceFormData({...priceFormData, waiting_time_start_after_minute: parseInt(e.target.value) || 0})}
                    />
                  </div>

                  <div>
                    <Label>Price For Waiting Time <span className="text-red-500">*</span></Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={priceFormData.price_for_waiting_time}
                      onChange={(e) => setPriceFormData({...priceFormData, price_for_waiting_time: parseFloat(e.target.value) || 0})}
                    />
                  </div>

                  <div>
                    <Label>Max Space <span className="text-red-500">*</span></Label>
                    <Input
                      type="number"
                      value={priceFormData.max_space}
                      onChange={(e) => setPriceFormData({...priceFormData, max_space: parseInt(e.target.value) || 0})}
                    />
                  </div>

                  <div>
                    <Label className="block mb-2">Car Rental Business</Label>
                    <Select
                      value={priceFormData.car_rental_business ? "1" : "0"}
                      onValueChange={(v) => setPriceFormData({...priceFormData, car_rental_business: v === "1"})}
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
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-4">
                  <div>
                    <Label className="block mb-2">Business <span className="text-red-500">*</span></Label>
                    <Select
                      value={priceFormData.business_status ? "1" : "0"}
                      onValueChange={(v) => setPriceFormData({...priceFormData, business_status: v === "1"})}
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

                  <div>
                    <Label>Cancellation Fee</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={priceFormData.cancellation_fee}
                      onChange={(e) => setPriceFormData({...priceFormData, cancellation_fee: parseFloat(e.target.value) || 0})}
                    />
                  </div>

                  <div>
                    <Label>Tax</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={priceFormData.tax}
                      onChange={(e) => setPriceFormData({...priceFormData, tax: parseFloat(e.target.value) || 0})}
                    />
                  </div>

                  <div>
                    <Label>User Miscellaneous Fee</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={priceFormData.user_miscellaneous_fee}
                      onChange={(e) => setPriceFormData({...priceFormData, user_miscellaneous_fee: parseFloat(e.target.value) || 0})}
                    />
                  </div>

                  <div>
                    <Label>User Tax</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={priceFormData.user_tax}
                      onChange={(e) => setPriceFormData({...priceFormData, user_tax: parseFloat(e.target.value) || 0})}
                    />
                  </div>

                  <div>
                    <Label>Provider Miscellaneous Fee</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={priceFormData.provider_miscellaneous_fee}
                      onChange={(e) => setPriceFormData({...priceFormData, provider_miscellaneous_fee: parseFloat(e.target.value) || 0})}
                    />
                  </div>

                  <div>
                    <Label>Provider Tax</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={priceFormData.provider_tax}
                      onChange={(e) => setPriceFormData({...priceFormData, provider_tax: parseFloat(e.target.value) || 0})}
                    />
                  </div>

                  <div>
                    <Label className="block mb-2">Is Zone</Label>
                    <Select
                      value={priceFormData.is_zone ? "1" : "0"}
                      onValueChange={(v) => setPriceFormData({...priceFormData, is_zone: v === "1"})}
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

                  <div>
                    <Label className="block mb-2">Is Surge Hours</Label>
                    <Select
                      value={priceFormData.is_surge_hours ? "1" : "0"}
                      onValueChange={(v) => setPriceFormData({...priceFormData, is_surge_hours: v === "1"})}
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
                </div>
              </div>

              {/* SURGE TIME CONFIGURATION */}
              {priceFormData.is_surge_hours && (
                <Card className="p-6 mt-6 dark:bg-gray-800">
                  <h3 className="text-lg font-semibold mb-4">Surge Time</h3>
                  
                  {/* Days checkboxes */}
                  <div className="grid grid-cols-7 gap-2 mb-6">
                    {surgeHours.map((day, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 p-2 border rounded-lg dark:border-gray-700">
                        <Label className="text-sm font-semibold">{day.dayName}</Label>
                        <Checkbox
                          checked={day.is_surge}
                          onCheckedChange={() => toggleDaySurge(idx)}
                        />
                        {day.is_surge && day.times.length > 0 && (
                          <Badge variant="secondary" className="text-xs">{day.times.length}</Badge>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Surge times table */}
                  {surgeHours.some(d => d.is_surge) && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">Add Surge Times</p>
                        <div className="grid grid-cols-4 gap-4 mt-3">
                          <div>
                            <Label className="text-xs">Surge Start Time</Label>
                            <Input
                              type="time"
                              value={newSurge.start_time}
                              onChange={(e) => setNewSurge({...newSurge, start_time: e.target.value})}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Surge End Time</Label>
                            <Input
                              type="time"
                              value={newSurge.end_time}
                              onChange={(e) => setNewSurge({...newSurge, end_time: e.target.value})}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Surge Multiplier</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={newSurge.multiplier}
                              onChange={(e) => setNewSurge({...newSurge, multiplier: parseFloat(e.target.value) || 1.5})}
                              className="mt-1"
                            />
                          </div>
                          <div className="flex items-end">
                            <Button
                              type="button"
                              onClick={handleAddSurgeTime}
                              className="w-full bg-[#15B46A] hover:bg-[#0F9456]"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Display surge times by day */}
                      <div className="grid gap-3">
                        {surgeHours.filter(d => d.is_surge && d.times.length > 0).map((day, dayIdx) => (
                          <Card key={dayIdx} className="p-4 dark:bg-gray-800">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <span className="w-8 h-8 bg-[#15B46A] text-white rounded-full flex items-center justify-center text-sm">
                                {day.dayName.substring(0, 2)}
                              </span>
                              {day.dayName}
                            </h4>
                            <div className="border rounded-lg overflow-hidden dark:border-gray-700">
                              <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                  <tr>
                                    <th className="text-left p-3 text-sm font-semibold">Start Time</th>
                                    <th className="text-left p-3 text-sm font-semibold">End Time</th>
                                    <th className="text-left p-3 text-sm font-semibold">Multiplier</th>
                                    <th className="w-16"></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {day.times.map((time, timeIdx) => (
                                    <tr key={timeIdx} className="border-t dark:border-gray-700">
                                      <td className="p-3">{time.start_time}</td>
                                      <td className="p-3">
                                        {time.end_time}
                                      </td>
                                      <td className="p-3">
                                        <Badge variant="secondary">{time.multiplier}x</Badge>
                                      </td>
                                      <td className="p-3">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleRemoveSurgeTime(surgeHours.findIndex(d => d.dayName === day.dayName), timeIdx)}
                                        >
                                          <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              )}
            </TabsContent>

            {/* TAB 2: ZONE TO ZONE PRICE */}
            <TabsContent value="zone-to-zone" className="space-y-6">
              <Card className="p-6 dark:bg-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Map className="w-5 h-5 text-[#15B46A]" />
                      Zone to Zone Price
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Configure fixed prices between zones</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => window.open('/AdminZoneManagement', '_blank')}
                    className="gap-2"
                  >
                    <Map className="w-4 h-4" />
                    Manage Zones
                  </Button>
                </div>

                {zones.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <Map className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No zones found for this city</p>
                    <Button
                      onClick={() => window.open('/AdminZoneManagement', '_blank')}
                      className="bg-[#15B46A] hover:bg-[#0F9456]"
                    >
                      Create Zones First
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <Label>From Zone</Label>
                        <Select
                          value={newZonePrice.from_zone_id}
                          onValueChange={(v) => setNewZonePrice({...newZonePrice, from_zone_id: v})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select zone" />
                          </SelectTrigger>
                          <SelectContent>
                            {zones.map(zone => (
                              <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>To Zone</Label>
                        <Select
                          value={newZonePrice.to_zone_id}
                          onValueChange={(v) => setNewZonePrice({...newZonePrice, to_zone_id: v})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select zone" />
                          </SelectTrigger>
                          <SelectContent>
                            {zones.map(zone => (
                              <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Amount</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newZonePrice.amount}
                          onChange={(e) => setNewZonePrice({...newZonePrice, amount: parseFloat(e.target.value) || 0})}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button onClick={handleAddZonePrice} className="w-full bg-[#15B46A] hover:bg-[#0F9456]">
                          <Plus className="w-4 h-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </div>
                    
                    {zoneToZonePrices.length > 0 && (
                      <div className="border rounded-lg dark:border-gray-700 overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                              <th className="text-left p-3 font-semibold">From Zone</th>
                              <th className="text-left p-3 font-semibold">To Zone</th>
                              <th className="text-left p-3 font-semibold">Amount</th>
                              <th className="w-16"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {zoneToZonePrices.map((price, idx) => {
                              const fromZone = zones.find(z => z.id === price.from_zone_id);
                              const toZone = zones.find(z => z.id === price.to_zone_id);
                              return (
                                <tr key={idx} className="border-t dark:border-gray-700">
                                  <td className="p-3">{fromZone?.name || 'N/A'}</td>
                                  <td className="p-3">{toZone?.name || 'N/A'}</td>
                                  <td className="p-3">
                                    <Badge variant="secondary">${price.amount.toFixed(2)}</Badge>
                                  </td>
                                  <td className="p-3">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveZonePrice(idx)}
                                    >
                                      <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </Card>
            </TabsContent>

            {/* TAB 3: AIRPORT TO CITY PRICE */}
            <TabsContent value="airport-to-city" className="space-y-6">
              <Card className="p-6 dark:bg-gray-800">
                <h3 className="text-lg font-semibold mb-2">Airport to City Price</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Configure fixed prices from airport zones to other cities</p>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <Label>From Airport Zone</Label>
                    <Select
                      value={newAirportPrice.from_zone_id}
                      onValueChange={(v) => setNewAirportPrice({...newAirportPrice, from_zone_id: v})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select airport zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {zones.filter(z => z.is_airport).map(zone => (
                          <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>To City</Label>
                    <Select
                      value={newAirportPrice.to_city_id}
                      onValueChange={(v) => setNewAirportPrice({...newAirportPrice, to_city_id: v})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map(city => (
                          <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newAirportPrice.amount}
                      onChange={(e) => setNewAirportPrice({...newAirportPrice, amount: parseFloat(e.target.value) || 0})}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddAirportPrice} className="w-full bg-[#15B46A] hover:bg-[#0F9456]">
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>

                {airportToCityPrices.length > 0 && (
                  <div className="border rounded-lg dark:border-gray-700 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th className="text-left p-3">From Airport Zone</th>
                          <th className="text-left p-3">To City</th>
                          <th className="text-left p-3">Amount</th>
                          <th className="w-16"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {airportToCityPrices.map((price, idx) => {
                          const fromZone = zones.find(z => z.id === price.from_zone_id);
                          const toCity = cities.find(c => c.id === price.to_city_id);
                          return (
                            <tr key={idx} className="border-t dark:border-gray-700">
                              <td className="p-3">{fromZone?.name || 'N/A'}</td>
                              <td className="p-3">{toCity?.name || 'N/A'}</td>
                              <td className="p-3">
                                <Badge variant="secondary">${price.amount.toFixed(2)}</Badge>
                              </td>
                              <td className="p-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveAirportPrice(idx)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* TAB 4: CITY TO CITY PRICE */}
            <TabsContent value="city-to-city" className="space-y-6">
              <Card className="p-6 dark:bg-gray-800">
                <h3 className="text-lg font-semibold mb-2">City to City Price</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Configure fixed prices between different cities</p>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <Label>From City</Label>
                    <Select
                      value={newCityPrice.from_city_id}
                      onValueChange={(v) => setNewCityPrice({...newCityPrice, from_city_id: v})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map(city => (
                          <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>To City</Label>
                    <Select
                      value={newCityPrice.to_city_id}
                      onValueChange={(v) => setNewCityPrice({...newCityPrice, to_city_id: v})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map(city => (
                          <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newCityPrice.amount}
                      onChange={(e) => setNewCityPrice({...newCityPrice, amount: parseFloat(e.target.value) || 0})}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddCityPrice} className="w-full bg-[#15B46A] hover:bg-[#0F9456]">
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>

                {cityToCityPrices.length > 0 && (
                  <div className="border rounded-lg dark:border-gray-700 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th className="text-left p-3">From City</th>
                          <th className="text-left p-3">To City</th>
                          <th className="text-left p-3">Amount</th>
                          <th className="w-16"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cityToCityPrices.map((price, idx) => {
                          const fromCity = cities.find(c => c.id === price.from_city_id);
                          const toCity = cities.find(c => c.id === price.to_city_id);
                          return (
                            <tr key={idx} className="border-t dark:border-gray-700">
                              <td className="p-3">{fromCity?.name || 'N/A'}</td>
                              <td className="p-3">{toCity?.name || 'N/A'}</td>
                              <td className="p-3">
                                <Badge variant="secondary">${price.amount.toFixed(2)}</Badge>
                              </td>
                              <td className="p-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveCityPrice(idx)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* TAB 5: CAR RENTAL PRICE */}
            <TabsContent value="car-rental" className="space-y-6">
              <Card className="p-6 dark:bg-gray-800">
                <h3 className="text-lg font-semibold mb-2">Car Rental Price</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Configure rental packages with included distance, time, and prices</p>
                
                <div className="grid grid-cols-7 gap-3 mb-4">
                  <div>
                    <Label className="text-xs">Package Name</Label>
                    <Input
                      value={newPackage.package_name}
                      onChange={(e) => setNewPackage({...newPackage, package_name: e.target.value})}
                      placeholder="e.g., 2 Hours"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Distance ({priceFormData.distance_unit})</Label>
                    <Input
                      type="number"
                      value={newPackage.distance_for_base_price}
                      onChange={(e) => setNewPackage({...newPackage, distance_for_base_price: parseFloat(e.target.value) || 0})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Time (min)</Label>
                    <Input
                      type="number"
                      value={newPackage.time_for_base_price}
                      onChange={(e) => setNewPackage({...newPackage, time_for_base_price: parseFloat(e.target.value) || 0})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Base Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newPackage.base_price}
                      onChange={(e) => setNewPackage({...newPackage, base_price: parseFloat(e.target.value) || 0})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">$/{priceFormData.distance_unit} extra</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newPackage.price_per_unit_distance}
                      onChange={(e) => setNewPackage({...newPackage, price_per_unit_distance: parseFloat(e.target.value) || 0})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">$/min extra</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newPackage.price_per_unit_time}
                      onChange={(e) => setNewPackage({...newPackage, price_per_unit_time: parseFloat(e.target.value) || 0})}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddRentalPackage} className="w-full bg-[#15B46A] hover:bg-[#0F9456]">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {rentalPackages.length > 0 && (
                  <div className="border rounded-lg dark:border-gray-700 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th className="text-left p-3 text-sm">Package</th>
                          <th className="text-left p-3 text-sm">Distance</th>
                          <th className="text-left p-3 text-sm">Time</th>
                          <th className="text-left p-3 text-sm">Base Price</th>
                          <th className="text-left p-3 text-sm">$/{priceFormData.distance_unit}</th>
                          <th className="text-left p-3 text-sm">$/min</th>
                          <th className="w-16"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {rentalPackages.map((pkg, idx) => (
                          <tr key={idx} className="border-t dark:border-gray-700">
                            <td className="p-3 font-semibold">{pkg.package_name}</td>
                            <td className="p-3">{pkg.distance_for_base_price} {priceFormData.distance_unit}</td>
                            <td className="p-3">{pkg.time_for_base_price} min</td>
                            <td className="p-3">
                              <Badge variant="secondary">${pkg.base_price.toFixed(2)}</Badge>
                            </td>
                            <td className="p-3">${pkg.price_per_unit_distance.toFixed(2)}</td>
                            <td className="p-3">${pkg.price_per_unit_time.toFixed(2)}</td>
                            <td className="p-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveRentalPackage(idx)}
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
              </Card>
            </TabsContent>

            {/* TAB 6: RICH AREA SURGE */}
            <TabsContent value="rich-area" className="space-y-6">
              <Card className="p-6 dark:bg-gray-800">
                <h3 className="text-lg font-semibold mb-2">Rich Area Surge</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Configure surge pricing multipliers for specific premium zones</p>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label>Zone</Label>
                    <Select
                      value={newRichSurge.zone_id}
                      onValueChange={(v) => setNewRichSurge({...newRichSurge, zone_id: v})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {zones.map(zone => (
                          <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Surge Multiplier</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newRichSurge.surge_multiplier}
                      onChange={(e) => setNewRichSurge({...newRichSurge, surge_multiplier: parseFloat(e.target.value) || 1.5})}
                      placeholder="1.5"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddRichAreaSurge} className="w-full bg-[#15B46A] hover:bg-[#0F9456]">
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>

                {richAreaSurge.length > 0 && (
                  <div className="border rounded-lg dark:border-gray-700 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th className="text-left p-3">Zone</th>
                          <th className="text-left p-3">Surge Multiplier</th>
                          <th className="w-16"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {richAreaSurge.map((surge, idx) => {
                          const zone = zones.find(z => z.id === surge.zone_id);
                          return (
                            <tr key={idx} className="border-t dark:border-gray-700">
                              <td className="p-3">{zone?.name || 'N/A'}</td>
                              <td className="p-3">
                                <Badge variant="secondary">{surge.surge_multiplier.toFixed(1)}x</Badge>
                              </td>
                              <td className="p-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveRichAreaSurge(idx)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>

          {/* Submit Button */}
          <div className="flex justify-center gap-3 pt-6 mt-6 border-t dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowPriceConfig(false);
                setSaveMessage({ type: '', text: '' });
              }}
              className="px-8"
              disabled={saveMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                console.log('🖱️ [TypeCity] Save button clicked');
                saveMutation.mutate();
              }}
              className="bg-[#15B46A] hover:bg-[#0F9456] px-8"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {editingConfig ? 'Update Configuration' : 'Save Configuration'}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Main list view
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#15B46A]" />
          Service Type - City Association & Price Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* City & Service Type Selector */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Select City {cities.length > 0 && `(${cities.length} available)`}
            </label>
            <Select value={selectedCity} onValueChange={(value) => {
              setSelectedCity(value);
              setSelectedServiceType("");
            }}>
              <SelectTrigger>
                <SelectValue placeholder={cities.length === 0 ? "No cities available" : "Choose a city..."} />
              </SelectTrigger>
              <SelectContent>
                {cities.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <Building2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="font-medium">No cities available</p>
                    <p className="text-xs mt-1">Please add cities first in the Cities section</p>
                  </div>
                ) : (
                  cities.map(city => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Select Service Type {serviceTypes.length > 0 && `(${serviceTypes.length} available)`}
            </label>
            <Select 
              value={selectedServiceType} 
              onValueChange={setSelectedServiceType}
              disabled={!selectedCity}
            >
              <SelectTrigger>
                <SelectValue placeholder={!selectedCity ? "Select city first" : "Choose a service type..."} />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <Car className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="font-medium">No service types available</p>
                    <p className="text-xs mt-1">Please add service types first</p>
                  </div>
                ) : (
                  serviceTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Button */}
        {selectedCity && selectedServiceType && (
          <div className="flex justify-center pt-4">
            <Button
              onClick={() => setShowPriceConfig(true)}
              className="bg-[#15B46A] hover:bg-[#0F9456]"
              size="lg"
            >
              <Settings className="w-5 h-5 mr-2" />
              {priceConfigs.find(c => c.city_id === selectedCity && c.service_type_id === selectedServiceType)
                ? 'Edit Price Configuration'
                : 'Add Price Configuration'}
            </Button>
          </div>
        )}

        {/* Existing Configurations List */}
        {priceConfigs.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Existing Configurations</h3>
            <div className="space-y-3">
              {priceConfigs.map(config => {
                const city = cities.find(c => c.id === config.city_id);
                const serviceType = serviceTypes.find(s => s.id === config.service_type_id);
                
                // Create unique key
                const uniqueKey = `${config.id}-${config.city_id}-${config.service_type_id}`;
                
                return (
                  <div 
                    key={uniqueKey}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {city?.name} - {serviceType?.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Base: ${config.base_price} | Min: ${config.min_fare} | Provider Profit: {config.provider_profit}%
                      </p>
                      {config.ai_pricing_enabled && (
                        <Badge className="mt-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          AI Pricing Enabled
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={config.business_status ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}>
                        {config.business_status ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCity(config.city_id);
                          setSelectedServiceType(config.service_type_id);
                          setShowPriceConfig(true);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!selectedCity && !selectedServiceType && priceConfigs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p>Select a city and service type to configure pricing</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
