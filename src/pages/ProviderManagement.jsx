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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search, Download, MoreVertical, Edit, Car, Wallet, 
  FileText, History, CheckCircle, XCircle, ChevronLeft, 
  ChevronRight, User, Phone, Mail, MapPin, Calendar,
  CreditCard, DollarSign, Building
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { createPageUrl } from "@/utils";
import { toast } from "@/components/ui/use-toast";

export default function ProviderManagement() {
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState({
    sortField: 'unique_id',
    sortOrder: '1',
    searchField: 'first_name',
    searchValue: '',
    startDate: '',
    endDate: '',
    status: '3', // 0=approved, 1=declined, 2=unverified, 3=all
    page: 1,
    pageSize: 20
  });
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [addWalletDialog, setAddWalletDialog] = useState(false);
  const [walletAmount, setWalletAmount] = useState('');
  const [walletType, setWalletType] = useState('1'); // 1=add, 0=deduct

  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  // Fetch providers with filters
  const { data: providersData, isLoading } = useQuery({
    queryKey: ['providers', filters],
    queryFn: async () => {
      const drivers = await base44.entities.DriverProfile.list();
      const users = await base44.entities.User.list();
      const vehicles = await base44.entities.Vehicle.list();
      const documents = await base44.entities.Document.list();
      const serviceTypes = await base44.entities.ServiceType.list();
      const wallets = await base44.entities.Wallet.list();

      // Merge data
      let providers = drivers.map(driver => {
        const driverUser = users.find(u => u.email === driver.user_email) || {};
        const driverVehicles = vehicles.filter(v => v.driver_email === driver.user_email);
        const driverDocs = documents.filter(d => d.user_email === driver.user_email);
        const serviceType = serviceTypes.find(s => s.id === driver.service_type_id) || {};
        const wallet = wallets.find(w => w.user_email === driver.user_email) || { balance: 0 };

        // Check approval status
        const hasApprovedDocs = driverDocs.some(d => d.status === 'approved');
        const isApproved = driver.background_check_status === 'approved' && hasApprovedDocs;
        const isDeclined = driver.background_check_status === 'rejected';

        return {
          ...driver,
          unique_id: driverUser.id?.substring(0, 8).toUpperCase() || 'N/A',
          first_name: driverUser.full_name?.split(' ')[0] || '',
          last_name: driverUser.full_name?.split(' ').slice(1).join(' ') || '',
          email: driver.user_email,
          phone: driverUser.phone || 'N/A',
          country_phone_code: '+1',
          city: driverUser.city || 'N/A',
          vehicle_detail: driverVehicles[0] || {},
          type_detail: { name: serviceType.name || 'N/A' },
          wallet_currency_code: 'USD',
          total_trip: driver.total_trips || 0,
          referral_code: driverUser.referral_code || 'N/A',
          created_at: driver.created_date,
          is_approved: isApproved ? 1 : 0,
          is_declined: isDeclined ? 1 : 0,
          is_provide_service: driver.is_online ? 1 : 0,
          bank_account: driver.bank_account_number || '',
          documents: driverDocs,
          wallet_amount: wallet.balance
        };
      });

      // Apply filters
      if (filters.searchValue) {
        providers = providers.filter(p => {
          const value = filters.searchValue.toLowerCase();
          switch(filters.searchField) {
            case 'first_name':
              return p.first_name?.toLowerCase().includes(value);
            case 'last_name':
              return p.last_name?.toLowerCase().includes(value);
            case 'email':
              return p.email?.toLowerCase().includes(value);
            case 'phone':
              return p.phone?.includes(value);
            case 'unique_id':
              return p.unique_id?.toLowerCase().includes(value);
            default:
              return true;
          }
        });
      }

      if (filters.startDate && filters.endDate) {
        providers = providers.filter(p => {
          const createdDate = new Date(p.created_at);
          return createdDate >= new Date(filters.startDate) && 
                 createdDate <= new Date(filters.endDate);
        });
      }

      if (filters.status !== '3') {
        providers = providers.filter(p => {
          switch(filters.status) {
            case '0': return p.is_approved === 1;
            case '1': return p.is_declined === 1;
            case '2': return p.is_approved === 0 && p.is_declined === 0;
            default: return true;
          }
        });
      }

      // Sort
      providers.sort((a, b) => {
        let aVal = a[filters.sortField];
        let bVal = b[filters.sortField];
        
        if (filters.sortField === 'created_at') {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        }

        if (filters.sortOrder === '1') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });

      // Paginate
      const total = providers.length;
      const totalPages = Math.ceil(total / filters.pageSize);
      const startIndex = (filters.page - 1) * filters.pageSize;
      const endIndex = startIndex + filters.pageSize;
      const paginatedProviders = providers.slice(startIndex, endIndex);

      return {
        providers: paginatedProviders,
        total,
        totalPages,
        currentPage: filters.page
      };
    },
    initialData: { providers: [], total: 0, totalPages: 0, currentPage: 1 }
  });

  // Approve provider
  const approveMutation = useMutation({
    mutationFn: async (providerEmail) => {
      const drivers = await base44.entities.DriverProfile.filter({ user_email: providerEmail });
      if (drivers[0]) {
        await base44.entities.DriverProfile.update(drivers[0].id, {
          background_check_status: 'approved'
        });
      }
      
      await base44.functions.invoke('sendNotification', {
        user_email: providerEmail,
        type: 'info',
        title: '✅ Application Approved',
        message: 'Your driver application has been approved! You can now start accepting rides.',
        channels: ['push', 'email']
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      toast({
        title: "Provider Approved",
        description: "Provider has been approved successfully",
      });
    }
  });

  // Decline provider
  const declineMutation = useMutation({
    mutationFn: async (providerEmail) => {
      const drivers = await base44.entities.DriverProfile.filter({ user_email: providerEmail });
      if (drivers[0]) {
        await base44.entities.DriverProfile.update(drivers[0].id, {
          background_check_status: 'rejected'
        });
      }

      await base44.functions.invoke('sendNotification', {
        user_email: providerEmail,
        type: 'alert',
        title: '❌ Application Declined',
        message: 'Your driver application has been declined. Please contact support for more information.',
        channels: ['push', 'email']
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      toast({
        title: "Provider Declined",
        description: "Provider has been declined",
        variant: "destructive"
      });
    }
  });

  // Add/Deduct wallet
  const walletMutation = useMutation({
    mutationFn: async () => {
      const amount = parseFloat(walletAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Invalid amount');
      }

      const wallets = await base44.entities.Wallet.filter({ 
        user_email: selectedProvider.email 
      });

      let wallet = wallets[0];
      if (!wallet) {
        wallet = await base44.entities.Wallet.create({
          user_email: selectedProvider.email,
          balance: 0,
          currency: 'USD'
        });
      }

      const newBalance = walletType === '1' 
        ? wallet.balance + amount 
        : wallet.balance - amount;

      if (newBalance < 0) {
        throw new Error('Insufficient balance');
      }

      await base44.entities.Wallet.update(wallet.id, {
        balance: newBalance
      });

      await base44.entities.Transaction.create({
        user_email: selectedProvider.email,
        type: walletType === '1' ? 'deposit' : 'withdrawal',
        amount: walletType === '1' ? amount : -amount,
        currency: 'USD',
        payment_method: 'wallet',
        status: 'completed',
        reference: `admin_wallet_${Date.now()}`,
        description: `Admin ${walletType === '1' ? 'added' : 'deducted'} funds`
      });

      await base44.functions.invoke('sendNotification', {
        user_email: selectedProvider.email,
        type: 'payment',
        title: walletType === '1' ? '💰 Funds Added' : '💸 Funds Deducted',
        message: `$${amount} has been ${walletType === '1' ? 'added to' : 'deducted from'} your wallet`,
        channels: ['push', 'email']
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      setAddWalletDialog(false);
      setWalletAmount('');
      setSelectedProvider(null);
      toast({
        title: "Wallet Updated",
        description: "Provider wallet has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Export to Excel
  const handleExportExcel = async () => {
    try {
      const response = await base44.functions.invoke('generateProviderExcel', {
        filters: filters
      });
      
      window.open(response.data, '_blank');
      
      toast({
        title: "Export Started",
        description: "Excel file is being generated",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-[#15B46A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Provider Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {/* Sort */}
            <div>
              <Label>Sort By</Label>
              <Select 
                value={filters.sortField}
                onValueChange={(value) => setFilters(prev => ({ ...prev, sortField: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unique_id">ID</SelectItem>
                  <SelectItem value="created_at">Created Date</SelectItem>
                  <SelectItem value="first_name">First Name</SelectItem>
                  <SelectItem value="last_name">Last Name</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div>
              <Label>Order</Label>
              <Select
                value={filters.sortOrder}
                onValueChange={(value) => setFilters(prev => ({ ...prev, sortOrder: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Ascending</SelectItem>
                  <SelectItem value="-1">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Field */}
            <div>
              <Label>Search In</Label>
              <Select
                value={filters.searchField}
                onValueChange={(value) => setFilters(prev => ({ ...prev, searchField: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="first_name">First Name</SelectItem>
                  <SelectItem value="last_name">Last Name</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="unique_id">ID</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Value */}
            <div>
              <Label>Search</Label>
              <Input
                placeholder="Search..."
                value={filters.searchValue}
                onChange={(e) => setFilters(prev => ({ ...prev, searchValue: e.target.value }))}
              />
            </div>

            {/* Date Range */}
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>

            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>

            {/* Status Filter */}
            <div>
              <Label>Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">All</SelectItem>
                  <SelectItem value="0">Approved</SelectItem>
                  <SelectItem value="1">Declined</SelectItem>
                  <SelectItem value="2">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex items-end gap-2">
              <Button className="flex-1">Apply</Button>
              <Button variant="outline" onClick={handleExportExcel}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Providers Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Total Trips</TableHead>
                  <TableHead>Wallet</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {providersData.providers.map((provider) => (
                  <TableRow key={provider.email}>
                    <TableCell className="font-mono">{provider.unique_id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{provider.first_name} {provider.last_name}</p>
                        <p className="text-xs text-gray-500">{format(new Date(provider.created_at), 'MMM dd, yyyy')}</p>
                      </div>
                    </TableCell>
                    <TableCell>{provider.email}</TableCell>
                    <TableCell>{provider.country_phone_code} {provider.phone}</TableCell>
                    <TableCell>{provider.city}</TableCell>
                    <TableCell>
                      {provider.vehicle_detail?.make || 'N/A'} {provider.vehicle_detail?.model || ''}
                    </TableCell>
                    <TableCell>{provider.type_detail.name}</TableCell>
                    <TableCell>{provider.total_trip}</TableCell>
                    <TableCell>
                      <span className="font-mono">${provider.wallet_amount?.toFixed(2) || '0.00'}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {provider.is_approved === 1 && (
                          <Badge className="bg-green-100 text-green-800">Approved</Badge>
                        )}
                        {provider.is_declined === 1 && (
                          <Badge variant="destructive">Declined</Badge>
                        )}
                        {provider.is_approved === 0 && provider.is_declined === 0 && (
                          <Badge variant="secondary">Unverified</Badge>
                        )}
                        {provider.is_provide_service === 1 && (
                          <Badge className="bg-blue-100 text-blue-800">Online</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => window.location.href = createPageUrl('ProviderEdit') + `?email=${provider.email}`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.location.href = createPageUrl('VehicleManagement') + `?driver=${provider.email}`}>
                            <Car className="w-4 h-4 mr-2" />
                            Vehicles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.location.href = createPageUrl('DriverBankDetails') + `?driver=${provider.email}`}>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Bank Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.location.href = createPageUrl('RideHistory') + `?driver=${provider.email}`}>
                            <History className="w-4 h-4 mr-2" />
                            Trip History
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.location.href = createPageUrl('DocumentVerificationSystem') + `?driver=${provider.email}`}>
                            <FileText className="w-4 h-4 mr-2" />
                            Documents
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedProvider(provider);
                              setAddWalletDialog(true);
                            }}
                          >
                            <Wallet className="w-4 h-4 mr-2" />
                            Manage Wallet
                          </DropdownMenuItem>
                          
                          {provider.is_approved === 0 && provider.is_declined === 0 && (
                            <>
                              <DropdownMenuItem 
                                onClick={() => approveMutation.mutate(provider.email)}
                                className="text-green-600"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => declineMutation.mutate(provider.email)}
                                className="text-red-600"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Decline
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t p-4">
            <div className="text-sm text-gray-600">
              Showing {((providersData.currentPage - 1) * filters.pageSize) + 1} to{' '}
              {Math.min(providersData.currentPage * filters.pageSize, providersData.total)} of{' '}
              {providersData.total} providers
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(providersData.currentPage - 1)}
                disabled={providersData.currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-1">
                {[...Array(providersData.totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={providersData.currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(providersData.currentPage + 1)}
                disabled={providersData.currentPage === providersData.totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Wallet Dialog */}
      <Dialog open={addWalletDialog} onOpenChange={setAddWalletDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Provider Wallet</DialogTitle>
            <DialogDescription>
              Add or deduct funds from {selectedProvider?.first_name}'s wallet
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Current Balance</Label>
              <p className="text-2xl font-bold text-[#15B46A]">
                ${selectedProvider?.wallet_amount?.toFixed(2) || '0.00'}
              </p>
            </div>

            <div>
              <Label>Action</Label>
              <Select value={walletType} onValueChange={setWalletType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Add Funds</SelectItem>
                  <SelectItem value="0">Deduct Funds</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Amount ($)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={walletAmount}
                onChange={(e) => setWalletAmount(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddWalletDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => walletMutation.mutate()}
              disabled={!walletAmount || walletMutation.isPending}
            >
              {walletMutation.isPending ? 'Processing...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}