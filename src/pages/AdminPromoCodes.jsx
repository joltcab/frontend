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
  Gift, Plus, Edit, Trash2, Search, Percent, Calendar,
  Users, DollarSign, CheckCircle, XCircle
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminPromoCodes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: 0,
    max_discount_amount: 0,
    min_trip_amount: 0,
    max_usage_per_user: 1,
    total_usage_limit: 100,
    valid_from: "",
    valid_until: "",
    applicable_service_types: [],
    applicable_cities: [],
    first_ride_only: false,
    business_status: true
  });

  const queryClient = useQueryClient();

  // Fetch data
  const { data: promoCodes = [], isLoading } = useQuery({
    queryKey: ['promo-codes'],
    queryFn: () => base44.entities.PromoCode.list()
  });

  const { data: serviceTypes = [] } = useQuery({
    queryKey: ['service-types'],
    queryFn: () => base44.entities.ServiceType.list()
  });

  const { data: cities = [] } = useQuery({
    queryKey: ['cities'],
    queryFn: () => base44.entities.City.list()
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editingPromo) {
        return await base44.entities.PromoCode.update(editingPromo.id, data);
      }
      return await base44.entities.PromoCode.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['promo-codes']);
      alert(editingPromo ? 'Promo code updated successfully!' : 'Promo code created successfully!');
      handleCloseDialog();
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.PromoCode.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['promo-codes']);
      alert('Promo code deleted successfully!');
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    }
  });

  const handleOpenDialog = (promo = null) => {
    if (promo) {
      setEditingPromo(promo);
      setFormData(promo);
    } else {
      setEditingPromo(null);
      setFormData({
        code: "",
        discount_type: "percentage",
        discount_value: 0,
        max_discount_amount: 0,
        min_trip_amount: 0,
        max_usage_per_user: 1,
        total_usage_limit: 100,
        valid_from: "",
        valid_until: "",
        applicable_service_types: [],
        applicable_cities: [],
        first_ride_only: false,
        business_status: true
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPromo(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this promo code?')) {
      deleteMutation.mutate(id);
    }
  };

  // Filter promo codes
  const filteredPromoCodes = promoCodes.filter(promo =>
    promo.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promo Codes</h1>
          <p className="text-gray-600 mt-1">Manage discount codes and promotions</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-[#15B46A]">
          <Plus className="w-4 h-4 mr-2" />
          Add Promo Code
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search promo codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Promo Codes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#15B46A]" />
            Promo Codes ({filteredPromoCodes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-[#15B46A] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading promo codes...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Valid Period</TableHead>
                    <TableHead>Restrictions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPromoCodes.map((promo) => (
                    <motion.tr
                      key={promo.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-[#15B46A]" />
                          <span className="font-mono font-bold">{promo.code}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-purple-100 text-purple-800">
                          {promo.discount_type === 'percentage' ? (
                            <>
                              <Percent className="w-3 h-3 mr-1" />
                              {promo.discount_value}%
                            </>
                          ) : (
                            <>
                              <DollarSign className="w-3 h-3 mr-1" />
                              {promo.discount_value}
                            </>
                          )}
                        </Badge>
                        {promo.max_discount_amount > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            Max: ${promo.max_discount_amount}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            {promo.current_usage || 0} / {promo.total_usage_limit}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {promo.max_usage_per_user}x per user
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            {promo.valid_from && new Date(promo.valid_from).toLocaleDateString()}
                            {promo.valid_until && (
                              <>
                                <br />
                                <span className="text-xs text-gray-500">
                                  to {new Date(promo.valid_until).toLocaleDateString()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {promo.min_trip_amount > 0 && (
                            <Badge variant="outline" className="text-xs">
                              Min ${promo.min_trip_amount}
                            </Badge>
                          )}
                          {promo.first_ride_only && (
                            <Badge variant="outline" className="text-xs bg-yellow-50">
                              First Ride Only
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {promo.business_status ? (
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
                            onClick={() => handleOpenDialog(promo)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(promo.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>

              {filteredPromoCodes.length === 0 && (
                <div className="text-center py-12">
                  <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No promo codes found</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPromo ? 'Edit Promo Code' : 'Add New Promo Code'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Code */}
            <div>
              <Label>Promo Code *</Label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                placeholder="SUMMER2025"
                required
                className="font-mono font-bold"
              />
            </div>

            {/* Discount */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Discount Type</Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(value) => setFormData({...formData, discount_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Discount Value *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({...formData, discount_value: Number(e.target.value)})}
                  required
                />
              </div>

              <div>
                <Label>Max Discount ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.max_discount_amount}
                  onChange={(e) => setFormData({...formData, max_discount_amount: Number(e.target.value)})}
                />
              </div>
            </div>

            {/* Usage Limits */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Min Trip Amount ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.min_trip_amount}
                  onChange={(e) => setFormData({...formData, min_trip_amount: Number(e.target.value)})}
                />
              </div>

              <div>
                <Label>Uses Per User</Label>
                <Input
                  type="number"
                  value={formData.max_usage_per_user}
                  onChange={(e) => setFormData({...formData, max_usage_per_user: Number(e.target.value)})}
                />
              </div>

              <div>
                <Label>Total Usage Limit</Label>
                <Input
                  type="number"
                  value={formData.total_usage_limit}
                  onChange={(e) => setFormData({...formData, total_usage_limit: Number(e.target.value)})}
                />
              </div>
            </div>

            {/* Valid Period */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Valid From</Label>
                <Input
                  type="date"
                  value={formData.valid_from}
                  onChange={(e) => setFormData({...formData, valid_from: e.target.value})}
                />
              </div>

              <div>
                <Label>Valid Until</Label>
                <Input
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) => setFormData({...formData, valid_until: e.target.value})}
                />
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <Label>First Ride Only</Label>
                  <p className="text-sm text-gray-500">Only for new users' first ride</p>
                </div>
                <Switch
                  checked={formData.first_ride_only}
                  onCheckedChange={(checked) => setFormData({...formData, first_ride_only: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Business Status</Label>
                  <p className="text-sm text-gray-500">Enable this promo code</p>
                </div>
                <Switch
                  checked={formData.business_status}
                  onCheckedChange={(checked) => setFormData({...formData, business_status: checked})}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#15B46A]" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : editingPromo ? 'Update Code' : 'Create Code'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}