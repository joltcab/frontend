import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Clock, CheckCircle2, XCircle, AlertCircle, Upload, Camera,
  FileText, Shield, Loader2, RefreshCcw, ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import DriverDocumentUploader from "../components/verification/DriverDocumentUploader";

export default function VerificationPending() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user");
    } finally {
      setLoading(false);
    }
  };

  const { data: verificationData } = useQuery({
    queryKey: ['verificationData', user?.email],
    queryFn: () => base44.entities.VerificationData.filter({ user_email: user?.email }),
    enabled: !!user,
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['documents', user?.email],
    queryFn: () => base44.entities.Document.filter({ user_email: user?.email }),
    enabled: !!user,
  });

  const { data: driverProfile } = useQuery({
    queryKey: ['driverProfile', user?.email],
    queryFn: async () => {
      const profiles = await base44.entities.DriverProfile.filter({ user_email: user?.email });
      return profiles[0];
    },
    enabled: !!user && user.role === 'driver',
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({ queryKey: ['verificationData'] });
      await queryClient.invalidateQueries({ queryKey: ['documents'] });
      await queryClient.invalidateQueries({ queryKey: ['driverProfile'] });
    },
  });

  const verification = verificationData?.[0];
  const verificationStatus = verification?.verification_status || 'pending';
  const backgroundCheckStatus = driverProfile?.background_check_status || 'pending';

  // Calculate completion percentage
  const requiredDocs = ['license_front', 'license_back', 'vehicle_registration', 'vehicle_insurance', 'selfie_with_id'];
  const approvedDocs = documents.filter(d => d.status === 'approved' && requiredDocs.includes(d.document_type));
  const completionPercentage = (approvedDocs.length / requiredDocs.length) * 100;

  const documentStatuses = requiredDocs.map(docType => {
    const doc = documents.find(d => d.document_type === docType);
    return {
      type: docType,
      label: docType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      status: doc?.status || 'missing',
      document: doc,
      rejectionReason: doc?.rejection_reason
    };
  });

  const getStatusInfo = () => {
    if (verificationStatus === 'verified' && backgroundCheckStatus === 'approved') {
      return {
        icon: CheckCircle2,
        color: 'text-green-600',
        bg: 'bg-green-50',
        title: '✅ Verification Complete!',
        message: 'Your account has been fully verified. You can now start accepting rides!',
        action: 'Go to Dashboard',
        actionFn: () => window.location.href = '/pages/DriverDashboard'
      };
    }

    if (verificationStatus === 'rejected') {
      return {
        icon: XCircle,
        color: 'text-red-600',
        bg: 'bg-red-50',
        title: '❌ Verification Rejected',
        message: 'Unfortunately, your application was not approved. Please contact support for more information.',
        action: 'Contact Support',
        actionFn: () => window.location.href = '/pages/Support'
      };
    }

    if (backgroundCheckStatus === 'in_progress') {
      return {
        icon: Clock,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        title: '🔍 Background Check in Progress',
        message: 'All documents approved! We are now conducting your background check. This usually takes 24-48 hours.',
        action: null
      };
    }

    if (completionPercentage === 100 && verificationStatus === 'in_review') {
      return {
        icon: Clock,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        title: '⏳ Under Review',
        message: 'All documents submitted! Our team is reviewing your application. You will be notified within 24-48 hours.',
        action: null
      };
    }

    return {
      icon: AlertCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      title: '📝 Action Required',
      message: 'Please complete your verification by uploading all required documents. Make sure they are clear and valid.',
      action: 'Upload Documents',
      actionFn: () => setShowUploader(true)
    };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 text-[#15B46A] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f7eae9d9887c2ac98e6d49/870b77da8_LogoAppjolt26.png"
            alt="JoltCab"
            className="h-20 w-20 mx-auto rounded-2xl shadow-lg mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Driver Verification
          </h1>
          <p className="text-gray-600">
            Welcome, {user?.full_name || user?.email}
          </p>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={`${statusInfo.bg} border-2`}>
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <StatusIcon className={`w-12 h-12 ${statusInfo.color} flex-shrink-0`} />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {statusInfo.title}
                  </h2>
                  <p className="text-gray-700 text-lg mb-4">
                    {statusInfo.message}
                  </p>
                  {statusInfo.action && (
                    <Button
                      size="lg"
                      onClick={statusInfo.actionFn}
                      className="bg-[#15B46A] hover:bg-[#0F9456]"
                    >
                      {statusInfo.action}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Verification Progress</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refreshMutation.mutate()}
                  disabled={refreshMutation.isPending}
                >
                  <RefreshCcw className={`w-4 h-4 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">
                    {approvedDocs.length} of {requiredDocs.length} documents approved
                  </span>
                  <span className="font-semibold text-[#15B46A]">
                    {Math.round(completionPercentage)}%
                  </span>
                </div>
                <Progress value={completionPercentage} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Documents Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {documentStatuses.map((docStatus, index) => {
                const statusConfig = {
                  approved: {
                    icon: CheckCircle2,
                    color: 'text-green-600',
                    bg: 'bg-green-50',
                    badge: 'bg-green-100 text-green-800',
                    label: 'Approved'
                  },
                  pending: {
                    icon: Clock,
                    color: 'text-yellow-600',
                    bg: 'bg-yellow-50',
                    badge: 'bg-yellow-100 text-yellow-800',
                    label: 'Under Review'
                  },
                  rejected: {
                    icon: XCircle,
                    color: 'text-red-600',
                    bg: 'bg-red-50',
                    badge: 'bg-red-100 text-red-800',
                    label: 'Rejected'
                  },
                  missing: {
                    icon: AlertCircle,
                    color: 'text-gray-400',
                    bg: 'bg-gray-50',
                    badge: 'bg-gray-100 text-gray-800',
                    label: 'Not Uploaded'
                  }
                };

                const config = statusConfig[docStatus.status];
                const Icon = config.icon;

                return (
                  <div
                    key={docStatus.type}
                    className={`flex items-center justify-between p-4 rounded-lg ${config.bg} transition-all`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-6 h-6 ${config.color}`} />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {docStatus.label}
                        </p>
                        {docStatus.rejectionReason && (
                          <p className="text-sm text-red-600 mt-1">
                            Reason: {docStatus.rejectionReason}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={config.badge}>
                        {config.label}
                      </Badge>
                      {(docStatus.status === 'missing' || docStatus.status === 'rejected') && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedDocType(docStatus.type);
                            setShowUploader(true);
                          }}
                          className="bg-[#15B46A] hover:bg-[#0F9456]"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Verification Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#15B46A]" />
                Verification Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    title: 'Document Upload',
                    description: 'Upload all required documents (license, registration, insurance, selfie)',
                    completed: completionPercentage === 100
                  },
                  {
                    step: 2,
                    title: 'Document Review',
                    description: 'Our team reviews your documents (24-48 hours)',
                    completed: verificationStatus === 'in_review' || verificationStatus === 'verified'
                  },
                  {
                    step: 3,
                    title: 'Background Check',
                    description: 'Automated background verification',
                    completed: backgroundCheckStatus === 'approved'
                  },
                  {
                    step: 4,
                    title: 'Account Activation',
                    description: 'Start accepting rides!',
                    completed: verificationStatus === 'verified' && backgroundCheckStatus === 'approved'
                  }
                ].map((step, index) => (
                  <div key={step.step} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step.completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span className="font-bold">{step.step}</span>
                      )}
                    </div>
                    <div>
                      <h4 className={`font-semibold ${step.completed ? 'text-green-600' : 'text-gray-900'}`}>
                        {step.title}
                      </h4>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Help Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
              <p className="text-blue-800 text-sm mb-4">
                If you have any questions about the verification process or need assistance, our support team is here to help.
              </p>
              <Button
                variant="outline"
                className="border-blue-300 text-blue-900 hover:bg-blue-100"
                onClick={() => window.location.href = '/pages/Support'}
              >
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Document Uploader Dialog */}
      {showUploader && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Upload Documents
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowUploader(false);
                    setSelectedDocType(null);
                  }}
                >
                  <XCircle className="w-6 h-6" />
                </Button>
              </div>
              
              <DriverDocumentUploader
                userEmail={user?.email}
                preselectedType={selectedDocType}
                onSuccess={() => {
                  setShowUploader(false);
                  setSelectedDocType(null);
                  queryClient.invalidateQueries({ queryKey: ['documents'] });
                  queryClient.invalidateQueries({ queryKey: ['verificationData'] });
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}