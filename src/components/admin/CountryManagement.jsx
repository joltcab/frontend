
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { joltcab } from "@/lib/joltcab-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Globe, Loader2, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export default function CountryManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [worldCountries, setWorldCountries] = useState([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [loadingWorldCountries, setLoadingWorldCountries] = useState(true);
  const [worldCountriesError, setWorldCountriesError] = useState(null);
  const queryClient = useQueryClient();

  // Cargar países del mundo al montar
  useEffect(() => {
    loadWorldCountries();
  }, []);

  const loadWorldCountries = async () => {
    console.log('🌍 Starting to load world countries...');
    setLoadingWorldCountries(true);
    setWorldCountriesError(null);
    
    try {
      // Intentar con múltiples APIs
      let data = null;
      
      // Opción 1: RestCountries v3.1
      try {
        console.log('📡 Trying RestCountries v3.1...');
        const response = await fetch("https://restcountries.com/v3.1/all");
        if (response.ok) {
          data = await response.json();
          console.log('✅ RestCountries v3.1 worked!');
        } else {
          throw new Error(`API v3.1 returned status ${response.status}`);
        }
      } catch (e) {
        console.log('❌ RestCountries v3.1 failed:', e.message);
      }
      
      // Opción 2: RestCountries v2 (fallback)
      if (!data) {
        try {
          console.log('📡 Trying RestCountries v2...');
          const response = await fetch("https://restcountries.com/v2/all");
          if (response.ok) {
            const v2Data = await response.json();
            console.log('✅ RestCountries v2 worked!');
            // Convertir formato v2 a v3
            data = v2Data.map(c => {
              const currencies = c.currencies && c.currencies.length > 0
                ? { [c.currencies[0].code]: { name: c.currencies[0].name, symbol: c.currencies[0].symbol } }
                : {};

              const root = c.callingCodes?.[0] ? `+${c.callingCodes[0]}` : '';

              return {
                name: { common: c.name, official: c.name },
                flags: { png: c.flag, svg: c.flag },
                currencies: currencies,
                idd: { root: root, suffixes: [] },
                cca2: c.alpha2Code,
                cca3: c.alpha3Code,
              };
            });
          } else {
            throw new Error(`API v2 returned status ${response.status}`);
          }
        } catch (e) {
          console.log('❌ RestCountries v2 failed:', e.message);
        }
      }
      
      if (!data || data.length === 0) {
        // NO mostrar error, solo usar fallback silenciosamente
        throw new Error("Using fallback list");
      }
      
      const formattedCountries = data.map(country => {
        const currencies = country.currencies || {};
        const currencyCode = Object.keys(currencies)[0] || 'USD';
        const currencyData = currencies[currencyCode] || {};
        
        const idd = country._idd || {};
        const root = idd.root || '';
        const suffixes = idd.suffixes || [];
        const countryCode = root + (suffixes.length > 0 ? suffixes[0] : '') || root || '+1';
        
        return {
          name: country.name.common || country.name.official || country.name,
          official_name: country.name.official || country.name.common || country.name,
          flag_url: country.flags.png || country.flags.svg || country.flag || '',
          currency: currencyCode,
          currency_name: currencyData.name || '',
          currency_sign: currencyData.symbol || '$',
          country_code: countryCode,
          alpha2: country.cca2 || country.alpha2Code,
          alpha3: country.cca3 || country.alpha3Code,
        };
      }).sort((a, b) => a.name.localeCompare(b.name));

      console.log('✅ Formatted', formattedCountries.length, 'countries');
      
      setWorldCountries(formattedCountries);
      setLoadingWorldCountries(false);
      
    } catch (error) {
      // NO mostrar error al usuario, usar fallback silenciosamente
      console.log('⚠️ Using comprehensive fallback list...');
      setWorldCountriesError(null); // NO mostrar error
      setLoadingWorldCountries(false);
      
      // Fallback COMPLETO
      setWorldCountries([
        { name: 'United States', flag_url: 'https://flagcdn.com/w320/us.png', currency: 'USD', currency_sign: '$', country_code: '+1', alpha2: 'US' },
        { name: 'United Kingdom', flag_url: 'https://flagcdn.com/w320/gb.png', currency: 'GBP', currency_sign: '£', country_code: '+44', alpha2: 'GB' },
        { name: 'Canada', flag_url: 'https://flagcdn.com/w320/ca.png', currency: 'CAD', currency_sign: '$', country_code: '+1', alpha2: 'CA' },
        { name: 'Mexico', flag_url: 'https://flagcdn.com/w320/mx.png', currency: 'MXN', currency_sign: '$', country_code: '+52', alpha2: 'MX' },
        { name: 'Spain', flag_url: 'https://flagcdn.com/w320/es.png', currency: 'EUR', currency_sign: '€', country_code: '+34', alpha2: 'ES' },
        { name: 'France', flag_url: 'https://flagcdn.com/w320/fr.png', currency: 'EUR', currency_sign: '€', country_code: '+33', alpha2: 'FR' },
        { name: 'Germany', flag_url: 'https://flagcdn.com/w320/de.png', currency: 'EUR', currency_sign: '€', country_code: '+49', alpha2: 'DE' },
        { name: 'Italy', flag_url: 'https://flagcdn.com/w320/it.png', currency: 'EUR', currency_sign: '€', country_code: '+39', alpha2: 'IT' },
        { name: 'Brazil', flag_url: 'https://flagcdn.com/w320/br.png', currency: 'BRL', currency_sign: 'R$', country_code: '+55', alpha2: 'BR' },
        { name: 'Argentina', flag_url: 'https://flagcdn.com/w320/ar.png', currency: 'ARS', currency_sign: '$', country_code: '+54', alpha2: 'AR' },
        { name: 'Colombia', flag_url: 'https://flagcdn.com/w320/co.png', currency: 'COP', currency_sign: '$', country_code: '+57', alpha2: 'CO' },
        { name: 'Chile', flag_url: 'https://flagcdn.com/w320/cl.png', currency: 'CLP', currency_sign: '$', country_code: '+56', alpha2: 'CL' },
        { name: 'Peru', flag_url: 'https://flagcdn.com/w320/pe.png', currency: 'PEN', currency_sign: 'S/', country_code: '+51', alpha2: 'PE' },
        { name: 'Ecuador', flag_url: 'https://flagcdn.com/w320/ec.png', currency: 'USD', currency_sign: '$', country_code: '+593', alpha2: 'EC' },
        { name: 'Venezuela', flag_url: 'https://flagcdn.com/w320/ve.png', currency: 'VES', currency_sign: 'Bs.', country_code: '+58', alpha2: 'VE' },
        { name: 'Japan', flag_url: 'https://flagcdn.com/w320/jp.png', currency: 'JPY', currency_sign: '¥', country_code: '+81', alpha2: 'JP' },
        { name: 'China', flag_url: 'https://flagcdn.com/w320/cn.png', currency: 'CNY', currency_sign: '¥', country_code: '+86', alpha2: 'CN' },
        { name: 'India', flag_url: 'https://flagcdn.com/w320/in.png', currency: 'INR', currency_sign: '₹', country_code: '+91', alpha2: 'IN' },
        { name: 'Australia', flag_url: 'https://flagcdn.com/w320/au.png', currency: 'AUD', currency_sign: '$', country_code: '+61', alpha2: 'AU' },
        { name: 'South Africa', flag_url: 'https://flagcdn.com/w320/za.png', currency: 'ZAR', currency_sign: 'R', country_code: '+27', alpha2: 'ZA' },
        { name: 'South Korea', flag_url: 'https://flagcdn.com/w320/kr.png', currency: 'KRW', currency_sign: '₩', country_code: '+82', alpha2: 'KR' },
        { name: 'Russia', flag_url: 'https://flagcdn.com/w320/ru.png', currency: 'RUB', currency_sign: '₽', country_code: '+7', alpha2: 'RU' },
        { name: 'Turkey', flag_url: 'https://flagcdn.com/w320/tr.png', currency: 'TRY', currency_sign: '₺', country_code: '+90', alpha2: 'TR' },
        { name: 'Saudi Arabia', flag_url: 'https://flagcdn.com/w320/sa.png', currency: 'SAR', currency_sign: 'ر.س', country_code: '+966', alpha2: 'SA' },
        { name: 'UAE', flag_url: 'https://flagcdn.com/w320/ae.png', currency: 'AED', currency_sign: 'د.إ', country_code: '+971', alpha2: 'AE' },
        { name: 'Egypt', flag_url: 'https://flagcdn.com/w320/eg.png', currency: 'EGP', currency_sign: '£', country_code: '+20', alpha2: 'EG' },
        { name: 'Nigeria', flag_url: 'https://flagcdn.com/w320/ng.png', currency: 'NGN', currency_sign: '₦', country_code: '+234', alpha2: 'NG' },
        { name: 'Kenya', flag_url: 'https://flagcdn.com/w320/ke.png', currency: 'KES', currency_sign: 'KSh', country_code: '+254', alpha2: 'KE' },
        { name: 'Portugal', flag_url: 'https://flagcdn.com/w320/pt.png', currency: 'EUR', currency_sign: '€', country_code: '+351', alpha2: 'PT' },
        { name: 'Netherlands', flag_url: 'https://flagcdn.com/w320/nl.png', currency: 'EUR', currency_sign: '€', country_code: '+31', alpha2: 'NL' },
        { name: 'Belgium', flag_url: 'https://flagcdn.com/w320/be.png', currency: 'EUR', currency_sign: '€', country_code: '+32', alpha2: 'BE' },
        { name: 'Switzerland', flag_url: 'https://flagcdn.com/w320/ch.png', currency: 'CHF', currency_sign: 'CHF', country_code: '+41', alpha2: 'CH' },
        { name: 'Sweden', flag_url: 'https://flagcdn.com/w320/se.png', currency: 'SEK', currency_sign: 'kr', country_code: '+46', alpha2: 'SE' },
        { name: 'Norway', flag_url: 'https://flagcdn.com/w320/no.png', currency: 'NOK', currency_sign: 'kr', country_code: '+47', alpha2: 'NO' },
        { name: 'Denmark', flag_url: 'https://flagcdn.com/w320/dk.png', currency: 'DKK', currency_sign: 'kr', country_code: '+45', alpha2: 'DK' },
        { name: 'Poland', flag_url: 'https://flagcdn.com/w320/pl.png', currency: 'PLN', currency_sign: 'zł', country_code: '+48', alpha2: 'PL' },
        { name: 'Greece', flag_url: 'https://flagcdn.com/w320/gr.png', currency: 'EUR', currency_sign: '€', country_code: '+30', alpha2: 'GR' },
        { name: 'Austria', flag_url: 'https://flagcdn.com/w320/at.png', currency: 'EUR', currency_sign: '€', country_code: '+43', alpha2: 'AT' },
        { name: 'Ireland', flag_url: 'https://flagcdn.com/w320/ie.png', currency: 'EUR', currency_sign: '€', country_code: '+353', alpha2: 'IE' },
        { name: 'New Zealand', flag_url: 'https://flagcdn.com/w320/nz.png', currency: 'NZD', currency_sign: '$', country_code: '+64', alpha2: 'NZ' },
        { name: 'Singapore', flag_url: 'https://flagcdn.com/w320/sg.png', currency: 'SGD', currency_sign: '$', country_code: '+65', alpha2: 'SG' },
        { name: 'Malaysia', flag_url: 'https://flagcdn.com/w320/my.png', currency: 'MYR', currency_sign: 'RM', country_code: '+60', alpha2: 'MY' },
        { name: 'Thailand', flag_url: 'https://flagcdn.com/w320/th.png', currency: 'THB', currency_sign: '฿', country_code: '+66', alpha2: 'TH' },
        { name: 'Philippines', flag_url: 'https://flagcdn.com/w320/ph.png', currency: 'PHP', currency_sign: '₱', country_code: '+63', alpha2: 'PH' },
        { name: 'Indonesia', flag_url: 'https://flagcdn.com/w320/id.png', currency: 'IDR', currency_sign: 'Rp', country_code: '+62', alpha2: 'ID' },
        { name: 'Vietnam', flag_url: 'https://flagcdn.com/w320/vn.png', currency: 'VND', currency_sign: '₫', country_code: '+84', alpha2: 'VN' },
        { name: 'Pakistan', flag_url: 'https://flagcdn.com/w320/pk.png', currency: 'PKR', currency_sign: '₨', country_code: '+92', alpha2: 'PK' },
        { name: 'Bangladesh', flag_url: 'https://flagcdn.com/w320/bd.png', currency: 'BDT', currency_sign: '৳', country_code: '+880', alpha2: 'BD' },
        { name: 'Israel', flag_url: 'https://flagcdn.com/w320/il.png', currency: 'ILS', currency_sign: '₪', country_code: '+972', alpha2: 'IL' },
        { name: 'Czech Republic', flag_url: 'https://flagcdn.com/w320/cz.png', currency: 'CZK', currency_sign: 'Kč', country_code: '+420', alpha2: 'CZ' },
        { name: 'Hungary', flag_url: 'https://flagcdn.com/w320/hu.png', currency: 'HUF', currency_sign: 'Ft', country_code: '+36', alpha2: 'HU' },
      ].sort((a, b) => a.name.localeCompare(b.name)));
    }
  };

  const { data: countries = [], isLoading } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const data = await joltcab.countries.list();
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      return await joltcab.countries.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      setIsDialogOpen(false);
      setEditingCountry(null);
      setSelectedCountryCode("");
      toast.success('Country created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create country');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await joltcab.countries.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      toast.success('Country updated successfully');
      setIsDialogOpen(false);
      setEditingCountry(null);
      setSelectedCountryCode("");
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update country');
    },
  });

  // Cuando se selecciona un país del dropdown - MEJORADO
  const handleCountrySelect = (countryCode) => {
    console.log('🎯 Selected country code:', countryCode);
    setSelectedCountryCode(countryCode);
    const country = worldCountries.find(c => c.alpha2 === countryCode);
    console.log('🎯 Found country:', country);
    
    if (country) {
      // Esperar a que el DOM se actualice.
      // Esto es necesario porque el Select de Shadcn/ui puede no renderizar
      // los inputs inmediatamente después del cambio de estado,
      // y accederlos con document.getElementById podría dar null.
      setTimeout(() => {
        const nameInput = document.getElementById('country_name');
        const flagInput = document.getElementById('flag_url');
        const currencyInput = document.getElementById('currency');
        const signInput = document.getElementById('currency_sign');
        const codeInput = document.getElementById('country_code');
        
        if (nameInput) {
          nameInput.value = country.name;
          // Trigger change event for react if it's not a controlled component
          nameInput.dispatchEvent(new Event('input', { bubbles: true }));
          console.log('✅ Set name:', country.name);
        }
        if (flagInput) {
          flagInput.value = country.flag_url;
          flagInput.dispatchEvent(new Event('input', { bubbles: true }));
          console.log('✅ Set flag:', country.flag_url);
        }
        if (currencyInput) {
          currencyInput.value = country.currency;
          currencyInput.dispatchEvent(new Event('input', { bubbles: true }));
          console.log('✅ Set currency:', country.currency);
        }
        if (signInput) {
          signInput.value = country.currency_sign;
          signInput.dispatchEvent(new Event('input', { bubbles: true }));
          console.log('✅ Set sign:', country.currency_sign);
        }
        if (codeInput) {
          codeInput.value = country.country_code;
          codeInput.dispatchEvent(new Event('input', { bubbles: true }));
          console.log('✅ Set code:', country.country_code);
        }
      }, 100); // Small delay to ensure DOM is ready
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Map frontend fields to backend model fields
    const data = {
      countryname: formData.get('name'),
      countrycode: formData.get('country_code')?.replace('+', '') || '',
      alpha2: selectedCountryCode || '',
      currency: formData.get('currency'),
      currencycode: formData.get('currency'),
      currencysign: formData.get('currency_sign'),
      countryphonecode: formData.get('country_code'),
      flag_url: formData.get('flag_url') || '',
      isBusiness: formData.get('business_status') === 'on',
      referral_bonus_to_user: parseFloat(formData.get('bonus_to_user')) || 150,
      bonus_to_userreferral: parseFloat(formData.get('bonus_to_referral')) || 150,
      userreferral: parseInt(formData.get('referral_max_usage')) || 10,
    };

    if (editingCountry) {
      updateMutation.mutate({ id: editingCountry._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#15B46A]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Panel con botón centrado */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-normal"
                onClick={() => {
                  setEditingCountry(null);
                  setSelectedCountryCode("");
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Country
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCountry ? 'Edit Country' : 'Add New Country'}</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                {/* DROPDOWN DE PAÍSES */}
                {!editingCountry && (
                  <div>
                    <Label>Select Country from World Map *</Label>
                    
                    {loadingWorldCountries ? (
                      <div className="flex items-center justify-center p-4 border rounded-md text-sm text-gray-600">
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Loading countries...
                      </div>
                    ) : null}
                    
                    <Select 
                      value={selectedCountryCode} 
                      onValueChange={handleCountrySelect}
                      disabled={loadingWorldCountries}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={
                          loadingWorldCountries 
                            ? "Loading countries..." 
                            : "Choose a country..."
                        } />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {worldCountries.map((country) => (
                          <SelectItem key={country.alpha2} value={country.alpha2}>
                            <div className="flex items-center gap-2">
                              <img 
                                src={country.flag_url} 
                                alt={country.countryname} 
                                className="w-6 h-4 object-cover" 
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                              <span>{country.countryname}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Country Name *</Label>
                    <Input
                      id="country_name"
                      name="name"
                      defaultValue={editingCountry?.name}
                      placeholder="e.g., United States"
                      required
                    />
                  </div>

                  <div>
                    <Label>Flag URL</Label>
                    <Input
                      id="flag_url"
                      name="flag_url"
                      defaultValue={editingCountry?.flag_url}
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <Label>Currency *</Label>
                    <Input
                      id="currency"
                      name="currency"
                      defaultValue={editingCountry?.currency}
                      placeholder="e.g., USD"
                      required
                    />
                  </div>

                  <div>
                    <Label>Currency Sign *</Label>
                    <Input
                      id="currency_sign"
                      name="currency_sign"
                      defaultValue={editingCountry?.currency_sign}
                      placeholder="e.g., $"
                      required
                    />
                  </div>

                  <div>
                    <Label>Country Phone Code *</Label>
                    <Input
                      id="country_code"
                      name="country_code"
                      defaultValue={editingCountry?.country_code}
                      placeholder="e.g., +1"
                      required
                    />
                  </div>

                  <div>
                    <Label>Referral Bonus to User</Label>
                    <Input
                      name="bonus_to_user"
                      type="number"
                      step="0.01"
                      defaultValue={editingCountry?.bonus_to_user || 150}
                      placeholder="150"
                    />
                  </div>

                  <div>
                    <Label>Bonus to User Referral</Label>
                    <Input
                      name="bonus_to_referral"
                      type="number"
                      step="0.01"
                      defaultValue={editingCountry?.bonus_to_referral || 150}
                      placeholder="150"
                    />
                  </div>

                  <div>
                    <Label>User Referral Max Use</Label>
                    <Input
                      name="referral_max_usage"
                      type="number"
                      defaultValue={editingCountry?.referral_max_usage || 10}
                      placeholder="10"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <Switch
                    name="business_status"
                    defaultChecked={editingCountry?.business_status !== false}
                  />
                  <Label>Country Business (ON/OFF)</Label>
                </div>

                <div className="flex justify-center gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingCountry(null);
                      setSelectedCountryCode("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#5cb85c] hover:bg-[#4cae4c]">
                    {editingCountry ? 'Update' : 'Create'} Country
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Grid de países (sin cambios) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {countries.length === 0 ? (
          <div className="col-span-full">
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Globe className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600 mb-4">No countries configured yet</p>
            </div>
          </div>
        ) : (
          countries.map((country) => (
            <div key={country._id} className="col-span-1">
              <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="p-6 text-center">
                  <div className="mb-4">
                    {country.flag_url ? (
                      <img 
                        src={country.flag_url} 
                        alt={country.countryname}
                        style={{ border: 'none', borderRadius: '0px', height: '65px', margin: '0 auto' }}
                      />
                    ) : (
                      <div className="flex items-center justify-center" style={{ height: '65px' }}>
                        <Globe className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="font-bold text-lg text-gray-900">{country.countryname}</div>
                </div>

                <div className="px-4 pb-4">
                  <ul className="border-b border-gray-200 mb-4">
                    <li className="flex justify-between items-center py-2 px-3 border-t border-gray-200">
                      <span className="text-gray-700">Currency</span>
                      <Badge variant="secondary" className="bg-gray-200 text-gray-800">{country.currency}</Badge>
                    </li>
                    <li className="flex justify-between items-center py-2 px-3 border-t border-gray-200">
                      <span className="text-gray-700">Sign</span>
                      <Badge className="bg-[#f0ad4e] text-white hover:bg-[#ec971f]">{country.currencysign}</Badge>
                    </li>
                    <li className="flex justify-between items-center py-2 px-3 border-t border-gray-200">
                      <span className="text-gray-700">Country Code</span>
                      <Badge className="bg-[#5bc0de] text-white hover:bg-[#31b0d5]">{country.countryphonecode}</Badge>
                    </li>
                    <li className="flex justify-between items-center py-2 px-3 border-t border-gray-200">
                      <span className="text-gray-700">Country Business</span>
                      {country.isBusiness ? (
                        <Badge className="bg-[#5cb85c] text-white hover:bg-[#4cae4c]">ON</Badge>
                      ) : (
                        <Badge className="bg-[#f0ad4e] text-white hover:bg-[#ec971f]">OFF</Badge>
                      )}
                    </li>
                    <li className="flex justify-between items-center py-2 px-3 border-t border-gray-200">
                      <span className="text-gray-700">Referral Bonus to User</span>
                      <Badge variant="secondary" className="bg-gray-200 text-gray-800">{country.referral_bonus_to_user || 0}</Badge>
                    </li>
                    <li className="flex justify-between items-center py-2 px-3 border-t border-gray-200">
                      <span className="text-gray-700">Bonus to User Referral</span>
                      <Badge variant="secondary" className="bg-gray-200 text-gray-800">{country.bonus_to_userreferral || 0}</Badge>
                    </li>
                    <li className="flex justify-between items-center py-2 px-3 border-t border-gray-200">
                      <span className="text-gray-700">User Referral Max Use</span>
                      <Badge variant="secondary" className="bg-gray-200 text-gray-800">{country.userreferral || 0}</Badge>
                    </li>
                  </ul>

                  <form className="text-center">
                    <Button
                      type="button"
                      className="bg-[#337ab7] hover:bg-[#286090] text-white"
                      style={{ width: '80px' }}
                      onClick={() => {
                        setEditingCountry(country);
                        setIsDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
