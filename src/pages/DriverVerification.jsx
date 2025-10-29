import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import DocumentUploader from "../components/verification/DocumentUploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, CheckCircle, Clock, AlertCircle, Loader2,
  FileText, Camera, Car
} from "lucide-react";
import { createPageUrl } from "@/utils";

export default function DriverVerification() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      if (userData.role !== 'driver') {
        window.location.href = createPageUrl('Home');
        return;
      }
      setUser(userData);
    } catch (error) {
      console.error("Error loading user");
      window.location.href = createPageUrl('PassengerAuth');
    } finally {
      setLoading(false);
    }
  };

  const { data: driverProfile } = useQuery({
    queryKey: ['driverProfile', user?.email],
    queryFn: () => base44.entities.DriverProfile.filter({ user_email: user.email }),
    enabled: !!user,
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['driverDocuments', user?.email],
    queryFn: () => base44.entities.Document.filter({ user_email: user.email }),
    enabled: !!user,
    refetchInterval: 10000, // Refetch cada 10s
  });

  const { data: verificationData } = useQuery({
    queryKey: ['verificationData', user?.email],
    queryFn: () => base44.entities.VerificationData.filter({ user_email: user.email }),
    enabled: !!user,
  });

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-[#15B46A]" />
      </div>
    );
  }

  const profile = driverProfile?.[0];
  const verification = verificationData?.[0];
  const backgroundCheckStatus = profile?.background_check_status || 'pending';

  const requiredDocs = ['license_front', 'license_back', 'vehicle_registration', 'selfie_with_id'];
  const uploadedDocs = documents.filter(d => requiredDocs.includes(d.document_type));
  const approvedDocs = uploadedDocs.filter(d => d.status === 'approved');
  
  const verificationSteps = [
    {
      id: 'documents',
      label: 'Upload Documents',
      completed: uploadedDocs.length === requiredDocs.length,
      icon: FileText
    },
    {
      id: 'verification',
      label: 'Document Verification',
      completed: approvedDocs.length === requiredDocs.length,
      icon: Shield
    },
    {
      id: 'background',
      label: 'Background Check',
      completed: backgroundCheckStatus === 'approved',
      icon: CheckCircle
    }
  ];

  const allStepsComplete = verificationSteps.every(step => step.completed);

  const handleComplete = () => {
    window.location.href = createPageUrl('DriverDashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#15B46A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-[#15B46A]" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Driver Verification</h1>
          <p className="text-gray-600 text-lg">
            Complete your verification to start driving with JoltCab
          </p>
        </div>

        {/* Verification Steps Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Verification Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Progress Bar */}
              <div>
                <Progress 
                  value={(verificationSteps.filter(s => s.completed).length / verificationSteps.length) * 100} 
                  className="h-3"
                />
                <p className="text-sm text-gray-600 mt-2 text-center">
                  {verificationSteps.filter(s => s.completed).length} of {verificationSteps.length} steps completed
                </p>
              </div>

              {/* Steps */}
              <div className="grid md:grid-cols-3 gap-4">
                {verificationSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.id}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        step.completed
                          ? 'border-green-200 bg-green-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`p-2 rounded-lg ${
                            step.completed ? 'bg-green-100' : 'bg-gray-100'
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Icon className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Step {index + 1}</p>
                          <p className="text-xs text-gray-600">{step.label}</p>
                        </div>
                      </div>
                      <Badge
                        className={
                          step.completed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {step.completed ? 'Complete' : 'Pending'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Background Check Status */}
        {backgroundCheckStatus !== 'pending' && (
          <Alert className={
            backgroundCheckStatus === 'approved'
              ? 'border-green-200 bg-green-50 mb-6'
              : 'border-yellow-200 bg-yellow-50 mb-6'
          }>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              {backgroundCheckStatus === 'approved' ? (
                <span className="text-green-900 font-semibold">
                  ✅ Background check approved
                </span>
              ) : (
                <span className="text-yellow-900 font-semibold">
                  ⏳ Background check in progress...
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* All Complete Message */}
        {allStepsComplete && (
          <Alert className="border-green-200 bg-green-50 mb-6">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-900">
              <strong>🎉 Verification Complete!</strong> You're all set to start driving.
            </AlertDescription>
          </Alert>
        )}

        {/* Document Uploader */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Required Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentUploader 
              userEmail={user.email} 
              onComplete={allStepsComplete ? handleComplete : null}
            />
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-sm text-blue-800 mb-3">
              If you're having trouble with verification, our support team is here to help.
            </p>
            <a href={createPageUrl('Support')}>
              <Badge className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
                Contact Support
              </Badge>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}