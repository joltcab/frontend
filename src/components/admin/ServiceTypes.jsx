
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus, Edit, Trash2, Car, Search, Star, Loader2, Upload,
  Image as ImageIcon, CheckCircle, AlertCircle, ArrowUp, ArrowDown
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

export default function ServiceTypes() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [uploadingPin, setUploadingPin] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    service_type: "Normal",
    description: "",
    max_space: 4,
    priority: 1,
    business_status: true,
    default_selected: false,
    icon_url: "",
    map_pin_url: ""
  });
  const queryClient = useQueryClient();

  const { data: serviceTypes = [], isLoading } = useQuery({
    queryKey: ['serviceTypes'],
    queryFn: async () => {
      console.log('🚗 [ServiceTypes] Fetching service types...');
      const result = await base44.entities.ServiceType.list('priority');
      console.log('✅ [ServiceTypes] Service types fetched:', result.length);
      console.table(result);
      return result;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      console.log('➕ [ServiceTypes] Creating service type:', data);
      
      // Check if service type with this name already exists
      const existing = serviceTypes.find(t => 
        t.name.toLowerCase().trim() === data.name.toLowerCase().trim()
      );
      
      if (existing) {
        throw new Error('Service type with this name already exists');
      }
      
      const result = await base44.entities.ServiceType.create(data);
      console.log('✅ [ServiceTypes] Service type created:', result);
      return result;
    },
    onSuccess: () => {
      console.log('🔄 [ServiceTypes] Invalidating queries after create');
      queryClient.invalidateQueries({ queryKey: ['serviceTypes'] });
      handleCloseDialog();
      alert('Service type created successfully!');
    },
    onError: (error) => {
      console.error('❌ [ServiceTypes] Error creating service type:', error);
      alert(`Error: ${error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      console.log('✏️ [ServiceTypes] Updating service type:', id, data);
      const result = await base44.entities.ServiceType.update(id, data);
      console.log('✅ [ServiceTypes] Service type updated:', result);
      return result;
    },
    onSuccess: () => {
      console.log('🔄 [ServiceTypes] Invalidating queries after update');
      queryClient.invalidateQueries({ queryKey: ['serviceTypes'] });
      handleCloseDialog();
      alert('Service type updated successfully!');
    },
    onError: (error) => {
      console.error('❌ [ServiceTypes] Error updating service type:', error);
      alert(`Error updating service type: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      console.log('🗑️ [ServiceTypes] Deleting service type:', id);
      await base44.entities.ServiceType.delete(id);
    },
    onSuccess: () => {
      console.log('🔄 [ServiceTypes] Invalidating queries after delete');
      queryClient.invalidateQueries({ queryKey: ['serviceTypes'] });
      alert('Service type deleted successfully!');
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (id) => {
      console.log('⭐ [ServiceTypes] Setting default service type:', id);
      // Unset all defaults first
      for (const type of serviceTypes) {
        if (type.id !== id && type.default_selected) {
          await base44.entities.ServiceType.update(type.id, { default_selected: false });
        }
      }
      // Set new default
      await base44.entities.ServiceType.update(id, { default_selected: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceTypes'] });
    },
  });

  const changePriorityMutation = useMutation({
    mutationFn: async ({ id, newPriority }) => {
      await base44.entities.ServiceType.update(id, { priority: newPriority });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceTypes'] });
    },
  });

  const handleFileUpload = async (file, type) => {
    if (!file) return;

    console.log(`📤 [ServiceTypes] Validating ${type}:`, file.name);

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, SVG, etc.)');
      return;
    }

    // Validar tamaño del archivo (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('Image file is too large. Maximum size is 5MB.');
      return;
    }

    const uploadType = type === 'icon' ? setUploadingIcon : setUploadingPin;
    uploadType(true);

    try {
      // Validar dimensiones de la imagen
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      await new Promise((resolve, reject) => {
        img.onload = () => {
          const expectedWidth = type === 'icon' ? 80 : 60;
          const expectedHeight = type === 'icon' ? 80 : 60;

          console.log(`📐 Image dimensions: ${img.width}x${img.height}`);
          console.log(`📏 Expected: ${expectedWidth}x${expectedHeight}`);

          // Permitir imágenes más grandes pero advertir
          if (img.width !== expectedWidth || img.height !== expectedHeight) {
            const proceed = confirm(
              `⚠️ Image size is ${img.width}x${img.height}px.\n\n` +
              `Recommended size is ${expectedWidth}x${expectedHeight}px.\n\n` +
              `The image will be resized automatically. Continue?`
            );

            if (!proceed) {
              URL.revokeObjectURL(objectUrl);
              reject(new Error('Upload cancelled by user'));
              return;
            }
          }

          URL.revokeObjectURL(objectUrl);
          resolve();
        };

        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Failed to load image'));
        };

        img.src = objectUrl;
      });

      // Subir imagen a R2
      console.log(`☁️ Uploading ${type} to R2...`);
      
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('folder', 'service-types');
      
      const { data } = await base44.functions.invoke('r2Upload', uploadFormData);
      
      if (!data.success) {
        throw new Error('Failed to upload to R2');
      }
      
      const file_url = data.file_url;
      console.log(`✅ [ServiceTypes] ${type} uploaded:`, file_url);

      setFormData(prev => ({
        ...prev,
        [type === 'icon' ? 'icon_url' : 'map_pin_url']: file_url
      }));

    } catch (error) {
      console.error(`❌ [ServiceTypes] Failed to upload ${type}:`, error);
      if (error.message !== 'Upload cancelled by user') {
        alert(`Failed to upload ${type}. Please try again.`);
      }
    } finally {
      uploadType(false);
    }
  };

  const handleOpenDialog = (type = null) => {
    if (type) {
      console.log('✏️ [ServiceTypes] Opening dialog to edit:', type.name);
      setEditingType(type);
      setFormData({
        name: type.name,
        service_type: type.service_type,
        description: type.description || "",
        max_space: type.max_space || 4,
        priority: type.priority || 1,
        business_status: type.business_status ?? true,
        default_selected: type.default_selected ?? false,
        icon_url: type.icon_url || "",
        map_pin_url: type.map_pin_url || ""
      });
    } else {
      console.log('➕ [ServiceTypes] Opening dialog to create new service type');
      setEditingType(null);
      setFormData({
        name: "",
        service_type: "Normal",
        description: "",
        max_space: 4,
        priority: Math.max(...serviceTypes.map(t => t.priority || 0), 0) + 1,
        business_status: true,
        default_selected: false,
        icon_url: "",
        map_pin_url: ""
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    console.log('❌ [ServiceTypes] Closing dialog');
    setIsDialogOpen(false);
    setEditingType(null);
    setFormData({
      name: "",
      service_type: "Normal",
      description: "",
      max_space: 4,
      priority: 1,
      business_status: true,
      default_selected: false,
      icon_url: "",
      map_pin_url: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📝 [ServiceTypes] Form submitted');
    console.log('📋 [ServiceTypes] Form data:', formData);

    if (!formData.name.trim()) {
      console.error('❌ [ServiceTypes] Service name is empty');
      alert("Please enter service name");
      return;
    }

    // Check if name already exists for update scenario (moved from global to here for clarity)
    // The createMutation handles the uniqueness check for new creations
    if (editingType) {
      const nameExistsForOthers = serviceTypes.some(t =>
        t.name.toLowerCase().trim() === formData.name.trim().toLowerCase() &&
        t.id !== editingType.id
      );
      if (nameExistsForOthers) {
        console.error('❌ [ServiceTypes] Service type name already exists for another type:', formData.name);
        alert("Service type with this name already exists for another service type.");
        return;
      }
    }


    const data = {
      ...formData,
      name: formData.name.trim()
    };

    console.log('🚀 [ServiceTypes] Submitting data:', data);

    if (editingType) {
      updateMutation.mutate({ id: editingType.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this service type?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleMovePriority = (type, direction) => {
    const currentPriority = type.priority || 0;
    const newPriority = direction === 'up' ? currentPriority - 1 : currentPriority + 1;

    if (newPriority < 1) return;

    changePriorityMutation.mutate({ id: type.id, newPriority });
  };

  const filteredTypes = serviceTypes.filter(type =>
    type.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#15B46A]" />
      </div>
    );
  }

  console.log('🎨 [ServiceTypes] Rendering. Service types:', serviceTypes.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Service Types</h2>
          <p className="text-gray-600 mt-1">Manage vehicle types and service categories</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#15B46A] hover:bg-[#0F9456]"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Service Type
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search service types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Service Types List */}
      <div className="grid gap-4">
        {filteredTypes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No service types found</p>
              <Button
                onClick={() => handleOpenDialog()}
                variant="outline"
                className="mt-4"
              >
                Create First Service Type
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Icon & Pin Preview */}
                    <div className="flex gap-3">
                      <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                        {type.icon_url ? (
                          <img src={type.icon_url} alt={type.name} className="w-full h-full object-contain" />
                        ) : (
                          <Car className="w-10 h-10 text-gray-400" />
                        )}
                      </div>
                      <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                        {type.map_pin_url ? (
                          <img src={type.map_pin_url} alt={`${type.name} pin`} className="w-full h-full object-contain" />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{type.name}</h3>
                            {type.default_selected && (
                              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                <Star className="w-3 h-3 mr-1 fill-yellow-500" />
                                Default
                              </Badge>
                            )}
                            <Badge variant={type.business_status ? "default" : "secondary"}>
                              {type.business_status ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant="outline">
                              {type.service_type}
                            </Badge>
                          </div>
                          {type.description && (
                            <p className="text-gray-600">{type.description}</p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMovePriority(type, 'up')}
                            disabled={type.priority === 1}
                          >
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMovePriority(type, 'down')}
                          >
                            <ArrowDown className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(type)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(type.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Max Passengers:</span>
                          <span className="font-semibold text-gray-900">{type.max_space || 4}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Priority:</span>
                          <span className="font-semibold text-gray-900">#{type.priority || 1}</span>
                        </div>
                        {!type.default_selected && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDefaultMutation.mutate(type.id)}
                            disabled={setDefaultMutation.isPending}
                          >
                            <Star className="w-4 h-4 mr-2" />
                            Set as Default
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingType ? "Edit Service Type" : "Add New Service Type"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., JoltCab X, JoltCab XL"
                  required
                />
              </div>

              <div>
                <Label htmlFor="service_type">Category *</Label>
                <Select
                  value={formData.service_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, service_type: value }))}
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this service type..."
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="max_space">Maximum Passengers *</Label>
                <Input
                  id="max_space"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.max_space}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_space: parseInt(e.target.value) }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="priority">Priority *</Label>
                <Input
                  id="priority"
                  type="number"
                  min="1"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Lower number = higher priority</p>
              </div>
            </div>

            {/* Icons Upload with Preview */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Service Icon (80x80px recommended)</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {formData.icon_url ? (
                    <div className="relative">
                      <div className="w-20 h-20 mx-auto mb-2 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                        <img
                          src={formData.icon_url}
                          alt="Service icon"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <p className="text-xs text-center text-gray-500 mb-2">Icon Preview</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, icon_url: "" }))}
                        className="w-full"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-3">
                        Upload 80x80px image
                      </p>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, 'icon');
                          }
                        }}
                        className="hidden"
                        id="icon-upload"
                        disabled={uploadingIcon}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={uploadingIcon}
                        onClick={() => document.getElementById('icon-upload')?.click()}
                      >
                        {uploadingIcon ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          'Upload Icon'
                        )}
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Accepts: PNG, JPG, SVG • Max 5MB
                </p>
              </div>

              <div>
                <Label>Map Pin Icon (60x60px recommended)</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {formData.map_pin_url ? (
                    <div className="relative">
                      <div className="w-16 h-16 mx-auto mb-2 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                        <img
                          src={formData.map_pin_url}
                          alt="Map pin"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <p className="text-xs text-center text-gray-500 mb-2">Pin Preview</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, map_pin_url: "" }))}
                        className="w-full"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-3">
                        Upload 60x60px image
                      </p>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, 'pin');
                          }
                        }}
                        className="hidden"
                        id="pin-upload"
                        disabled={uploadingPin}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={uploadingPin}
                        onClick={() => document.getElementById('pin-upload')?.click()}
                      >
                        {uploadingPin ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          'Upload Pin'
                        )}
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Accepts: PNG, JPG, SVG • Max 5MB
                </p>
              </div>
            </div>

            {/* Switches */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label>Business Status</Label>
                  <p className="text-sm text-gray-600">Enable this service type for bookings</p>
                </div>
                <Switch
                  checked={formData.business_status}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, business_status: checked }))}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label>Default Selection</Label>
                  <p className="text-sm text-gray-600">Set as default service type</p>
                </div>
                <Switch
                  checked={formData.default_selected}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, default_selected: checked }))}
                />
              </div>
            </div>

            {/* Alert */}
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-blue-900 text-sm">
                Make sure to upload clear, high-quality images. The service icon is displayed during booking,
                while the map pin shows the vehicle's location on the map. Images that don't match recommended dimensions will be resized.
              </AlertDescription>
            </Alert>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
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
                    Saving...
                  </>
                ) : editingType ? (
                  'Update Service Type'
                ) : (
                  'Create Service Type'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
