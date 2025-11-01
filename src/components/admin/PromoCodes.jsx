import joltcab from "@/lib/joltcab-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Edit, Loader2, Plus, Search, Tag, Trash2 } from "lucide-react";
import { useState } from "react";

export default function PromoCodes() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: promoCodes = [], isLoading } = useQuery({
    queryKey: ['promoCodes'],
  queryFn: () => joltcab.entities.PromoCode.list('-created_date'),
  });

  const createMutation = useMutation({
  mutationFn: (data) => joltcab.entities.PromoCode.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promoCodes'] });
      setIsDialogOpen(false);
      setEditingPromo(null);
    },
  });

  const updateMutation = useMutation({
  mutationFn: ({ id, data }) => joltcab.entities.PromoCode.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promoCodes'] });
      setIsDialogOpen(false);
      setEditingPromo(null);
    },
  });

  const deleteMutation = useMutation({
  mutationFn: (id) => joltcab.entities.PromoCode.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promoCodes'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const data = {
      code: formData.get('code').toUpperCase(),
      discount_type: formData.get('discount_type'),
      discount_value: parseFloat(formData.get('discount_value')),
      max_uses: parseInt(formData.get('max_uses')) || 100,
      used_count: editingPromo?.used_count || 0,
      valid_from: formData.get('valid_from'),
      valid_until: formData.get('valid_until'),
      min_trip_amount: parseFloat(formData.get('min_trip_amount')) || 0,
      max_discount: parseFloat(formData.get('max_discount')) || null,
      active: formData.get('active') === 'on',
    };

    if (editingPromo) {
      updateMutation.mutate({ id: editingPromo.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredPromoCodes = promoCodes.filter(promo =>
    promo.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#15B46A]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Promo Codes</h2>
          <p className="text-gray-600 mt-1">Create and manage promotional discount codes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#15B46A] hover:bg-[#0F9456]" onClick={() => setEditingPromo(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Promo Code
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPromo ? 'Edit Promo Code' : 'Add New Promo Code'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Promo Code *</Label>
                  <Input
                    name="code"
                    defaultValue={editingPromo?.code}
                    placeholder="e.g., SUMMER2024"
                    required
                    className="uppercase"
                  />
                </div>

                <div>
                  <Label>Discount Type *</Label>
                  <Select name="discount_type" defaultValue={editingPromo?.discount_type || "percentage"} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Discount Value *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="discount_value"
                    defaultValue={editingPromo?.discount_value}
                    placeholder="e.g., 10 or 5.00"
                    required
                  />
                </div>

                <div>
                  <Label>Max Uses</Label>
                  <Input
                    type="number"
                    name="max_uses"
                    defaultValue={editingPromo?.max_uses || 100}
                    min="1"
                  />
                </div>

                <div>
                  <Label>Valid From</Label>
                  <Input
                    type="date"
                    name="valid_from"
                    defaultValue={editingPromo?.valid_from}
                  />
                </div>

                <div>
                  <Label>Valid Until</Label>
                  <Input
                    type="date"
                    name="valid_until"
                    defaultValue={editingPromo?.valid_until}
                  />
                </div>

                <div>
                  <Label>Min Trip Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="min_trip_amount"
                    defaultValue={editingPromo?.min_trip_amount || 0}
                    min="0"
                  />
                </div>

                <div>
                  <Label>Max Discount (for %)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="max_discount"
                    defaultValue={editingPromo?.max_discount}
                    min="0"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  name="active"
                  defaultChecked={editingPromo?.active !== false}
                />
                <Label>Active</Label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#15B46A] hover:bg-[#0F9456]">
                  {editingPromo ? 'Update Promo' : 'Create Promo'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search promo codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Promo Codes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPromoCodes.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center">
              <Tag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-semibold text-gray-900 mb-2">No promo codes found</p>
              <p className="text-gray-600">Create promo codes to offer discounts to your users</p>
            </CardContent>
          </Card>
        ) : (
          filteredPromoCodes.map(promo => (
            <Card key={promo.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center">
                      <Tag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{promo.code}</h3>
                      <p className="text-sm text-gray-600">
                        {promo.discount_type === 'percentage' 
                          ? `${promo.discount_value}% off` 
                          : `$${promo.discount_value} off`}
                      </p>
                    </div>
                  </div>
                  <Badge className={promo.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {promo.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p><strong>Used:</strong> {promo.used_count} / {promo.max_uses}</p>
                  {promo.min_trip_amount > 0 && (
                    <p><strong>Min Amount:</strong> ${promo.min_trip_amount}</p>
                  )}
                  {promo.max_discount && promo.discount_type === 'percentage' && (
                    <p><strong>Max Discount:</strong> ${promo.max_discount}</p>
                  )}
                  {promo.valid_from && (
                    <p><strong>Valid From:</strong> {format(new Date(promo.valid_from), 'MMM d, yyyy')}</p>
                  )}
                  {promo.valid_until && (
                    <p><strong>Valid Until:</strong> {format(new Date(promo.valid_until), 'MMM d, yyyy')}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setEditingPromo(promo);
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
                      if (confirm(`Delete promo code "${promo.code}"?`)) {
                        deleteMutation.mutate(promo.id);
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