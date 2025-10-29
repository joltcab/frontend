
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Camera,
  FileText,
  AlertCircle,
  Eye,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DOCUMENT_TYPES = [
  {
    id: "license_front",
    label: "Driver's License (Front)",
    icon: FileText,
    required: true,
    description: "Clear photo of the front of your driver's license",
  },
  {
    id: "license_back",
    label: "Driver's License (Back)",
    icon: FileText,
    required: true,
    description: "Clear photo of the back of your driver's license",
  },
  {
    id: "vehicle_registration",
    label: "Vehicle Registration",
    icon: FileText,
    required: true,
    description: "Current vehicle registration document",
  },
  {
    id: "vehicle_insurance",
    label: "Vehicle Insurance",
    icon: FileText,
    required: false,
    description: "Current vehicle insurance certificate",
  },
  {
    id: "selfie_with_id",
    label: "Selfie with ID",
    icon: Camera,
    required: true,
    description: "Take a selfie holding your driver's license next to your face",
  },
];

export default function DriverDocumentUploader({ userEmail, onComplete }) {
  const [uploadingDoc, setUploadingDoc] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const queryClient = useQueryClient();

  // Fetch existing documents
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["driverDocuments", userEmail],
    queryFn: () => base44.entities.Document.filter({ user_email: userEmail }),
    enabled: !!userEmail,
  });

  // Fetch verification data
  const { data: verificationData } = useQuery({
    queryKey: ["verificationData", userEmail],
    queryFn: async () => {
      const data = await base44.entities.VerificationData.filter({ user_email: userEmail });
      return data[0] || null;
    },
    enabled: !!userEmail,
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async ({ file, document_type }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("document_type", document_type);
      formData.append("user_email", userEmail);

      const { data } = await base44.functions.invoke("uploadDocument", formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driverDocuments"] });
      setUploadingDoc(null);
      setUploadProgress({});
    },
  });

  // AI Verify Selfie mutation
  const verifySelfieMutation = useMutation({ // Fixed variable name: removed space
    mutationFn: async (documentId) => {
      const { data } = await base44.functions.invoke("verifySelfieID", {
        selfie_document_id: documentId,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driverDocuments"] });
      queryClient.invalidateQueries({ queryKey: ["verificationData"] });
    },
  });

  const handleFileSelect = async (e, documentType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a JPEG, PNG, or PDF file");
      return;
    }

    setUploadingDoc(documentType);
    setUploadProgress({ [documentType]: 0 });

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        const current = prev[documentType] || 0;
        if (current >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return { ...prev, [documentType]: current + 10 };
      });
    }, 200);

    try {
      await uploadMutation.mutateAsync({ file, document_type: documentType });
      setUploadProgress({ [documentType]: 100 });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload document. Please try again.");
    } finally {
      clearInterval(progressInterval);
    }
  };

  const getDocumentStatus = (docType) => {
    const doc = documents.find((d) => d.document_type === docType);
    if (!doc) return { status: "pending", doc: null };
    return { status: doc.status, doc };
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Upload className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };

    return (
      <Badge variant="outline" className={styles[status] || ""}>
        {status === "pending" ? "Under Review" : status}
      </Badge>
    );
  };

  const allRequiredUploaded = DOCUMENT_TYPES.filter((dt) => dt.required).every(
    (dt) => getDocumentStatus(dt.id).doc !== null
  );

  const allApproved = DOCUMENT_TYPES.filter((dt) => dt.required).every(
    (dt) => getDocumentStatus(dt.id).status === "approved"
  );

  const completionPercentage = Math.round(
    (documents.filter((d) => d.status === "approved").length /
      DOCUMENT_TYPES.filter((dt) => dt.required).length) *
      100
  );

  // Auto-verify selfie when uploaded
  useEffect(() => {
    const selfieDoc = documents.find((d) => d.document_type === "selfie_with_id" && d.status === "pending");
    if (selfieDoc && !verifySelfieMutation.isPending) { // Fixed variable name: removed space
      // Auto-trigger selfie verification
      verifySelfieMutation.mutate(selfieDoc.id); // Fixed variable name: removed space
    }
  }, [documents]);

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-[#15B46A] to-[#0F9456] text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">Verification Progress</h3>
              <p className="text-white/80 text-sm mt-1">
                {allApproved
                  ? "✅ All documents verified!"
                  : allRequiredUploaded
                  ? "⏳ Documents under review..."
                  : "📤 Upload required documents to continue"}
              </p>
            </div>
            <div className="text-4xl font-bold">{completionPercentage}%</div>
          </div>
          <Progress value={completionPercentage} className="h-3 bg-white/20" />
        </CardContent>
      </Card>

      {/* Verification Status */}
      {verificationData?.verification_status && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Overall Status</h4>
                <p className="text-sm text-gray-600 capitalize">
                  {verificationData.verification_status.replace("_", " ")}
                </p>
              </div>
              <Badge
                className={
                  verificationData.verification_status === "verified"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }
              >
                {verificationData.verification_status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Upload Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {DOCUMENT_TYPES.map((docType) => {
          const { status, doc } = getDocumentStatus(docType.id);
          const Icon = docType.icon;
          const isUploading = uploadingDoc === docType.id;
          const progress = uploadProgress[docType.id] || 0;

          return (
            <motion.div
              key={docType.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: DOCUMENT_TYPES.indexOf(docType) * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{docType.label}</CardTitle>
                        {docType.required && (
                          <Badge variant="outline" className="mt-1">
                            Required
                          </Badge>
                        )}
                      </div>
                    </div>
                    {doc && getStatusIcon(status)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{docType.description}</p>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Uploading...</span>
                        <span className="font-semibold">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}

                  {/* Document Status */}
                  {doc && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        {getStatusBadge(status)}
                      </div>

                      {doc.rejection_reason && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-800">
                            <strong>Rejection Reason:</strong> {doc.rejection_reason}
                          </p>
                        </div>
                      )}

                      {doc.file_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(doc.file_url, "_blank")}
                          className="w-full"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Uploaded Document
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Upload Button */}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileSelect(e, docType.id)}
                      className="hidden"
                      id={`upload-${docType.id}`}
                      disabled={isUploading}
                    />
                    <label htmlFor={`upload-${docType.id}`}>
                      <Button
                        asChild
                        className="w-full"
                        variant={doc ? "outline" : "default"}
                        disabled={isUploading}
                      >
                        <span>
                          {isUploading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : doc ? (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Re-upload Document
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Upload {docType.label}
                            </>
                          )}
                        </span>
                      </Button>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Tips Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h4 className="font-semibold text-blue-900 mb-3">📸 Tips for Good Photos:</h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Ensure good lighting - avoid shadows and glare</li>
            <li>• Make sure all text is clearly readable</li>
            <li>• Take photos straight on (not at an angle)</li>
            <li>• For selfie with ID: hold your license next to your face</li>
            <li>• File size should be less than 10MB</li>
          </ul>
        </CardContent>
      </Card>

      {/* Complete Button */}
      {allApproved && onComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Button
            onClick={onComplete}
            className="w-full bg-[#15B46A] hover:bg-[#0F9456] py-6 text-lg"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Continue to Next Step
          </Button>
        </motion.div>
      )}
    </div>
  );
}
