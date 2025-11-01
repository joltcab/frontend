import joltcab from "@/lib/joltcab-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle,
  DollarSign,
  Edit,
  Globe,
  Phone,
  Plus,
  Search,
  Trash2,
  Users,
  XCircle
} from "lucide-react";
import { useState } from "react";

export default function AdminCountries() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    currency: "USD",
    currency_sign: "$",
    country_code: "+1",
    alpha2: "",
    alpha3: "",
    business_status: true,
    
    // Auto Transfer
    is_auto_transfer: false,
    auto_transfer_day: 7,
    timezone: "",
    
    // Phone Settings
    phone_number_min_length: 10,
    phone_number_max_length: 10,
    
    // User Referral
    is_referral: true,
    referral_bonus_to_user: 150,
    bonus_to_userreferral: 150,
    userreferral: 10,
    
    // Provider Referral
    is_provider_referral: true,
    referral_bonus_to_provider: 150,
    bonus_to_providerreferral: 150,
    providerreferral: 10
  });

  const queryClient = useQueryClient();

  // Fetch countries
  const { data: countries = [], isLoading } = useQuery({
    queryKey: ['countries'],
  queryFn: () => joltcab.countries.list()
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editingCountry) {
  return await joltcab.entities.Country.update(editingCountry.id, data);
      }
  return await joltcab.entities.Country.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['countries']);
      alert(editingCountry ? 'Country updated successfully!' : 'Country created successfully!');
      handleCloseDialog();
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
  mutationFn: (id) => joltcab.entities.Country.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['countries']);
      alert('Country deleted successfully!');
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    }
  });

  const handleOpenDialog = (country = null) => {
    if (country) {
      setEditingCountry(country);
      setFormData(country);
    } else {
      setEditingCountry(null);
      setFormData({
        name: "",
        currency: "USD",
        currency_sign: "$",
        country_code: "+1",
        alpha2: "",
        alpha3: "",
        business_status: true,
        is_auto_transfer: false,
        auto_transfer_day: 7,
        timezone: "",
        phone_number_min_length: 10,
        phone_number_max_length: 10,
        is_referral: true,
        referral_bonus_to_user: 150,
        bonus_to_userreferral: 150,
        userreferral: 10,
        is_provider_referral: true,
        referral_bonus_to_provider: 150,
        bonus_to_providerreferral: 150,
        providerreferral: 10
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCountry(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this country?')) {
      deleteMutation.mutate(id);
    }
  };

  // Filter countries
  const filteredCountries = countries.filter(country =>
    country.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.currency?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Currency options
  const currencyOptions = [
    { code: "USD", sign: "$", name: "US Dollar" },
    { code: "EUR", sign: "€", name: "Euro" },
    { code: "GBP", sign: "£", name: "British Pound" },
    { code: "MXN", sign: "$", name: "Mexican Peso" },
    { code: "CAD", sign: "$", name: "Canadian Dollar" },
    { code: "ARS", sign: "$", name: "Argentine Peso" },
    { code: "COP", sign: "$", name: "Colombian Peso" },
    { code: "BRL", sign: "R$", name: "Brazilian Real" },
  ];

  // Timezone options
  const timezones = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "America/Mexico_City",
    "America/Bogota",
    "America/Lima",
    "America/Sao_Paulo",
    "America/Buenos_Aires",
    "Europe/London",
    "Europe/Paris",
    "Asia/Dubai",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Countries</h1>
          <p className="text-gray-600 mt-1">Manage countries and their settings</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-[#15B46A]">
          <Plus className="w-4 h-4 mr-2" />
          Add Country
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Countries Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#15B46A]" />
            All Countries ({filteredCountries.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading countries...</div>
          ) : filteredCountries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No countries found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Country</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Phone Code</TableHead>
                  <TableHead>Timezone</TableHead>
                  <TableHead>Business Status</TableHead>
                  <TableHead>Referrals</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCountries.map((country) => (
                  <TableRow key={country.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#15B46A]" />
                        {country.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {country.currency_sign} {country.currency}
                      </Badge>
                    </TableCell>
                    <TableCell>{country.country_code}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {country.timezone || 'Not set'}
                    </TableCell>
                    <TableCell>
                      {country.business_status ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          <XCircle className="w-3 h-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {country.is_referral && (
                          <Badge variant="outline" className="text-xs">
                            <Users className="w-3 h-3 mr-1" />
                            User
                          </Badge>
                        )}
                        {country.is_provider_referral && (
                          <Badge variant="outline" className="text-xs">
                            <Users className="w-3 h-3 mr-1" />
                            Driver
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(country)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(country.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCountry ? 'Edit Country' : 'Add New Country'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="phone">Phone Settings</TabsTrigger>
                <TabsTrigger value="user-referral">User Referral</TabsTrigger>
                <TabsTrigger value="driver-referral">Driver Referral</TabsTrigger>
              </TabsList>

              {/* BASIC INFO TAB */}
              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Country Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="United States"
                      required
                      disabled={editingCountry}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Country Code (Alpha2) *</Label>
                    <Input
                      value={formData.alpha2}
                      onChange={(e) => setFormData({...formData, alpha2: e.target.value.toUpperCase()})}
                      placeholder="US"
                      maxLength={2}
                      required
                      disabled={editingCountry}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Country Code (Alpha3)</Label>
                    <Input
                      value={formData.alpha3 || ''}
                      onChange={(e) => setFormData({...formData, alpha3: e.target.value.toUpperCase()})}
                      placeholder="USA"
                      maxLength={3}
                      disabled={editingCountry}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Phone Country Code *</Label>
                    <Input
                      value={formData.country_code}
                      onChange={(e) => setFormData({...formData, country_code: e.target.value})}
                      placeholder="+1"
                      required
                      disabled={editingCountry}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Currency *</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => {
                        const selected = currencyOptions.find(c => c.code === value);
                        setFormData({
                          ...formData,
                          currency: value,
                          currency_sign: selected?.sign || '$'
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencyOptions.map(curr => (
                          <SelectItem key={curr.code} value={curr.code}>
                            {curr.sign} {curr.code} - {curr.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Currency Sign *</Label>
                    <Input
                      value={formData.currency_sign}
                      onChange={(e) => setFormData({...formData, currency_sign: e.target.value})}
                      placeholder="$"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Timezone *</Label>
                    <Select
                      value={formData.timezone}
                      onValueChange={(value) => setFormData({...formData, timezone: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map(tz => (
                          <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Business Status</Label>
                    <div className="flex items-center gap-2 h-10">
                      <Switch
                        checked={formData.business_status}
                        onCheckedChange={(checked) => setFormData({...formData, business_status: checked})}
                      />
                      <span className="text-sm text-gray-600">
                        {formData.business_status ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Auto Transfer Settings */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#15B46A]" />
                    Auto Transfer Settings
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Enable Auto Transfer</Label>
                      <div className="flex items-center gap-2 h-10">
                        <Switch
                          checked={formData.is_auto_transfer}
                          onCheckedChange={(checked) => setFormData({...formData, is_auto_transfer: checked})}
                        />
                        <span className="text-sm text-gray-600">
                          {formData.is_auto_transfer ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Auto Transfer Day</Label>
                      <Input
                        type="number"
                        value={formData.auto_transfer_day}
                        onChange={(e) => setFormData({...formData, auto_transfer_day: parseInt(e.target.value) || 0})}
                        placeholder="7"
                        min="1"
                      />
                      <p className="text-xs text-gray-500">Day of month to process transfers</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* PHONE SETTINGS TAB */}
              <TabsContent value="phone" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-5 h-5 text-[#15B46A]" />
                    <h3 className="font-semibold">Phone Number Validation</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Minimum Length *</Label>
                      <Input
                        type="number"
                        value={formData.phone_number_min_length}
                        onChange={(e) => setFormData({...formData, phone_number_min_length: parseInt(e.target.value) || 0})}
                        placeholder="10"
                        required
                        min="1"
                      />
                      <p className="text-xs text-gray-500">Minimum digits for phone numbers</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Maximum Length *</Label>
                      <Input
                        type="number"
                        value={formData.phone_number_max_length}
                        onChange={(e) => setFormData({...formData, phone_number_max_length: parseInt(e.target.value) || 0})}
                        placeholder="10"
                        required
                        min="1"
                      />
                      <p className="text-xs text-gray-500">Maximum digits for phone numbers</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      <strong>Example:</strong> For US numbers (555-1234-5678), set min=10 and max=10
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* USER REFERRAL TAB */}
              <TabsContent value="user-referral" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users className="w-5 h-5 text-[#15B46A]" />
                      <h3 className="font-semibold">User Referral Program</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.is_referral}
                        onCheckedChange={(checked) => setFormData({...formData, is_referral: checked})}
                      />
                      <span className="text-sm text-gray-600">
                        {formData.is_referral ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Bonus to New User (Friend) *</Label>
                      <Input
                        type="number"
                        value={formData.referral_bonus_to_user}
                        onChange={(e) => setFormData({...formData, referral_bonus_to_user: parseFloat(e.target.value) || 0})}
                        placeholder="150"
                        required
                        min="0"
                        step="0.01"
                      />
                      <p className="text-xs text-gray-500">Amount the new user receives</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Bonus to Referrer (Self) *</Label>
                      <Input
                        type="number"
                        value={formData.bonus_to_userreferral}
                        onChange={(e) => setFormData({...formData, bonus_to_userreferral: parseFloat(e.target.value) || 0})}
                        placeholder="150"
                        required
                        min="0"
                        step="0.01"
                      />
                      <p className="text-xs text-gray-500">Amount the referrer receives</p>
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label>Max Uses Per Referral Code *</Label>
                      <Input
                        type="number"
                        value={formData.userreferral}
                        onChange={(e) => setFormData({...formData, userreferral: parseInt(e.target.value) || 0})}
                        placeholder="10"
                        required
                        min="1"
                      />
                      <p className="text-xs text-gray-500">How many times one user's referral code can be used</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* DRIVER REFERRAL TAB */}
              <TabsContent value="driver-referral" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users className="w-5 h-5 text-[#15B46A]" />
                      <h3 className="font-semibold">Driver Referral Program</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.is_provider_referral}
                        onCheckedChange={(checked) => setFormData({...formData, is_provider_referral: checked})}
                      />
                      <span className="text-sm text-gray-600">
                        {formData.is_provider_referral ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Bonus to New Driver (Friend) *</Label>
                      <Input
                        type="number"
                        value={formData.referral_bonus_to_provider}
                        onChange={(e) => setFormData({...formData, referral_bonus_to_provider: parseFloat(e.target.value) || 0})}
                        placeholder="150"
                        required
                        min="0"
                        step="0.01"
                      />
                      <p className="text-xs text-gray-500">Amount the new driver receives</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Bonus to Referrer Driver (Self) *</Label>
                      <Input
                        type="number"
                        value={formData.bonus_to_providerreferral}
                        onChange={(e) => setFormData({...formData, bonus_to_providerreferral: parseFloat(e.target.value) || 0})}
                        placeholder="150"
                        required
                        min="0"
                        step="0.01"
                      />
                      <p className="text-xs text-gray-500">Amount the referring driver receives</p>
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label>Max Uses Per Driver Referral Code *</Label>
                      <Input
                        type="number"
                        value={formData.providerreferral}
                        onChange={(e) => setFormData({...formData, providerreferral: parseInt(e.target.value) || 0})}
                        placeholder="10"
                        required
                        min="1"
                      />
                      <p className="text-xs text-gray-500">How many times one driver's referral code can be used</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[#15B46A]"
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending ? 'Saving...' : (editingCountry ? 'Update Country' : 'Create Country')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}