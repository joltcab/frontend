import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  FileText,
  Plus,
  Edit,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle,
  MoreVertical,
  Upload,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import { format, isPast, differenceInDays } from "date-fns";
import { createPageUrl } from "@/utils";

export default function VehicleDocuments() {
  const [user, setUser] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [filePreview, setFilePreview] = useState("");
  const queryClient = useQueryClient();

  // Get vehicle_id from URL
  const urlParams = new URLSearchParams(window.location.search);
  const vehicleId = urlParams.get("vehicle_id");

  useEffect(() => {
    loadUser();
    loadVehicle();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user");
    }
  };

  const loadVehicle = async () => {
    if (!vehicleId) return;
    try {
      const vehicles = await base44.entities.Vehicle.filter({ id: vehicleId });
      if (vehicles[0]) {
        setVehicle(vehicles[0]);
      }
    } catch (error) {
      console.error("Error loading vehicle");
    }
  };

  // Fetch documents
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["vehicleDocuments", vehicleId],
    queryFn: () => base44.entities.VehicleDocument.filter({ vehicle_id: vehicleId }),
    enabled: !!vehicleId,
  });

  // Add/Update document mutation
  const documentMutation = useMutation({
    mutationFn: async (documentData) => {
      if (editingDocument) {
        return base44.entities.VehicleDocument.update(
          editingDocument.id,
          documentData
        );
      } else {
        return base44.entities.VehicleDocument.create(documentData);
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["vehicleDocuments"] });
      
      // Check if any documents are expired
      const allDocs = await base44.entities.VehicleDocument.filter({
        vehicle_id: vehicleId,
      });
      const hasExpired = allDocs.some(
        (doc) => doc.expired_date && isPast(new Date(doc.expired_date))
      );

      // Update vehicle status
      await base44.entities.Vehicle.update(vehicleId, {
        has_expired_documents: hasExpired,
      });

      setShowAddDialog(false);
      setEditingDocument(null);
      setFilePreview("");
    },
  });

  // Delete document mutation
  const deleteMutation = useMutation({
    mutationFn: (documentId) => base44.entities.VehicleDocument.delete(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicleDocuments"] });
    },
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFilePreview(file_url);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      vehicle_id: vehicleId,
      driver_email: user.email,
      document_name: formData.get("document_name"),
      document_picture: filePreview || editingDocument?.document_picture,
      unique_code: formData.get("unique_code"),
      expired_date: formData.get("expired_date") || null,
      has_expiry_date: !!formData.get("expired_date"),
      has_unique_code: !!formData.get("unique_code"),
      is_expired:
        formData.get("expired_date") &&
        isPast(new Date(formData.get("expired_date"))),
    };
    documentMutation.mutate(data);
  };

  const handleDelete = (documentId) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    deleteMutation.mutate(documentId);
  };

  const getDocumentStatus = (doc) => {
    if (!doc.expired_date) return null;
    
    const expiryDate = new Date(doc.expired_date);
    const daysUntilExpiry = differenceInDays(expiryDate, new Date());

    if (daysUntilExpiry < 0) {
      return {
        color: "red",
        text: "Expired",
        icon: AlertCircle,
      };
    } else if (daysUntilExpiry <= 30) {
      return {
        color: "yellow",
        text: `Expires in ${daysUntilExpiry} days`,
        icon: AlertCircle,
      };
    } else {
      return {
        color: "green",
        text: "Valid",
        icon: CheckCircle,
      };
    }
  };

  const DocumentDialog = () => (
    <Dialog
      open={showAddDialog}
      onOpenChange={(open) => {
        setShowAddDialog(open);
        if (!open) {
          setEditingDocument(null);
          setFilePreview("");
        }
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingDocument ? "Edit Document" : "Add New Document"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Document Name */}
          <div>
            <Label>Document Name *</Label>
            <Input
              name="document_name"
              placeholder="Vehicle Registration"
              defaultValue={editingDocument?.document_name}
              required
            />
          </div>

          {/* Upload File */}
          <div>
            <Label>Document Image *</Label>
            <div className="mt-2">
              {(filePreview || editingDocument?.document_picture) ? (
                <div className="relative">
                  <img
                    src={filePreview || editingDocument?.document_picture}
                    alt="Document preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setFilePreview("")}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploadingFile ? (
                      <div className="w-8 h-8 border-4 border-[#15B46A] border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-gray-400 mb-3" />
                        <p className="text-sm text-gray-600">
                          Click to upload document image
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG or PDF</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Unique Code */}
            <div>
              <Label>Unique Code / Number</Label>
              <Input
                name="unique_code"
                placeholder="ABC123456"
                defaultValue={editingDocument?.unique_code}
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional: Registration number, license number, etc.
              </p>
            </div>

            {/* Expiry Date */}
            <div>
              <Label>Expiry Date</Label>
              <Input
                name="expired_date"
                type="date"
                defaultValue={editingDocument?.expired_date}
                min={format(new Date(), "yyyy-MM-dd")}
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional: Leave blank if document doesn't expire
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                setEditingDocument(null);
                setFilePreview("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#15B46A] hover:bg-[#0F9456]"
              disabled={documentMutation.isPending || uploadingFile}
            >
              {documentMutation.isPending
                ? "Saving..."
                : editingDocument
                ? "Update Document"
                : "Add Document"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  if (!vehicleId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Vehicle not found</h3>
            <Button
              onClick={() => (window.location.href = createPageUrl("VehicleManagement"))}
            >
              Back to Vehicles
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#15B46A] to-[#0F9456] rounded-3xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() =>
                (window.location.href = createPageUrl("VehicleManagement"))
              }
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {vehicle?.name || "Vehicle"} Documents 📄
              </h1>
              <p className="text-white/90">
                {vehicle?.make} {vehicle?.model} • {vehicle?.plate_no}
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              setEditingDocument(null);
              setShowAddDialog(true);
            }}
            className="bg-white text-[#15B46A] hover:bg-gray-100"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Document
          </Button>
        </div>
      </motion.div>

      {/* Documents List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-[#15B46A] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : documents.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No documents yet
            </h3>
            <p className="text-gray-600 mb-6">
              Add documents like registration, insurance, etc.
            </p>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-[#15B46A] hover:bg-[#0F9456]"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Document
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => {
            const status = getDocumentStatus(doc);
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{doc.document_name}</CardTitle>
                        {status && (
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              className={
                                status.color === "red"
                                  ? "bg-red-100 text-red-800"
                                  : status.color === "yellow"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }
                            >
                              <status.icon className="w-3 h-3 mr-1" />
                              {status.text}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingDocument(doc);
                              setFilePreview(doc.document_picture);
                              setShowAddDialog(true);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => window.open(doc.document_picture, "_blank")}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(doc.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Document Image */}
                    <div
                      className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => window.open(doc.document_picture, "_blank")}
                    >
                      {doc.document_picture?.endsWith(".pdf") ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="w-16 h-16 text-gray-400" />
                        </div>
                      ) : (
                        <img
                          src={doc.document_picture}
                          alt={doc.document_name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Document Info */}
                    <div className="space-y-2 text-sm">
                      {doc.unique_code && (
                        <div>
                          <p className="text-gray-500">Code/Number</p>
                          <p className="font-semibold text-gray-900">
                            {doc.unique_code}
                          </p>
                        </div>
                      )}
                      {doc.expired_date && (
                        <div>
                          <p className="text-gray-500">Expiry Date</p>
                          <p className="font-semibold text-gray-900 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(doc.expired_date), "MMM dd, yyyy")}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setEditingDocument(doc);
                          setFilePreview(doc.document_picture);
                          setShowAddDialog(true);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(doc.document_picture, "_blank")}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <DocumentDialog />
    </div>
  );
}