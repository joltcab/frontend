import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  UserCog, Mail, MessageSquare, Shield, Loader2, CheckCircle2,
  Clock, AlertCircle, LogOut, Eye, Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UserImpersonation() {
  const [targetEmail, setTargetEmail] = useState("");
  const [verificationMethod, setVerificationMethod] = useState("email");
  const [reason, setReason] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [currentImpersonation, setCurrentImpersonation] = useState(null);
  const [step, setStep] = useState(1); // 1: Request, 2: Verify, 3: Active
  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list('-created_date', 100),
  });

  const { data: activeSession } = useQuery({
    queryKey: ['activeImpersonation'],
    queryFn: async () => {
      const sessions = await base44.entities.AdminImpersonation.filter({ 
        admin_email: (await base44.auth.me()).email,
        status: 'verified'
      }, '-created_date', 1);
      
      if (sessions && sessions[0]) {
        const session = sessions[0];
        // Check if still valid
        if (new Date(session.session_expires_at) > new Date()) {
          return session;
        }
      }
      return null;
    },
    refetchInterval: 10000, // Check every 10 seconds
  });

  const requestAccessMutation = useMutation({
    mutationFn: async (data) => {
      const { data: result } = await base44.functions.invoke('requestUserAccess', data);
      return result;
    },
    onSuccess: (data) => {
      if (data.impersonation_id) {
        setCurrentImpersonation(data);
        if (data.message.includes('SuperAdmin')) {
          setStep(3); // SuperAdmin goes straight to active
          queryClient.invalidateQueries({ queryKey: ['activeImpersonation'] });
        } else {
          setStep(2); // Regular admin needs verification
        }
      }
    },
  });

  const verifyAccessMutation = useMutation({
    mutationFn: async (data) => {
      const { data: result } = await base44.functions.invoke('verifyUserAccess', data);
      return result;
    },
    onSuccess: (data) => {
      if (data.success) {
        setStep(3);
        setCurrentImpersonation(data);
        queryClient.invalidateQueries({ queryKey: ['activeImpersonation'] });
      }
    },
  });

  const endAccessMutation = useMutation({
    mutationFn: async (impersonationId) => {
      const { data } = await base44.functions.invoke('endUserAccess', {
        impersonation_id: impersonationId
      });
      return data;
    },
    onSuccess: () => {
      setStep(1);
      setCurrentImpersonation(null);
      setTargetEmail("");
      setVerificationCode("");
      setReason("");
      queryClient.invalidateQueries({ queryKey: ['activeImpersonation'] });
    },
  });

  const handleRequestAccess = () => {
    if (!targetEmail) {
      alert('Please select a user');
      return;
    }

    requestAccessMutation.mutate({
      target_user_email: targetEmail,
      verification_method: verificationMethod,
      reason: reason
    });
  };

  const handleVerifyCode = () => {
    if (!verificationCode || verificationCode.length !== 6) {
      alert('Please enter the 6-digit code');
      return;
    }

    verifyAccessMutation.mutate({
      impersonation_id: currentImpersonation.impersonation_id,
      code: verificationCode
    });
  };

  const handleEndAccess = () => {
    if (activeSession) {
      endAccessMutation.mutate(activeSession.id);
    }
  };

  const getTimeRemaining = (expiresAt) => {
    if (!expiresAt) return 'N/A';
    const ms = new Date(expiresAt) - new Date();
    if (ms <= 0) return 'Expired';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  // Show active session banner
  if (activeSession) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-2 border-green-500 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <Shield className="w-6 h-6 text-green-600" />
              Active Impersonation Session
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Accessing User</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {activeSession.target_user_email}
                  </p>
                </div>
                <Badge className="bg-green-500">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Session Expires In</p>
                  <p className="text-lg font-semibold text-orange-600">
                    {getTimeRemaining(activeSession.session_expires_at)}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>

              {activeSession.reason && (
                <div className="p-4 bg-white rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Reason</p>
                  <p className="text-sm text-gray-900">{activeSession.reason}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => window.open(`/pages/UserDashboard?user=${activeSession.target_user_email}`, '_blank')}
              >
                <Eye className="w-4 h-4 mr-2" />
                View User Dashboard
              </Button>

              <Button
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={handleEndAccess}
                disabled={endAccessMutation.isPending}
              >
                {endAccessMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4 mr-2" />
                )}
                End Session
              </Button>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-900">
                ⚠️ <strong>Important:</strong> All actions are logged and audited. Use admin access responsibly.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="w-6 h-6 text-[#15B46A]" />
            User Account Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {/* Step 1: Request Access */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div>
                  <Label>Select User</Label>
                  <select
                    className="w-full p-2 border rounded-lg mt-1"
                    value={targetEmail}
                    onChange={(e) => setTargetEmail(e.target.value)}
                  >
                    <option value="">Choose a user...</option>
                    {users.map(user => (
                      <option key={user.id} value={user.email}>
                        {user.full_name} ({user.email}) - {user.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Verification Method</Label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="email"
                        checked={verificationMethod === 'email'}
                        onChange={(e) => setVerificationMethod(e.target.value)}
                      />
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="sms"
                        checked={verificationMethod === 'sms'}
                        onChange={(e) => setVerificationMethod(e.target.value)}
                      />
                      <MessageSquare className="w-4 h-4" />
                      SMS
                    </label>
                  </div>
                </div>

                <div>
                  <Label>Reason (optional)</Label>
                  <Textarea
                    placeholder="Why do you need access to this account?"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <Button
                  className="w-full bg-[#15B46A] hover:bg-[#0F9456]"
                  onClick={handleRequestAccess}
                  disabled={!targetEmail || requestAccessMutation.isPending}
                >
                  {requestAccessMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending Verification Code...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Request Access
                    </>
                  )}
                </Button>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>How it works:</strong>
                  </p>
                  <ol className="text-xs text-blue-800 mt-2 space-y-1 list-decimal list-inside">
                    <li>Select the user you need to access</li>
                    <li>A 6-digit code will be sent to the user via their preferred method</li>
                    <li>The user provides you with the code</li>
                    <li>Enter the code to gain 1-hour access</li>
                  </ol>
                </div>
              </motion.div>
            )}

            {/* Step 2: Verify Code */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <p className="font-semibold text-green-900">Verification Code Sent</p>
                  </div>
                  <p className="text-sm text-green-800">
                    A 6-digit code has been sent to <strong>{currentImpersonation?.target_user?.full_name}</strong> via {verificationMethod}.
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-900">
                    ⏱️ Code expires in: <strong>{getTimeRemaining(currentImpersonation?.expires_at)}</strong>
                  </p>
                </div>

                <div>
                  <Label>Enter 6-Digit Code</Label>
                  <Input
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    className="text-center text-2xl tracking-widest mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ask the user to provide you with the code they received
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep(1);
                      setCurrentImpersonation(null);
                      setVerificationCode("");
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    className="flex-1 bg-[#15B46A] hover:bg-[#0F9456]"
                    onClick={handleVerifyCode}
                    disabled={verificationCode.length !== 6 || verifyAccessMutation.isPending}
                  >
                    {verifyAccessMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Verify & Access
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Display */}
          {(requestAccessMutation.isError || verifyAccessMutation.isError) && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm font-semibold text-red-900">Error</p>
              </div>
              <p className="text-sm text-red-800 mt-1">
                {requestAccessMutation.error?.message || verifyAccessMutation.error?.message || 'An error occurred'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}