import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, CheckCircle, XCircle, Loader2, Camera, 
  FileText, Shield, AlertCircle, Eye 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const DOCUMENT_TYPES = [
  {
    id: 'license_front',
    label: 'Driver License (Front)',
    required: true,
    icon: FileText,
    description: 'Clear photo of the front of your driver license',
    tips: ['Ensure all text is readable', 'No glare or shadows', 'Edges clearly visible']
  },
  {
    id: 'license_back',
    label: 'Driver License (Back)',
    required: true,
    icon: FileText,
    description: 'Clear photo of the back of your driver license',
    tips: ['Include any endorsements', 'Barcode must be visible']
  },
  {
    id: 'vehicle_registration',
    label: 'Vehicle Registration',
    required: true,
    icon: FileText,
    description: 'Current vehicle registration document',
    tips: ['Must be current and valid', 'All details must be legible']
  },
  {
    id: 'vehicle_insurance',
    label: 'Vehicle Insurance',
    required: false,
    icon: Shield,
    description: 'Proof of vehicle insurance',
    tips: ['Coverage must be active', 'Minimum liability coverage required']
  },
  {
    id: 'selfie_with_id',
    label: 'Selfie with ID',
    required: true,
    icon: Camera,
    description: 'Photo of you holding your driver license next to your face',
    tips: ['Face and ID must be clearly visible', 'Good lighting required', 'No sunglasses or hat']
  }
];

