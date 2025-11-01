import React, { useState, useEffect } from "react";
import joltcab from "@/lib/joltcab-api";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "@/utils";
import DriverDocumentUploader from "@/components/verification/DriverDocumentUploader";

const STEPS = [
  {
    id: "profile",
    title: "Complete Profile",
    description: "Add your vehicle and service information",
  },
  {
    id: "documents",
    title: "Upload Documents",
    description: "Driver's license, registration, insurance",
  },
  {
    id: "background",
    title: "Background Check",
    description: "We'll verify your documents and run a background check",
  },
  {
    id: "approved",
    title: "Start Earning!",
    description: "You're all set to accept rides",
  },
];

export default function CompleteVerification() {
  const [user, setUser] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
  const userData = await joltcab.auth.me();
      setUser(userData);

      // Redirect if not a driver
      if (userData.role !== "driver") {
        window.location.href = createPageUrl("Home");
      }
    } catch (error) {
      window.location.href = createPageUrl("PassengerAuth");
    }
  };

  // Fetch driver profile
  const { data: driverProfile } = useQuery({
    queryKey: ["driverProfile", user?.email],
    queryFn: async () => {
  const profiles = await joltcab.entities.DriverProfile.filter({ user_email: user.email });
      return profiles[0] || null;
    },
    enabled: !!user,
  });

  // Fetch documents
  const { data: documents = [] } = useQuery({
    queryKey: ["documents", user?.email],
  queryFn: () => joltcab.entities.Document.filter({ user_email: user.email }),
    enabled: !!user,
  });

  // Determine current step based on completion status
  useEffect(() => {
    if (!driverProfile) return;

    const requiredDocs = ["license_front", "license_back", "vehicle_registration", "selfie_with_id"];
    const allDocsApproved = requiredDocs.every((docType) =>
      documents.some((d) => d.document_type === docType && d.status === "approved")
    );

    if (driverProfile.background_check_status === "approved") {
      setCurrentStep(3); // Approved
    } else if (allDocsApproved) {
      setCurrentStep(2); // Background check
    } else if (documents.length > 0) {
      setCurrentStep(1); // Documents
    } else {
      setCurrentStep(1); // Start with documents
    }
  }, [driverProfile, documents]);

  const handleDocumentsComplete = () => {
    setCurrentStep(2);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-[#15B46A] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Complete Your Driver Verification
          </h1>
          <p className="text-lg text-gray-600">
            Follow these steps to start earning with JoltCab
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
              <motion.div
                className="h-full bg-[#15B46A]"
                initial={{ width: "0%" }}
                animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Step Icons */}
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index <= currentStep
                      ? "bg-[#15B46A] text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="font-bold">{index + 1}</span>
                  )}
                </motion.div>
                <div className="mt-3 text-center hidden md:block">
                  <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                  <p className="text-xs text-gray-500 max-w-[120px]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <DriverDocumentUploader
                userEmail={user.email}
                onComplete={handleDocumentsComplete}
              />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="background"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-12 text-center">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Background Check in Progress
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  We're verifying your documents and conducting a background check. This
                  typically takes 1-2 business days. We'll notify you via email once complete.
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = createPageUrl("DriverDashboard")}
                >
                  Go to Dashboard
                </Button>
              </Card>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="approved"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="p-12 text-center bg-gradient-to-br from-[#15B46A] to-[#0F9456] text-white">
                <motion.div
                  className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <CheckCircle className="w-12 h-12 text-[#15B46A]" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-4">Congratulations! 🎉</h2>
                <p className="text-white/90 text-lg mb-8 max-w-md mx-auto">
                  You're approved to drive with JoltCab! Start accepting rides and earning money
                  now.
                </p>
                <Button
                  size="lg"
                  className="bg-white text-[#15B46A] hover:bg-gray-100"
                  onClick={() => window.location.href = createPageUrl("DriverDashboard")}
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}