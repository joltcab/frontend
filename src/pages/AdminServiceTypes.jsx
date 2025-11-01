
import React, { useState } from "react";
import { joltcab } from "@/lib/joltcab-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  Car, Plus, Edit, Trash2, CheckCircle, XCircle,
  Users, Star, Search, ArrowUpDown, Image
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminServiceTypes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    service_type: "Normal",
    business_status: true,
    default_selected: false,
    description: "",
    icon_url: "",
    map_pin_url: "",
    max_space: 4,
    priority: 1
  });

  const queryClient = useQueryClient();

  // Fetch service types
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['service-types'],
    queryFn: () => joltcab.entities.ServiceType.list()
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editingService) {
        return await joltcab.entities.ServiceType.update(editingService.id, data);
      }
      return await joltcab.entities.ServiceType.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['service-types']);
      alert(editingService ? 'Service type updated successfully!' : 'Service type created successfully!');
      handleCloseDialog();
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => joltcab.entities.ServiceType.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['service-types']);
      alert('Service type deleted successfully!');
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    }
  });

  const handleOpenDialog = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData(service);
    } else {
      setEditingService(null);
      setFormData({
        name: "",
        service_type: "Normal",
        business_status: true,
        default_selected: false,
        description: "",
        icon_url: "",
        map_pin_url: "",
        max_space: 4,
        priority: 1
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingService(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this service type?')) {
      deleteMutation.mutate(id);
    }
  };

  // Filter services
  const filteredServices = services.filter(service =>
    service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort by priority
  const sortedServices = [...filteredServices].sort((a, b) => a.priority - b.priority);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Types</h1>
          <p className="text-gray-600 mt-1">Manage vehicle service types (JoltCab X, XL, etc.)</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-[#15B46A]">
          <Plus className="w-4 h-4 mr-2" />
          Add Service Type
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search service types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Service Types Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5 text-[#15B46A]" />
            Service Types List ({sortedServices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-[#15B46A] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading service types...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Priority</TableHead>
                    <TableHead>Icon</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Default</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedServices.map((service) => (
                    <motion.tr
                      key={service.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <TableCell>
                        <Badge variant="outline">
                          <ArrowUpDown className="w-3 h-3 mr-1" />
                          {service.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {service.icon_url ? (
                          <img 
                            src={service.icon_url} 
                            alt={service.name}
                            className="w-10 h-10 object-contain"
                          />
                        ) : (
                          <Car className="w-10 h-10 text-gray-300" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {service.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant={service.service_type === 'Business' ? 'default' : 'secondary'}>
                          {service.service_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          {service.max_space}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-600 max-w-xs truncate">
                          {service.description || 'No description'}
                        </p>
                      </TableCell>
                      <TableCell>
                        {service.default_selected && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {service.business_status ? (
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
                            onClick={() => handleOpenDialog(service)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(service.id)}
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

              {sortedServices.length === 0 && (
                <div className="text-center py-12">
                  <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No service types found</p>
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
              {editingService ? 'Edit Service Type' : 'Add New Service Type'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Car className="w-5 h-5 text-[#15B46A]" />
                Basic Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Service Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="JoltCab X"
                    required
                  />
                </div>

                <div>
                  <Label>Service Type *</Label>
                  <Select
                    value={formData.service_type}
                    onValueChange={(value) => setFormData({...formData, service_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe this service type..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Max Passengers *</Label>
                  <Input
                    type="number"
                    value={formData.max_space}
                    onChange={(e) => setFormData({...formData, max_space: Number(e.target.value)})}
                    min="1"
                    max="10"
                    required
                  />
                </div>

                <div>
                  <Label>Display Priority *</Label>
                  <Input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: Number(e.target.value)})}
                    min="1"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower number = higher priority</p>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Image className="w-5 h-5 text-[#15B46A]" />
                Images
              </h3>

              <div>
                <Label>Icon URL</Label>
                <Input
                  value={formData.icon_url}
                  onChange={(e) => setFormData({...formData, icon_url: e.target.value})}
                  placeholder="https://example.com/icon.png"
                />
                <p className="text-xs text-gray-500 mt-1">Used in service selection</p>
              </div>

              <div>
                <Label>Map Pin URL</Label>
                <Input
                  value={formData.map_pin_url}
                  onChange={(e) => setFormData({...formData, map_pin_url: e.target.value})}
                  placeholder="https://example.com/pin.png"
                />
                <p className="text-xs text-gray-500 mt-1">Used for map markers</p>
              </div>

              {formData.icon_url && (
                <div className="p-4 border rounded-lg">
                  <Label className="mb-2 block">Icon Preview</Label>
                  <img 
                    src={formData.icon_url} 
                    alt="Icon preview"
                    className="w-20 h-20 object-contain mx-auto"
                  />
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Business Status</Label>
                  <p className="text-sm text-gray-500">Enable this service type</p>
                </div>
                <Switch
                  checked={formData.business_status}
                  onCheckedChange={(checked) => setFormData({...formData, business_status: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Default Selected</Label>
                  <p className="text-sm text-gray-500">Auto-select when booking</p>
                </div>
                <Switch
                  checked={formData.default_selected}
                  onCheckedChange={(checked) => setFormData({...formData, default_selected: checked})}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#15B46A]" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