export default function DocumentUploader({ userEmail, onComplete }) {
  const [documents, setDocuments] = useState({});
  const [uploading, setUploading] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState({});
  const { toast } = useToast();

  const handleFileSelect = async (docType, file) => {
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setErrors({ ...errors, [docType]: 'Only JPG, PNG, or PDF files allowed' });
      return;
    }

    // Validar tamaño (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrors({ ...errors, [docType]: 'File size must be less than 10MB' });
      return;
    }

    setUploading(docType);
    setErrors({ ...errors, [docType]: null });
    setUploadProgress({ ...uploadProgress, [docType]: 0 });

    try {
      // Simular progreso
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => ({
          ...prev,
          [docType]: Math.min((prev[docType] || 0) + 10, 90)
        }));
      }, 200);

      const { data } = await base44.functions.invoke('uploadDocument', {
        file,
        document_type: docType,
        user_email: userEmail
      });

      clearInterval(progressInterval);
      setUploadProgress({ ...uploadProgress, [docType]: 100 });

      if (data.success) {
        setDocuments({
          ...documents,
          [docType]: {
            file_url: data.document.file_url,
            status: data.document.status,
            document_id: data.document.id,
            uploaded_at: data.document.uploaded_at
          }
        });

        toast({
          title: "✅ Document Uploaded",
          description: `${docType.replace('_', ' ')} uploaded successfully`,
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrors({ ...errors, [docType]: error.message || 'Upload failed' });
      toast({
        title: "❌ Upload Failed",
        description: error.message || 'Please try again',
        variant: "destructive"
      });
    } finally {
      setUploading(null);
      setTimeout(() => {
        setUploadProgress({ ...uploadProgress, [docType]: 0 });
      }, 2000);
    }
  };

  const handleVerifySelfie = async () => {
    if (!documents.selfie_with_id || !documents.license_front) {
      toast({
        title: "Missing Documents",
        description: "Please upload both selfie and license first",
        variant: "destructive"
      });
      return;
    }

    setVerifying(true);

    try {
      const { data } = await base44.functions.invoke('verifySelfieID', {
        selfie_file_url: documents.selfie_with_id.file_url,
        license_file_url: documents.license_front.file_url
      });

      if (data.success) {
        toast({
          title: data.verification.verified ? "✅ Identity Verified" : "⚠️ Verification Pending",
          description: data.verification.verified 
            ? "Your identity has been verified successfully" 
            : "Your verification is under manual review",
        });

        if (data.verification.verified && onComplete) {
          onComplete();
        }
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setVerifying(false);
    }
  };

  const getDocumentStatus = (docType) => {
    const doc = documents[docType];
    if (!doc) return null;

    const statusConfig = {
      pending: { icon: Loader2, color: 'text-yellow-600', label: 'Processing', spin: true },
      approved: { icon: CheckCircle, color: 'text-green-600', label: 'Approved', spin: false },
      rejected: { icon: XCircle, color: 'text-red-600', label: 'Rejected', spin: false }
    };

    const config = statusConfig[doc.status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <div className={`flex items-center gap-2 ${config.color}`}>
        <Icon className={`w-4 h-4 ${config.spin ? 'animate-spin' : ''}`} />
        <span className="text-sm font-medium">{config.label}</span>
      </div>
    );
  };

  const requiredDocsUploaded = DOCUMENT_TYPES
    .filter(doc => doc.required)
    .every(doc => documents[doc.id]);

  const allDocsApproved = DOCUMENT_TYPES
    .filter(doc => doc.required)
    .every(doc => documents[doc.id]?.status === 'approved');

  const progress = (Object.keys(documents).length / DOCUMENT_TYPES.filter(d => d.required).length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Verification Progress</Label>
              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-gray-500">
              {Object.keys(documents).length} of {DOCUMENT_TYPES.filter(d => d.required).length} required documents uploaded
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Document Upload Cards */}
      <div className="grid gap-4">
        {DOCUMENT_TYPES.map((docType) => {
          const Icon = docType.icon;
          const isUploaded = !!documents[docType.id];
          const isUploading = uploading === docType.id;
          const error = errors[docType.id];
          const progress = uploadProgress[docType.id] || 0;

          return (
            <Card key={docType.id} className={isUploaded ? 'border-green-200 bg-green-50/30' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isUploaded ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Icon className={`w-5 h-5 ${isUploaded ? 'text-green-600' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base">{docType.label}</span>
                        {docType.required && (
                          <span className="text-xs text-red-600 font-semibold">*Required</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 font-normal">{docType.description}</p>
                    </div>
                  </div>
                  {isUploaded && getDocumentStatus(docType.id)}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Tips */}
                {!isUploaded && docType.tips && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <ul className="text-xs space-y-1 ml-2">
                        {docType.tips.map((tip, idx) => (
                          <li key={idx}>• {tip}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Error */}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Upload Progress */}
                {isUploading && progress > 0 && progress < 100 && (
                  <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-center text-gray-600">Uploading... {progress}%</p>
                  </div>
                )}

                {/* Upload Button or Preview */}
                {!isUploaded ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileSelect(docType.id, e.target.files[0])}
                      className="hidden"
                      id={`upload-${docType.id}`}
                      disabled={isUploading}
                    />
                    <label htmlFor={`upload-${docType.id}`}>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full"
                        disabled={isUploading}
                      >
                        <span>
                          {isUploading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Choose File
                            </>
                          )}
                        </span>
                      </Button>
                    </label>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Document Uploaded</p>
                        <p className="text-xs text-gray-500">
                          {new Date(documents[docType.id].uploaded_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(documents[docType.id].file_url, '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <label htmlFor={`reupload-${docType.id}`}>
                        <Button variant="outline" size="sm" asChild>
                          <span>
                            <Upload className="w-4 h-4 mr-1" />
                            Replace
                          </span>
                        </Button>
                      </label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileSelect(docType.id, e.target.files[0])}
                        className="hidden"
                        id={`reupload-${docType.id}`}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Submit for Verification */}
      {requiredDocsUploaded && !allDocsApproved && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-blue-900">Ready for Verification</p>
                <p className="text-sm text-blue-700">
                  All required documents uploaded. Click to start AI verification.
                </p>
              </div>
              <Button
                onClick={handleVerifySelfie}
                disabled={verifying}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {verifying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Start Verification
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Approved */}
      {allDocsApproved && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-green-900 mb-2">Verification Complete! 🎉</h3>
            <p className="text-green-700 mb-4">
              All your documents have been verified. You can now start accepting rides.
            </p>
            {onComplete && (
              <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
                Continue to Dashboard
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}