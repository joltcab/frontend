import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, Shield, Camera, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VerificationSteps({ user, role, onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [emailCode, setEmailCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [securityAnswers, setSecurityAnswers] = useState({
    question1: "",
    question2: "",
    question3: "",
  });
  const [selfieFile, setSelfieFile] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const steps = [
    { number: 1, title: "Verify Email", icon: Mail, forRoles: ["all"] },
    { number: 2, title: "Verify Phone", icon: Phone, forRoles: ["all"] },
    { number: 3, title: "Security Questions", icon: Shield, forRoles: ["all"] },
    { number: 4, title: "Selfie Verification", icon: Camera, forRoles: ["driver"] },
  ];

  const filteredSteps = steps.filter(
    (step) => step.forRoles.includes("all") || step.forRoles.includes(role)
  );

  const securityQuestions = [
    "What was the name of your first pet?",
    "In which city were you born?",
    "What is your mother's maiden name?",
  ];

  const handleVerifyEmail = async () => {
    setIsVerifying(true);
    // Simulate API call
    setTimeout(() => {
      if (emailCode.length === 6) {
        toast({
          title: "Email Verified! ✅",
          description: "Your email has been successfully verified.",
        });
        setCurrentStep(2);
      } else {
        toast({
          title: "Invalid Code",
          description: "Please enter the 6-digit code sent to your email.",
          variant: "destructive",
        });
      }
      setIsVerifying(false);
    }, 1500);
  };

  const handleSendPhoneCode = async () => {
    if (phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Code Sent! 📱",
      description: `Verification code sent to ${phoneNumber}`,
    });
  };

  const handleVerifyPhone = async () => {
    setIsVerifying(true);
    setTimeout(() => {
      if (phoneCode.length === 6) {
        toast({
          title: "Phone Verified! ✅",
          description: "Your phone number has been successfully verified.",
        });
        setCurrentStep(3);
      } else {
        toast({
          title: "Invalid Code",
          description: "Please enter the 6-digit code sent to your phone.",
          variant: "destructive",
        });
      }
      setIsVerifying(false);
    }, 1500);
  };

  const handleSecurityQuestions = () => {
    if (
      !securityAnswers.question1 ||
      !securityAnswers.question2 ||
      !securityAnswers.question3
    ) {
      toast({
        title: "Incomplete Answers",
        description: "Please answer all security questions.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Security Questions Saved! 🔐",
      description: "Your account is now more secure.",
    });

    if (role === "driver") {
      setCurrentStep(4);
    } else {
      onComplete();
    }
  };

  const handleSelfieUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelfieFile(URL.createObjectURL(file));
      toast({
        title: "Photo Uploaded! 📸",
        description: "Your selfie has been uploaded for verification.",
      });
    }
  };

  const handleCompleteSelfie = () => {
    if (!selfieFile) {
      toast({
        title: "Photo Required",
        description: "Please upload a selfie with your ID.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Verification Complete! 🎉",
      description: "Your account will be reviewed within 24 hours.",
    });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {filteredSteps.map((step, index) => {
              const Icon = step.icon;
              const isComplete = currentStep > step.number;
              const isCurrent = currentStep === step.number;

              return (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                        isComplete
                          ? "bg-[#15B46A] text-white"
                          : isCurrent
                          ? "bg-[#15B46A]/20 text-[#15B46A] border-2 border-[#15B46A]"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {isComplete ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <p className="text-xs mt-2 text-center font-medium">{step.title}</p>
                  </div>

                  {index < filteredSteps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 rounded ${
                        isComplete ? "bg-[#15B46A]" : "bg-gray-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="shadow-xl">
              {/* Step 1: Email Verification */}
              {currentStep === 1 && (
                <>
                  <CardHeader className="text-center">
                    <div className="w-20 h-20 bg-[#15B46A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-10 h-10 text-[#15B46A]" />
                    </div>
                    <CardTitle className="text-2xl">Verify Your Email</CardTitle>
                    <CardDescription>
                      We sent a 6-digit code to <strong>{user?.email}</strong>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="emailCode">Verification Code</Label>
                      <Input
                        id="emailCode"
                        placeholder="000000"
                        value={emailCode}
                        onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        maxLength={6}
                        className="text-center text-2xl tracking-widest h-14"
                      />
                    </div>

                    <Button
                      onClick={handleVerifyEmail}
                      disabled={emailCode.length !== 6 || isVerifying}
                      className="w-full h-12 bg-[#15B46A] hover:bg-[#0F9456]"
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify Email"
                      )}
                    </Button>

                    <div className="text-center">
                      <button className="text-sm text-[#15B46A] hover:underline">
                        Didn't receive code? Resend
                      </button>
                    </div>
                  </CardContent>
                </>
              )}

              {/* Step 2: Phone Verification */}
              {currentStep === 2 && (
                <>
                  <CardHeader className="text-center">
                    <div className="w-20 h-20 bg-[#15B46A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="w-10 h-10 text-[#15B46A]" />
                    </div>
                    <CardTitle className="text-2xl">Verify Your Phone</CardTitle>
                    <CardDescription>
                      Enter your phone number to receive a verification code
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="h-12"
                      />
                    </div>

                    <Button
                      onClick={handleSendPhoneCode}
                      variant="outline"
                      className="w-full h-12 border-2 border-[#15B46A] text-[#15B46A] hover:bg-[#15B46A] hover:text-white"
                    >
                      Send Verification Code
                    </Button>

                    <div className="space-y-2">
                      <Label htmlFor="phoneCode">Verification Code</Label>
                      <Input
                        id="phoneCode"
                        placeholder="000000"
                        value={phoneCode}
                        onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        maxLength={6}
                        className="text-center text-2xl tracking-widest h-14"
                      />
                    </div>

                    <Button
                      onClick={handleVerifyPhone}
                      disabled={phoneCode.length !== 6 || isVerifying}
                      className="w-full h-12 bg-[#15B46A] hover:bg-[#0F9456]"
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify Phone"
                      )}
                    </Button>
                  </CardContent>
                </>
              )}

              {/* Step 3: Security Questions */}
              {currentStep === 3 && (
                <>
                  <CardHeader className="text-center">
                    <div className="w-20 h-20 bg-[#15B46A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-10 h-10 text-[#15B46A]" />
                    </div>
                    <CardTitle className="text-2xl">Security Questions</CardTitle>
                    <CardDescription>
                      These questions help us verify your identity if needed
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {securityQuestions.map((question, index) => (
                      <div key={index} className="space-y-2">
                        <Label htmlFor={`q${index + 1}`}>{question}</Label>
                        <Input
                          id={`q${index + 1}`}
                          placeholder="Your answer..."
                          value={securityAnswers[`question${index + 1}`]}
                          onChange={(e) =>
                            setSecurityAnswers({
                              ...securityAnswers,
                              [`question${index + 1}`]: e.target.value,
                            })
                          }
                          className="h-12"
                        />
                      </div>
                    ))}

                    <Button
                      onClick={handleSecurityQuestions}
                      className="w-full h-12 bg-[#15B46A] hover:bg-[#0F9456]"
                    >
                      Continue
                    </Button>
                  </CardContent>
                </>
              )}

              {/* Step 4: Selfie Verification (Drivers Only) */}
              {currentStep === 4 && (
                <>
                  <CardHeader className="text-center">
                    <div className="w-20 h-20 bg-[#15B46A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Camera className="w-10 h-10 text-[#15B46A]" />
                    </div>
                    <CardTitle className="text-2xl">Selfie Verification</CardTitle>
                    <CardDescription>
                      Upload a selfie holding your driver's license for verification
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                      {selfieFile ? (
                        <div className="space-y-4">
                          <img
                            src={selfieFile}
                            alt="Selfie preview"
                            className="w-64 h-64 object-cover rounded-xl mx-auto"
                          />
                          <Button
                            variant="outline"
                            onClick={() => setSelfieFile(null)}
                            className="w-full"
                          >
                            Upload Different Photo
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Camera className="w-16 h-16 text-gray-400 mx-auto" />
                          <div>
                            <p className="text-lg font-semibold text-gray-900 mb-2">
                              Upload Your Selfie
                            </p>
                            <p className="text-sm text-gray-600 mb-4">
                              Make sure your face and ID are clearly visible
                            </p>
                          </div>
                          <label htmlFor="selfie-upload">
                            <Button asChild className="bg-[#15B46A] hover:bg-[#0F9456]">
                              <span>Choose Photo</span>
                            </Button>
                          </label>
                          <input
                            id="selfie-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleSelfieUpload}
                          />
                        </div>
                      )}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-sm text-blue-900 font-semibold mb-2">
                        📸 Tips for a good selfie:
                      </p>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Hold your ID next to your face</li>
                        <li>• Ensure good lighting</li>
                        <li>• Make sure text on ID is readable</li>
                        <li>• Look directly at the camera</li>
                      </ul>
                    </div>

                    <Button
                      onClick={handleCompleteSelfie}
                      disabled={!selfieFile}
                      className="w-full h-12 bg-[#15B46A] hover:bg-[#0F9456]"
                    >
                      Complete Verification
                    </Button>
                  </CardContent>
                </>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}