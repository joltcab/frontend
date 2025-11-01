import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, MapPin, Search, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CityManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchingCities, setSearchingCities] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const queryClient = useQueryClient();

  const { data: cities = [], isLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      console.log('🏙️ [CityManagement] Fetching cities...');
      const result = await base44.entities.City.list('-created_date');
      console.log('✅ [CityManagement] Cities fetched:', result.length);
      console.table(result);
      return result;
    },
  });

  const { data: countries = [] } = useQuery({
    queryKey: ['countries'],
    queryFn: () => base44.entities.Country.list(),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  // Sincronizar el país seleccionado cuando abrimos para editar
  useEffect(() => {
    if (editingCity?.country_id) {
      setSelectedCountryId(String(editingCity.country_id));
    } else if (!isDialogOpen) {
      setSelectedCountryId("");
    }
  }, [editingCity, isDialogOpen]);

  // Diagnóstico: log de países cargados y cambios de selección
  useEffect(() => {
    console.log('🌐 [CityManagement] Countries loaded:', Array.isArray(countries) ? countries.length : 0);
    if (Array.isArray(countries)) {
      console.table(countries.map(c => ({ id: c.id, name: c.name, alpha2: c.alpha2 || '', country_code: c.country_code || '' })));
    }
  }, [countries]);

  useEffect(() => {
    if (selectedCountryId) {
      const found = Array.isArray(countries) ? countries.find(c => String(c.id) === String(selectedCountryId)) : null;
      console.log('✅ [CityManagement] selectedCountryId set:', selectedCountryId, found ? `-> ${found.name}` : '');
    }
  }, [selectedCountryId, countries]);

  const createMutation = useMutation({
    mutationFn: async (data) => {
      console.log('➕ [CityManagement] Creating city:', data);
      const result = await base44.entities.City.create(data);
      console.log('✅ [CityManagement] City created:', result);
      return result;
    },
    onSuccess: () => {
      console.log('🔄 [CityManagement] Invalidating queries after create');
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      setIsDialogOpen(false);
      setEditingCity(null);
      setCitySearchQuery("");
      setCitySuggestions([]);
      alert('City created successfully!');
    },
    onError: (error) => {
      console.error('❌ [CityManagement] Error creating city:', error);
      alert(`Error creating city: ${error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      console.log('✏️ [CityManagement] Updating city:', id, data);
      const result = await base44.entities.City.update(id, data);
      console.log('✅ [CityManagement] City updated:', result);
      return result;
    },
    onSuccess: () => {
      console.log('🔄 [CityManagement] Invalidating queries after update');
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      setIsDialogOpen(false);
      setEditingCity(null);
      setCitySearchQuery("");
      setCitySuggestions([]);
      alert('City updated successfully!');
    },
    onError: (error) => {
      console.error('❌ [CityManagement] Error updating city:', error);
      alert(`Error updating city: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      console.log('🗑️ [CityManagement] Deleting city:', id);
      await base44.entities.City.delete(id);
    },
    onSuccess: () => {
      console.log('🔄 [CityManagement] Invalidating queries after delete');
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      alert('City deleted successfully!');
    },
  });

  // Buscar ciudades con autocompletado
  const searchCities = async (query) => {
    if (!query || query.length < 3) {
      setCitySuggestions([]);
      setShowSuggestions(false);
      return;
    }

    console.log('🔍 Searching cities for:', query);
    setSearchingCities(true);
    
    try {
      const response = await base44.functions.invoke('geocodeAddress', {
        address: query,
        language: 'en'
      });

      console.log('📡 Geocoding response:', response.data);

      let suggestions = [];

      // Caso 1: backend JoltCab devuelve { success, result, alternatives }
      if (response.data && response.data.success) {
        const allResults = [response.data.result, ...(response.data.alternatives || [])].filter(Boolean);
        console.log('📍 Total results:', allResults.length);
        
        const cityResults = allResults
          .filter(r => {
            const types = r.types || [];
            const isCity = types.includes('locality') || 
                          types.includes('administrative_area_level_1') ||
                          types.includes('administrative_area_level_2');
            return isCity;
          })
          .slice(0, 5);

        console.log('✅ Filtered city results:', cityResults.length);

        suggestions = cityResults.map(r => {
          const comps = r.components || {};
          const cityName = comps.locality || 
                          comps.administrative_area_level_1 || 
                          comps.administrative_area_level_2 ||
                          (r.formatted_address ? r.formatted_address.split(',')[0] : '');
          const cityCode = cityName ? cityName.substring(0, 3).toUpperCase() : '';
          return {
            name: cityName,
            full_name: r.formatted_address || cityName,
            city_code: cityCode,
            latitude: r.lat,
            longitude: r.lng,
            country: comps.country,
            country_code: (comps.country_code || comps.alpha2 || comps.iso2 || '').toUpperCase(),
            timezone: getTimezoneFromCoordinates(r.lat, r.lng),
          };
        });
      }

      // Caso 2: fallback a Nominatim (OpenStreetMap) si backend falla o sin resultados
      if (!suggestions.length) {
        console.log('🤔 No backend results, trying Nominatim fallback...');
        const nomiRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(query)}`, {
          headers: { 'Accept': 'application/json' }
        });
        const nomiData = await nomiRes.json();
        suggestions = (nomiData || []).map(item => {
          const parts = (item.display_name || '').split(',').map(s => s.trim());
          const name = parts[0] || '';
          const country = parts[parts.length - 1] || '';
          const cityCode = name ? name.substring(0, 3).toUpperCase() : '';
          const lat = parseFloat(item.lat);
          const lng = parseFloat(item.lon);
          return {
            name,
            full_name: item.display_name || name,
            city_code: cityCode,
            latitude: lat,
            longitude: lng,
            country,
            country_code: (item.address?.country_code || '').toUpperCase(),
            timezone: getTimezoneFromCoordinates(lat, lng),
          };
        });
      }

      console.log('💡 Final suggestions:', suggestions);
      setCitySuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } catch (error) {
      console.error('❌ Error searching cities:', error);
      setCitySuggestions([]);
      setShowSuggestions(false);
    } finally {
      setSearchingCities(false);
    }
  };

  const getTimezoneFromCoordinates = (lat, lng) => {
    const offset = Math.round(lng / 15);
    
    const timezoneMap = {
      '-5': 'America/New_York',
      '-6': 'America/Chicago',
      '-7': 'America/Denver',
      '-8': 'America/Los_Angeles',
      '0': 'Europe/London',
      '1': 'Europe/Paris',
      '2': 'Europe/Athens',
      '8': 'Asia/Shanghai',
      '9': 'Asia/Tokyo',
      '-3': 'America/Sao_Paulo',
    };

    return timezoneMap[offset.toString()] || 'UTC';
  };

  // Normalizador de nombres para matching robusto
  const normalizeCountryName = (str = '') => {
    try {
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    } catch {
      return (str || '').toLowerCase().trim();
    }
  };

  // Alias comunes de países para mejorar matching cuando alpha2 no está disponible
  // clave: nombre normalizado, valor: código ISO2
  const COUNTRY_ALIASES = {
    // Estados Unidos
    'united states': 'US',
    'united states of america': 'US',
    'usa': 'US',
    // Reino Unido
    'united kingdom': 'GB',
    'uk': 'GB',
    'great britain': 'GB',
    // Emiratos Árabes Unidos
    'united arab emirates': 'AE',
    'uae': 'AE',
    // República Checa
    'czech republic': 'CZ',
    'czechia': 'CZ',
    // Corea del Sur
    'south korea': 'KR',
    'republic of korea': 'KR',
    // Costa de Marfil
    "cote d'ivoire": 'CI',
    'cote divoire': 'CI',
    'ivory coast': 'CI',
    // Turquía
    'turkiye': 'TR',
    'turkey': 'TR',
    // Países Bajos
    'netherlands': 'NL',
    'holland': 'NL',
    // Rusia
    'russia': 'RU',
    'russian federation': 'RU',
    // República Dominicana
    'dominican republic': 'DO',
  };

  const handleCitySelect = (city) => {
    console.log('✅ City selected:', city);
    setCitySearchQuery(city.name);
    setShowSuggestions(false);
    
    // Auto-llenar campos
    setTimeout(() => {
      const nameInput = document.getElementById('city_name');
      const codeInput = document.getElementById('city_code');
      const latInput = document.getElementById('latitude');
      const lngInput = document.getElementById('longitude');
      const tzInput = document.getElementById('timezone');

      if (nameInput) nameInput.value = city.name || '';
      if (codeInput) codeInput.value = city.city_code || '';
      if (latInput) latInput.value = city.latitude || '';
      if (lngInput) lngInput.value = city.longitude || '';
      if (tzInput) tzInput.value = city.timezone || '';
      
      console.log('📝 Fields auto-filled');
    }, 100);

    // Intentar autoseleccionar país
    try {
      if (Array.isArray(countries)) {
        // 1) Intentar por código ISO (alpha2)
        if (city.country_code) {
          const isoCode = city.country_code.toUpperCase();
          const byCode = countries.find(c => (c.alpha2 || c.code || c.country_code || '')?.toUpperCase() === isoCode);
          if (byCode) {
            setSelectedCountryId(String(byCode.id));
            console.log('🌍 Country auto-selected by ISO:', byCode);
            return;
          }
          // 1b) Intentar por alias del nombre del país en la lista de países si falta alpha2
          const byAliasIso = countries.find(c => {
            const aliasIso = COUNTRY_ALIASES[normalizeCountryName(c.name)] || null;
            return aliasIso && aliasIso.toUpperCase() === isoCode;
          });
          if (byAliasIso) {
            setSelectedCountryId(String(byAliasIso.id));
            console.log('🌍 Country auto-selected by ISO via alias:', byAliasIso);
            return;
          }
        }

        // 2) Intentar por nombre normalizado
        if (city.country) {
          const target = normalizeCountryName(city.country);
          const byName = countries.find(c => normalizeCountryName(c.name) === target);
          if (byName) {
            setSelectedCountryId(String(byName.id));
            console.log('🌍 Country auto-selected by name:', byName);
            return;
          }

          // 3) Coincidencia parcial
          const byPartial = countries.find(c => {
            const n = normalizeCountryName(c.name);
            return n.includes(target) || target.includes(n);
          });
          if (byPartial) {
            setSelectedCountryId(String(byPartial.id));
            console.log('🌍 Country auto-selected by partial name:', byPartial);
            return;
          }

          // 4) Intentar derivar ISO desde el nombre del resultado y buscar por alpha2 o alias
          const derivedIso = COUNTRY_ALIASES[target] || null;
          if (derivedIso) {
            const byDerivedIso = countries.find(c => (c.alpha2 || '')?.toUpperCase() === derivedIso);
            if (byDerivedIso) {
              setSelectedCountryId(String(byDerivedIso.id));
              console.log('🌍 Country auto-selected by derived ISO from name:', byDerivedIso);
              return;
            }
            const byDerivedAlias = countries.find(c => {
              const aliasIso = COUNTRY_ALIASES[normalizeCountryName(c.name)] || null;
              return aliasIso && aliasIso.toUpperCase() === derivedIso;
            });
            if (byDerivedAlias) {
              setSelectedCountryId(String(byDerivedAlias.id));
              console.log('🌍 Country auto-selected by derived ISO via country alias:', byDerivedAlias);
              return;
            }
          }
        }
      }
    } catch (e) {
      console.warn('Country autoselect failed:', e);
    }
  };

  const handleCitySearchChange = (e) => {
    const value = e.target.value;
    setCitySearchQuery(value);
    
    clearTimeout(window.citySearchTimeout);
    
    if (value.length >= 3) {
      console.log('⏱️ Debouncing search for:', value);
      window.citySearchTimeout = setTimeout(() => {
        searchCities(value);
      }, 800);
    } else {
      setCitySuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const data = {
      name: formData.get('name'),
      country_id: formData.get('country_id'),
      city_code: formData.get('city_code') || '',
      latitude: parseFloat(formData.get('latitude')) || 0,
      longitude: parseFloat(formData.get('longitude')) || 0,
      timezone: formData.get('timezone') || '',
      business_status: formData.get('business_status') === 'on',
    };

    // Forzar country_id desde el Select controlado si existe
    if (selectedCountryId) {
      data.country_id = Number(selectedCountryId);
    }

    console.log('📝 Form data:', data);

    if (!data.name || !data.country_id) {
      alert('Please fill in required fields: City Name and Country');
      return;
    }

    if (editingCity) {
      updateMutation.mutate({ id: editingCity.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredCities = cities.filter(city => {
    const matchesSearch = city.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = filterCountry === "all" || city.country_id === filterCountry;
    return matchesSearch && matchesCountry;
  });

  const getCountryName = (countryId) => {
    const country = countries.find(c => c.id === countryId);
    return country?.name || "Unknown";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#15B46A]" />
      </div>
    );
  }

  console.log('🎨 [CityManagement] Rendering. Cities:', cities.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">City Management</h2>
          <p className="text-gray-600 mt-1">Manage cities where your service operates ({cities.length} cities)</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#15B46A] hover:bg-[#0F9456]" onClick={() => {
              setEditingCity(null);
              setCitySearchQuery("");
              setCitySuggestions([]);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add City
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCity ? 'Edit City' : 'Add New City'}</DialogTitle>
              {/* Provide description to satisfy accessibility and remove warning */}
              <DialogDescription>
                Fill in the city details and save.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {/* AUTOCOMPLETADO DE CIUDADES */}
              {!editingCity && (
                <div className="relative">
                  <Label>Search City *</Label>
                  <div className="relative">
                    <Input
                      value={citySearchQuery}
                      onChange={handleCitySearchChange}
                      placeholder="Start typing a city name..."
                      className="pr-10"
                      onFocus={() => citySuggestions.length > 0 && setShowSuggestions(true)}
                    />
                    {searchingCities && (
                      <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-gray-400" />
                    )}
                  </div>
                  
                  {/* Sugerencias */}
                  {showSuggestions && citySuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {citySuggestions.map((city, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleCitySelect(city)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-[#15B46A] mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-gray-900">{city.name}</p>
                              <p className="text-sm text-gray-500">{city.full_name}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>City Name *</Label>
                  <Input
                    id="city_name"
                    name="name"
                    defaultValue={editingCity?.name}
                    placeholder="e.g., Atlanta"
                    required
                  />
                </div>

                <div>
                  <Label>Country *</Label>
                  <Select value={selectedCountryId} onValueChange={setSelectedCountryId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(c => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name || c.countryname || 'Unnamed Country'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input type="hidden" name="country_id" value={selectedCountryId || ''} />
                </div>

                <div>
                  <Label>City Code</Label>
                  <Input
                    id="city_code"
                    name="city_code"
                    defaultValue={editingCity?.city_code}
                    placeholder="e.g., ATL"
                  />
                </div>

                <div>
                  <Label>Timezone</Label>
                  <Input
                    id="timezone"
                    name="timezone"
                    defaultValue={editingCity?.timezone}
                    placeholder="e.g., America/New_York"
                  />
                </div>

                <div>
                  <Label>Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    name="latitude"
                    defaultValue={editingCity?.latitude}
                    placeholder="e.g., 33.7490"
                  />
                </div>

                <div>
                  <Label>Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    name="longitude"
                    defaultValue={editingCity?.longitude}
                    placeholder="e.g., -84.3880"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  name="business_status"
                  defaultChecked={editingCity?.business_status !== false}
                />
                <Label>Business Active</Label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                {/* Asegurar que country_id se envía en el formulario */}
                <input type="hidden" name="country_id" value={selectedCountryId || ''} />
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#15B46A] hover:bg-[#0F9456]"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {editingCity ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingCity ? 'Update City' : 'Create City'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCountry} onValueChange={setFilterCountry}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cities Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCities.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center">
              <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-semibold text-gray-900 mb-2">No cities found</p>
              <p className="text-gray-600">Add cities to start managing your service areas</p>
            </CardContent>
          </Card>
        ) : (
          filteredCities.map(city => (
            <Card key={city.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#15B46A] to-[#0F9456] rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{city.name}</h3>
                      <p className="text-sm text-gray-600">{getCountryName(city.country_id)}</p>
                    </div>
                  </div>
                  <Badge className={city.business_status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {city.business_status ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  {city.city_code && <p><strong>Code:</strong> {city.city_code}</p>}
                  {city.timezone && <p><strong>Timezone:</strong> {city.timezone}</p>}
                  {city.latitude && city.longitude && (
                    <p><strong>Coordinates:</strong> {city.latitude.toFixed(4)}, {city.longitude.toFixed(4)}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setEditingCity(city);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => {
                      if (confirm(`Delete city "${city.name}"?`)) {
                        deleteMutation.mutate(city.id);
                      }
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}